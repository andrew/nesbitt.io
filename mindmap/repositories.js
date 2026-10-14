(() => {
const $ = id => document.getElementById(id);
const graph = loadMap();
const details = $('repo-details');
let cy;
let active = false;
let selected;
let positions = new Map();
let viewportWidth = window.innerWidth;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(url, label) {
  const node = element('a', label);
  node.href = url;
  node.target = '_blank';
  node.rel = 'noopener noreferrer';
  return node;
}

function button(label, subtitle, callback) {
  const node = element('button', label, 'card');
  node.append(element('span', subtitle));
  node.addEventListener('click', callback);
  return node;
}

function highlight(id) {
  selected = id;
  cy.elements().removeClass('selected muted');
  const item = cy.getElementById(id);
  if (!item.length) return;
  item.addClass('selected');
  const nearby = item.isNode() ? item.closedNeighborhood() : item.union(item.connectedNodes());
  cy.elements().difference(nearby).addClass('muted');
}

function showRepo(id) {
  const repo = graph.repositories.find(r => r.id === id);
  details.replaceChildren(element('div', 'Repository', 'kind'), element('h2', id));
  repo.roles.forEach(role => details.append(element('span', role, 'pill')));
  if (cy.getElementById(id).data('context')) details.append(element('p', 'Connected context: shown because it has a direct connection to a repository in this area.'));
  details.append(element('p', repo.purpose), link(repo.url, 'Open repository'));
  for (const domain of repo.domains || []) {
    const paragraph = element('p');
    paragraph.append(link(`https://${domain}`, domain));
    details.append(paragraph);
  }
  for (const [title, entries] of [['Inputs', repo.inputs], ['Outputs', repo.outputs]]) {
    if (!entries?.length) continue;
    details.append(element('h3', title));
    const list = element('ul');
    entries.forEach(item => list.append(element('li', `${item.description} (${item.nature})`)));
    details.append(list);
  }
  if (repo.data_products.length) {
    details.append(element('h3', 'Collected data'));
    repo.data_products.forEach(product => details.append(element('p', `${product.label}: ${product.purpose}`)));
  }
  details.append(element('h3', 'Related concepts'));
  for (const [id, verb] of Object.entries(repo.coverage)) {
    const label = graph.elements.find(item => item.data.id === id).data.label;
    details.append(button(label, verb, () => {
      switchView(false);
      window.dispatchEvent(new CustomEvent('select-concept', { detail: id }));
    }));
  }
  if (repo.concept_review) details.append(element('p', repo.concept_review.reason));
  const edges = cy.getElementById(id).connectedEdges();
  details.append(element('h3', `${edges.length} connections in this view`));
  edges.forEach(edge => {
    const data = edge.data();
    const other = data.source === id ? data.target : data.source;
    let label = relationshipLabels[data.kind];
    if (data.kind === 'module_dependency') label = data.source === id ? 'Uses this module' : 'Used by this repository';
    if (data.kind === 'data_flow') label = data.source === id ? 'Supplies data to this repository' : 'Receives data from this repository';
    details.append(button(other, label, () => showEdge(data)));
  });
  const total = graph.relationships.filter(edge => edge.source === id || edge.target === id).length;
  if (total === 0) {
    details.append(element('p', 'No connections recorded anywhere in the map. Investigate links or consider removing this entry.'));
    if (repo.connection_review) details.append(element('p', repo.connection_review.reason));
  }
  if (total > edges.length) details.append(element('p', `${total - edges.length} more audited connections are outside the current filters.`));
  if (repo.caveats?.length) repo.caveats.forEach(note => details.append(element('p', note)));
  details.append(button('Browse this area', 'Repository list and search', overview));
  highlight(id);
}

function showEdge(data) {
  details.replaceChildren(element('div', 'Repository connection', 'kind'), element('h2', relationshipLabels[data.kind]));
  const separator = data.direction === 'undirected' ? ' ↔ ' : ' → ';
  details.append(element('p', `${data.source}${separator}${data.target}`), element('p', data.description));
  for (const nature of data.data_nature || []) details.append(element('span', nature, 'pill'));
  if (data.verification_note) details.append(element('p', data.verification_note));
  for (const id of [data.source, data.target]) details.append(button(id, 'Functions, inputs and outputs', () => showRepo(id)));
  details.append(element('h3', 'Evidence'));
  const refs = [...(data.source_references || []), ...(data.evidence || [])];
  const seen = new Set();
  for (const ref of refs) {
    const repo = graph.repositories.find(r => r.id === ref.repository);
    if (!repo || !ref.path || !ref.commit) continue;
    const url = `${repo.url}/blob/${ref.commit}/${ref.path}${ref.line ? `#L${ref.line}` : ''}`;
    if (seen.has(url)) continue;
    seen.add(url);
    const paragraph = element('p');
    paragraph.append(link(url, `${ref.repository} / ${ref.path}${ref.line ? `:${ref.line}` : ''}`));
    details.append(paragraph);
  }
  highlight(data.id);
}

function overview() {
  selected = undefined;
  cy.elements().removeClass('muted selected');
  details.replaceChildren(element('div', 'Repository map', 'kind'), element('h2', $('repo-area').selectedOptions[0].textContent), element('p', 'Select a repository to see its inputs, outputs and connections. Each connection includes the evidence recorded in the audit.'));
  if (cy.nodes('[?context]').length) details.append(element('p', 'Dashed borders mark directly connected context, including supporting repos. Only connections touching this area are shown.'));
  const label = element('label', 'Find a repository in this view');
  label.htmlFor = 'repo-search';
  const search = element('input');
  search.type = 'search';
  search.id = 'repo-search';
  const list = element('div');
  const renderList = () => {
    list.replaceChildren();
    const nodes = cy.nodes().filter(node => node.id().toLowerCase().includes(search.value.toLowerCase()));
    nodes.forEach(node => {
      const repo = graph.repositories.find(r => r.id === node.id());
      list.append(button(repo.id, `${node.data('context') ? 'Connected context · ' : ''}${repo.roles.join(' / ')}`, () => showRepo(repo.id)));
    });
    if (!nodes.length) list.append(element('p', 'No repositories match.'));
  };
  search.addEventListener('input', renderList);
  details.append(label, search, list);
  renderList();
}

function render(relayout = false) {
  const kinds = Object.keys(relationshipLabels).filter(kind => $(kind.replaceAll('_', '-')).checked);
  const elements = repositoryElementsFor(graph, { area: $('repo-area').value, supporting: $('supporting').checked, context: $('repo-context').checked, kinds });
  const nodeIds = elements.filter(item => !item.data.source).map(item => item.data.id);
  relayout ||= nodeIds.length !== cy.nodes().length || nodeIds.some(id => !cy.getElementById(id).length);
  for (const item of elements) if (positions.has(item.data.id)) item.position = positions.get(item.data.id);
  cy.elements().remove();
  cy.add(elements);
  if (relayout) {
    arrangeGraph(cy, { area: $('repo-area').value });
    positions = new Map(cy.nodes().map(node => [node.id(), { ...node.position() }]));
  }
  $('repo-caption').textContent = $('repo-area').selectedOptions[0].textContent;
  const contextCount = cy.nodes('[?context]').length;
  $('view-count').textContent = `${cy.nodes().length - contextCount} repositories${contextCount ? ` + ${contextCount} context` : ''} · ${cy.edges().length} connections`;
  $('view-note').textContent = 'Grouped by connections · Colours identify organisations · Dashed borders: context';
  $('repo-context').disabled = !$('repo-area').value;
  if (selected && cy.getElementById(selected).length) {
    const item = cy.getElementById(selected);
    item.isNode() ? showRepo(selected) : showEdge(item.data());
  } else overview();
  if (relayout) focusMobileMap(cy, selected, window.innerWidth);
}

function init() {
  cy = cytoscape({ container: $('repo-graph'), elements: [], layout: { name: 'preset' }, minZoom: .05, maxZoom: 3, wheelSensitivity: .18,
    style: [
      { selector: 'node', style: { label: 'data(label)', shape: 'round-rectangle', width: 164, height: 60, 'background-color': '#eef2e6', 'border-color': '#8c9d71', 'border-width': 1.5, color: '#30483b', 'font-family': 'system-ui', 'font-size': 12, 'text-wrap': 'wrap', 'text-max-width': 155, 'text-valign': 'center' } },
      ...organisationStyles,
      { selector: 'node[?context]', style: { 'border-style': 'dashed', 'border-width': 2, 'background-opacity': .55 } },
      { selector: 'edge', style: { 'curve-style': 'unbundled-bezier', 'control-point-distances': 65, 'control-point-weights': .5, width: 2, 'target-arrow-shape': 'triangle', 'line-color': '#358f83', 'target-arrow-color': '#358f83' } },
      { selector: 'edge[kind="supports_task"]', style: { 'line-style': 'dashed', 'line-color': '#6483ae', 'target-arrow-color': '#6483ae' } },
      { selector: 'edge[kind="functional_overlap"]', style: { 'line-style': 'dotted', 'line-color': '#b79461', 'target-arrow-color': '#b79461' } },
      { selector: 'edge[kind="module_dependency"]', style: { 'line-color': '#956cb1', 'target-arrow-color': '#956cb1', 'control-point-distances': 110 } },
      { selector: 'edge[direction="undirected"]', style: { 'target-arrow-shape': 'none' } },
      { selector: '.muted', style: { opacity: .2 } },
      { selector: 'node.selected', style: { 'border-width': 4, 'border-color': '#345d50' } },
      { selector: 'edge.selected', style: { width: 4, label: 'data(label)', 'font-size': 12, 'text-background-color': '#f6f7f3', 'text-background-opacity': 1, 'text-background-padding': 5 } }
    ]
  });
  cy.on('tap', 'node', event => showRepo(event.target.id()));
  cy.on('tap', 'edge', event => showEdge(event.target.data()));
  cy.on('tap', event => { if (event.target === cy) overview(); });
  cy.on('tap', () => window.dispatchEvent(new Event('map-change')));
  cy.on('dragfree', 'node', event => positions.set(event.target.id(), { ...event.target.position() }));
}

function switchView(repositories) {
  active = repositories;
  $('concept-view').hidden = $('concept-tools').hidden = repositories;
  $('repository-view').hidden = $('repository-tools').hidden = !repositories;
  $('concept-tab').setAttribute('aria-pressed', String(!repositories));
  $('repository-tab').setAttribute('aria-pressed', String(repositories));
  if (repositories) {
    if (!cy) { init(); render(true); }
    else { cy.resize(); render(); cy.fit(cy.elements(), 40); }
    focusMobileMap(cy, selected, window.innerWidth);
  } else {
    $('view-count').textContent = `${graph.elements.filter(e => !e.data.source).length} concepts · ${graph.software.length} repositories mapped`;
    $('view-note').textContent = 'Grouped by connections · Drag nodes to adjust · Evidence toggles preserve positions';
    window.dispatchEvent(new Event('resize'));
  }
}

const all = element('option', 'All areas');
all.value = '';
$('repo-area').append(all);
graph.areas.forEach(area => {
  const option = element('option', area.label);
  option.value = area.id;
  $('repo-area').append(option);
});
$('repo-area').value = 'dependencies';
$('repository-tab').addEventListener('click', () => switchView(true));
$('concept-tab').addEventListener('click', () => switchView(false));
for (const id of ['repo-area', 'supporting', 'repo-context']) $(id).addEventListener('change', () => { selected = undefined; render(true); });
for (const kind of Object.keys(relationshipLabels)) $(kind.replaceAll('_', '-')).addEventListener('change', () => render());
$('repo-fit').addEventListener('click', () => cy.fit(cy.elements(), 40));
$('repo-zoom-in').addEventListener('click', () => cy.zoom(cy.zoom() * 1.2));
$('repo-zoom-out').addEventListener('click', () => cy.zoom(cy.zoom() / 1.2));
$('repo-reset').addEventListener('click', () => {
  $('repo-area').value = 'dependencies';
  $('supporting').checked = false;
  $('repo-context').checked = true;
  for (const kind of Object.keys(relationshipLabels)) $(kind.replaceAll('_', '-')).checked = true;
  selected = undefined;
  positions.clear();
  render(true);
});
window.addEventListener('resize', () => {
  if (!active || !cy) return;
  cy.resize();
  if (viewportWidth !== window.innerWidth) {
    cy.fit(cy.elements(), 40);
    focusMobileMap(cy, selected, window.innerWidth);
    viewportWidth = window.innerWidth;
  }
});
window.repositoryView = {
  state: () => ({ view: active ? 'repositories' : 'concepts', area: $('repo-area').value, supporting: $('supporting').checked, context: $('repo-context').checked, kinds: Object.keys(relationshipLabels).filter(kind => $(kind.replaceAll('_', '-')).checked), selected }),
  switchView,
  restore(state) {
    $('repo-area').value = state.area;
    $('supporting').checked = state.supporting;
    $('repo-context').checked = state.context;
    for (const kind of Object.keys(relationshipLabels)) $(kind.replaceAll('_', '-')).checked = state.kinds.includes(kind);
    selected = state.selected;
    switchView(true);
  }
};
switchView(true);
})();
