import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const site = new URL('../_site/', import.meta.url);
const server = createServer(async (req, res) => {
  const paths = {
    '/cwe/': ['cwe/index.html', 'text/html'],
    '/cwe/cwe_data.json': ['cwe/cwe_data.json', 'application/json'],
    '/cwe/map.js': ['cwe/map.js', 'text/javascript']
  };
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

  const years = Object.keys(data.years).filter(year => year >= '2020').sort();
  assert.ok(years.length > 1, 'Expected several years of map data');
  const history = await command('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const click = element => element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      click(document.querySelector('#legend [data-abs="Base"]'));
      click(document.querySelector('#labelmode [data-mode="dewey"]'));
      click(document.querySelector('#top [data-id]'));
      const selectedId = document.querySelector('circle.hl').__data__.data.id;
      const focus = document.getElementById('crumbs').textContent;
      const select = document.getElementById('year');
      const snapshot = () => ({
        meta: document.getElementById('meta').textContent,
        counts: Object.fromEntries([...document.querySelectorAll('circle')]
          .filter(circle => circle.__data__.depth === 2)
          .map(circle => [circle.__data__.data.id, circle.__data__.data.count])),
        radii: [...document.querySelectorAll('circle')].map(circle => +circle.getAttribute('r')),
        positions: [...document.querySelectorAll('circle, text.leaf')].map(el => el.getAttribute('transform')),
        categories: [...document.querySelectorAll('circle')].filter(circle => circle.__data__.depth === 1).map(circle => +circle.getAttribute('r')),
        arcs: [...document.querySelectorAll('defs path')].map(path => path.getAttribute('d')),
        top: [...document.querySelectorAll('#top [data-id]')].map(el => ({ id: el.dataset.id, text: el.textContent })),
        details: document.querySelector('#info .count').textContent,
        focus: document.getElementById('crumbs').textContent,
        mode: document.querySelector('#labelmode .on').dataset.mode,
        filter: [...document.querySelectorAll('#legend div:not(.dim)')].map(el => el.dataset.abs)
      });
      const before = snapshot();
      const snapshots = ${JSON.stringify([years[0], years[1], ''])}.map(year => {
        select.value = year;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return snapshot();
      });
      click(document.querySelector('#top [data-id]'));
      return { before, snapshots, focus, selectedId,
        options: [...select.options].map(option => option.value),
        clickedId: document.querySelector('circle.hl').__data__.data.id,
        topId: document.querySelector('#top [data-id]').dataset.id };
    })()`
  });
  assert.equal(history.exceptionDetails, undefined, JSON.stringify(history.exceptionDetails));
  const rendered = history.result.value;
  assert.deepEqual(rendered.options, ['', ...years.toReversed()], 'Year selector must start at 2020');
  const leaves = data.tree.children.flatMap(category => category.children);
  const fmt = value => value.toLocaleString('en-US');
  for (const [index, year] of [years[0], years[1], ''].entries()) {
    const snapshot = rendered.snapshots[index];
    const counts = {};
    let cves = 0;
    for (const [published, bucket] of Object.entries(data.years)) {
      if (published > year) continue;
      cves += bucket.cve_files;
      for (const [id, count] of Object.entries(bucket.counts)) counts[id] = (counts[id] || 0) + count;
    }
    const expected = Object.fromEntries(leaves.map(leaf => [leaf.id, year ? (counts[leaf.id.slice(4)] || 0) : leaf.count]));
    const refs = year ? Object.values(counts).reduce((sum, count) => sum + count, 0) : data.total_refs;
    assert.deepEqual(snapshot.counts, expected, `Circle counts must include all publication years through ${year || 'today'}`);
    assert.equal(snapshot.meta, `CWE ${data.cwe_version} · ${fmt(year ? cves : data.cve_files)} CVEs · ${fmt(refs)} CWE refs`);
    assert.ok(snapshot.details.startsWith(`${fmt(expected[rendered.selectedId])} CVE refs`), 'Open details must update with the year');
    assert.equal(snapshot.focus, rendered.focus, 'Year changes must preserve the zoomed category');
    assert.equal(snapshot.mode, 'dewey', 'Year changes must preserve the label mode');
    assert.deepEqual(snapshot.filter, ['Base'], 'Year changes must preserve the abstraction filter');
    assert.ok(snapshot.radii.every(radius => Number.isFinite(radius) && radius > 0), 'All circles must remain visible');
    assert.deepEqual(snapshot.positions, rendered.snapshots[0].positions, 'Year changes must keep circle and label positions fixed');
    assert.deepEqual(snapshot.categories, rendered.snapshots[0].categories, 'Category boundaries must stay fixed');
    assert.deepEqual(snapshot.arcs, rendered.snapshots[0].arcs, 'Category labels must stay fixed');
    if (index > 0) {
      assert.ok(snapshot.radii.every((radius, i) => radius >= rendered.snapshots[index - 1].radii[i]), 'Cumulative growth must never shrink a circle');
    }
    const highest = Object.values(expected).sort((a, b) => b - a).filter(count => count > 0).slice(0, 10);
    assert.deepEqual(snapshot.top.map(item => expected[item.id]), highest, 'Most referenced must rank the selected period');
    for (const item of snapshot.top) assert.ok(item.text.includes(` · ${fmt(expected[item.id])} · `));
  }
  assert.notDeepEqual(rendered.snapshots[0].radii, rendered.snapshots[2].radii, 'Selecting an older year must resize the circles');
  assert.equal(rendered.clickedId, rendered.topId, 'Updated rankings must remain clickable');

  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  const playback = await command('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      const select = document.getElementById('year');
      const button = document.getElementById('play');
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const radii = () => [...document.querySelectorAll('circle')].map(circle => +circle.getAttribute('r'));
      const positions = () => [...document.querySelectorAll('circle, text.leaf')].map(el => el.getAttribute('transform'));
      select.value = '';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      button.click();
      const start = { year: select.value, button: button.textContent };
      const initialPositions = positions();
      const deadline = Date.now() + 5000;
      while (select.value === start.year && Date.now() < deadline) await wait(20);
      button.click();
      const advanced = { year: select.value, meta: document.getElementById('meta').textContent, button: button.textContent };
      const beginning = radii();
      await wait(250);
      const middle = radii();
      const middlePositions = positions();
      await wait(1500);
      return { start, advanced, beginning, middle, settled: radii(), pausedYear: select.value,
        initialPositions, middlePositions, settledPositions: positions() };
    })()`
  });
  assert.equal(playback.exceptionDetails, undefined, JSON.stringify(playback.exceptionDetails));
  const played = playback.result.value;
  assert.deepEqual(played.start, { year: years[0], button: 'Pause' }, 'Play must start at 2020');
  assert.equal(played.advanced.year, years[1], 'Playback must advance to the next year');
  assert.equal(played.advanced.meta, rendered.snapshots[1].meta, 'Playback must update the displayed totals');
  assert.equal(played.advanced.button, 'Play', 'Pause must restore the Play button');
  assert.equal(played.pausedYear, years[1], 'Pause must stop automatic year changes');
  assert.notDeepEqual(played.beginning, played.middle, 'Circles must animate between years');
  assert.notDeepEqual(played.middle, played.settled, 'Circle growth must continue across the transition');
  assert.deepEqual(played.middlePositions, played.initialPositions, 'Playback must not move circles or labels during the transition');
  assert.deepEqual(played.settledPositions, played.initialPositions, 'Playback must retain the same layout after the transition');
  assert.ok(played.settled.every((radius, i) => radius >= played.beginning[i]), 'Playback must grow circles without shrinking others');

  const completion = await command('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      const select = document.getElementById('year');
      const button = document.getElementById('play');
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      button.click();
      const resumed = select.value;
      const seen = [resumed];
      const deadline = Date.now() + ${years.length * 1500 + 2000};
      while (button.textContent === 'Pause' && Date.now() < deadline) {
        await wait(50);
        if (select.value !== seen[seen.length - 1]) seen.push(select.value);
      }
      await wait(1600);
      const finished = { year: select.value, button: button.textContent };
      button.click();
      const restarted = select.value;
      select.value = ${JSON.stringify(years[1])};
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await wait(1700);
      return { resumed, seen, finished, restarted, manual: { year: select.value, button: button.textContent } };
    })()`
  });
  assert.equal(completion.exceptionDetails, undefined, JSON.stringify(completion.exceptionDetails));
  const completed = completion.result.value;
  assert.equal(completed.resumed, years[1], 'Play after Pause must resume the selected year');
  assert.deepEqual(completed.seen, years.slice(1), 'Playback must visit each later year in order');
  assert.deepEqual(completed.finished, { year: years.at(-1), button: 'Play' }, 'Playback must stop at the latest year');
  assert.equal(completed.restarted, years[0], 'Play after completion must restart at 2020');
  assert.deepEqual(completed.manual, { year: years[1], button: 'Play' }, 'Manual selection must stop playback');
  console.log(`cwe_page_test.mjs ok (${state.circles} circles; ${state.meta}; ${state.updated})`);
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => chrome.exitCode !== null || launchError ? resolve() : chrome.once('exit', resolve));
  await new Promise(resolve => server.close(resolve));
  await rm(profile, { recursive: true, force: true });
}
