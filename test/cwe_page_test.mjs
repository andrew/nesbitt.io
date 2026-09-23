import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const site = new URL('../_site/', import.meta.url);
const server = createServer(async (req, res) => {
  const paths = { '/cwe/': ['cwe/index.html', 'text/html'], '/cwe/cwe_data.json': ['cwe/cwe_data.json', 'application/json'] };
  const route = paths[req.url];
  if (!route) { res.writeHead(404).end(); return; }
  try {
    const body = await readFile(new URL(route[0], site));
    res.writeHead(200, { 'Content-Type': route[1] }).end(body);
  } catch (error) {
    res.writeHead(500).end(error.message);
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const profile = await mkdtemp(join(tmpdir(), 'cwe-browser-test-'));
const executable = process.env.CHROME_BIN || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome');
const chrome = spawn(executable, [
  '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
], { stdio: 'ignore' });
let launchError;
chrome.on('error', error => { launchError = error; });
let socket;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    if (launchError) throw launchError;
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await delay(100); }
  }
  assert.ok(port, 'Chrome did not start; set CHROME_BIN to a Chrome or Chromium executable');
  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) pending.get(message.id)?.(message);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 20000);
    pending.set(id, message => {
      clearTimeout(timeout);
      pending.delete(id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await command('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/cwe/` });
  let ready = false;
  for (let i = 0; i < 150; i++) {
    const result = await command('Runtime.evaluate', { expression: '!!document.querySelector("circle")' });
    if (result.result.value) { ready = true; break; }
    await delay(100);
  }
  assert.ok(ready, 'CWE map did not render');
  const result = await command('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const crumbs = () => document.getElementById('crumbs').textContent;
      const root = crumbs();
      const circles = [...document.querySelectorAll('circle')];
      const category = circles.find(circle => circle.__data__.depth === 1);
      const leaf = circles.find(circle => circle.__data__.parent === category.__data__);
      const click = element => element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      click(category);
      const zoomed = crumbs();
      click(leaf);
      const afterLeaf = crumbs();
      click(category);
      const afterCategory = crumbs();
      click(document.getElementById('chart'));
      return { root, zoomed, afterLeaf, afterCategory, afterBackground: crumbs(),
        meta: document.getElementById('meta').textContent, circles: circles.length,
        updated: document.getElementById('updated').textContent,
        lineBreak: document.getElementById('updated').previousElementSibling.tagName };
    })()`
  });
  assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails));
  const state = result.result.value;
  const data = JSON.parse(await readFile(new URL('cwe/cwe_data.json', site), 'utf8'));
  assert.equal(state.circles, data.tree.children.length + data.tree.children.flatMap(c => c.children).length);
  assert.notEqual(state.zoomed, state.root, 'Clicking a category must zoom in');
  assert.equal(state.afterLeaf, state.zoomed, 'Clicking a weakness must retain the category zoom');
  assert.equal(state.afterCategory, state.zoomed, 'Clicking the focused category must retain its zoom');
  assert.equal(state.afterBackground, state.root, 'Clicking the background must zoom out');
  assert.equal(state.updated, `Updated ${data.generated.slice(0, 10)}`, 'Snapshot date must be visible without a timezone');
  assert.equal(state.lineBreak, 'BR', 'Snapshot date must start on its own line');
  console.log(`cwe_page_test.mjs ok (${state.circles} circles; ${state.meta}; ${state.updated})`);
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => chrome.exitCode !== null || launchError ? resolve() : chrome.once('exit', resolve));
  await new Promise(resolve => server.close(resolve));
  await rm(profile, { recursive: true, force: true });
}
