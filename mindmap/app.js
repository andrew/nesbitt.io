(() => {
const $ = id => document.getElementById(id);
const details = $('details');
let graph, cy;
let concept = 'dependency';
let repository;
let selection = concept;
let viewportWidth = window.innerWidth;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function anchor(url, text) {
  const node = element('a', text);
  node.href = url;
  node.target = '_blank';
  node.rel = 'noopener noreferrer';
  return node;
}

function button(title, subtitle, action) {
  const node = element('button', title, 'card');
  if (subtitle) node.append(element('span', subtitle));
  node.addEventListener('click', action);
  return node;
}

function source(repo) {
  const section = element('div', '', 'evidence');
  section.append(element('h3', 'Audit source'), anchor(`${repo.url}/blob/${repo.source.commit}/${repo.source.path}`, `${repo.id} / ${repo.source.path}`));
  section.append(element('p', `Public repository audit: ${graph.audit_date}. Contributions describe what each tool does with a concept; they do not imply a tool-to-tool integration.`));
  if (repo.concept_sources) {
    const references = element('details');
    references.append(element('summary', 'Concept evidence'));
    references.append(element('p', repo.concept_sources.note));
    for (const ref of repo.concept_sources.references) {
      const paragraph = element('p');
      paragraph.append(anchor(`${repo.url}/blob/${ref.commit}/${ref.path}`, ref.path));
      references.append(paragraph);
    }
    section.append(references);
  }
  details.append(section);
}

function showRepo(id) {
  repository = selection = id;
  render();
  const repo = graph.software.find(r => r.id === id);
  details.replaceChildren(element('div', 'Software', 'kind'), element('h2', repo.id));
  repo.roles.forEach(role => details.append(element('span', role, 'pill')));
  details.append(element('p', repo.purpose), anchor(repo.url, 'Open repository'));
  for (const domain of repo.domains || []) {
    const paragraph = element('p');
    paragraph.append(anchor(`https://${domain}`, domain));
    details.append(paragraph);
  }
  for (const [title, entries] of [['Inputs', repo.inputs], ['Outputs', repo.outputs]]) {
    details.append(element('h3', title));
    const list = element('ul');
    for (const item of entries || []) list.append(element('li', `${item.description} (${item.nature})`));
    details.append(list);
  }
  if (repo.data_products.length) {
    details.append(element('h3', 'Collected data'));
    for (const product of repo.data_products) details.append(element('p', `${product.label}: ${product.purpose}`));
  }
  if (repo.concept_review) details.append(element('p', repo.concept_review.reason));
  details.append(element('h3', 'Related concepts'));
  for (const [id, verb] of Object.entries(repo.coverage)) {
    const label = graph.elements.find(e => e.data.id === id).data.label;
    details.append(button(label, verb, () => selectConcept(id)));
  }
  source(repo);
  details.scrollTop = 0;
  highlight(id);
  focusMobileMap(cy, id, window.innerWidth);
}

function showConcept(id) {
  const data = graph.elements.find(e => e.data.id === id).data;
  details.replaceChildren(element('div', 'Shared concept', 'kind'), element('h2', data.label), element('p', data.description));
  details.append(element('h3', 'Software contributions'));
  const repos = contributionsFor(graph, id);
  if (!repos.length) details.append(element('p', 'No software contributions recorded for this concept.'));
  for (const repo of repos) details.append(button(repo.id, `${repo.coverage[id]} · ${repo.roles.join(' / ')}`, () => showRepo(repo.id)));
  details.append(element('h3', 'Connections'));
  for (const { data: edge } of graph.elements.filter(e => e.data.source === id || e.data.target === id)) {
    const from = graph.elements.find(e => e.data.id === edge.source).data.label;
    const to = graph.elements.find(e => e.data.id === edge.target).data.label;
    details.append(button(`${from} → ${to}`, `${edge.label} · ${edge.nature}`, () => showEdge(edge)));
  }
  if (data.tables.length) {
    const section = element('details', '', 'evidence');
    section.append(element('summary', 'Related table vocabulary'));
    section.append(element('p', 'Tables from this concept’s broader area in the audit. These are vocabulary clues, not one-to-one mappings.'));
    for (const table of data.tables) section.append(element('p', `${table.repository}: ${table.tables.join(', ')}`));
    details.append(section);
  }
  highlight(id);
}

function showEdge(data) {
  selection = data.id;
  const label = id => cy.getElementById(id).data('label')?.replace('\n', '') || graph.elements.find(e => e.data.id === id)?.data.label || id;
  details.replaceChildren(element('div', data.kind === 'contribution' ? 'Software contribution' : 'Concept relationship', 'kind'), element('h2', data.label), element('p', `${label(data.source)} → ${label(data.target)}`), element('p', data.description));
  if (data.nature) {
    details.append(element('span', data.nature, 'pill'));
    details.append(element('p', data.nature === 'intrinsic' ? 'Evidence in, or derived from, the software’s own contents and history.' : 'Context supplied by another system or source.'));
  }
  if (data.basis) details.append(element('p', data.basis));
  if (data.repository) {
    details.append(button(data.repository, 'Functions, inputs and outputs', () => showRepo(data.repository)));
    source(graph.software.find(r => r.id === data.repository));
  }
  highlight(data.id);
}

function highlight(id) {
  cy.elements().removeClass('selected muted');
  const selected = cy.getElementById(id);
  if (!selected.length) return;
  selected.addClass('selected');
  const nearby = selected.isNode() ? selected.closedNeighborhood() : selected.union(selected.connectedNodes());
  cy.elements().difference(nearby).addClass('muted');
}

function selectConcept(id, reset = false) {
  repository = undefined;
  concept = selection = id;
  render(reset);
  showConcept(id);
  focusMobileMap(cy, concept, window.innerWidth);
}

function render(reset = false) {
  updateConceptGraph(cy, graph, { concept, repository, software: $('software').checked, intrinsic: $('intrinsic').checked, extrinsic: $('extrinsic').checked }, reset);
  const label = graph.elements.find(e => e.data.id === concept).data.label;
  $('caption').textContent = repository ? `Concepts used by: ${repository}` : $('software').checked ? `Software contributing to: ${label.toLowerCase()}` : 'Shared software concepts';
  const selected = cy.getElementById(selection);
  if (!selected.length && !repository) { selection = concept; showConcept(concept); }
  else highlight(selection);
}

try {
  graph = loadMap();
  cy = cytoscape({ container: $('graph'), elements: [], layout: { name: 'preset' }, minZoom: .1, maxZoom: 2.5, wheelSensitivity: .18,
    style: [
      { selector: 'node', style: { label: 'data(label)', shape: 'round-rectangle', width: 178, height: 55, 'background-color': '#fff', 'border-color': '#a6b7ac', 'border-width': 1.3, color: '#243e38', 'font-family': 'system-ui', 'font-size': 14, 'font-weight': 500, 'text-valign': 'center', 'text-wrap': 'wrap', 'text-max-width': 162 } },
      { selector: 'node[kind="software"]', style: { 'background-color': '#eaf0df', 'border-color': '#859a66', height: 66, 'font-size': 12 } },
      ...organisationStyles,
      { selector: 'edge', style: { label: 'data(label)', 'curve-style': 'bezier', width: 1.5, 'target-arrow-shape': 'triangle', 'line-color': '#a7b5ab', 'target-arrow-color': '#a7b5ab', 'font-size': 11, color: '#576b62', 'text-background-color': '#f6f7f3', 'text-background-opacity': 1, 'text-background-padding': 4, 'text-rotation': 'autorotate', 'text-margin-y': -2 } },
      { selector: 'edge[nature="intrinsic"]', style: { 'line-color': '#238d83', 'target-arrow-color': '#238d83', color: '#176d65' } },
      { selector: 'edge[nature="extrinsic"]', style: { 'line-color': '#a17abb', 'target-arrow-color': '#a17abb', color: '#79548f' } },
      { selector: 'edge[certainty="conditional"]', style: { 'line-style': 'dotted' } },
      { selector: 'edge[source="files"][target="license"]', style: { 'curve-style': 'unbundled-bezier', 'control-point-distances': 110, 'control-point-weights': .5 } },
      { selector: 'edge[source="files"][target="dependency"]', style: { 'curve-style': 'unbundled-bezier', 'control-point-distances': -100, 'control-point-weights': .5 } },
      { selector: 'edge[kind="contribution"]', style: { 'line-style': 'dashed', 'line-color': '#8b9b6e', 'target-arrow-color': '#8b9b6e', color: '#61703f', 'curve-style': 'unbundled-bezier', 'control-point-distances': 40, 'control-point-weights': .6 } },
      { selector: '.muted', style: { opacity: .6 } },
      { selector: 'node.selected', style: { 'border-width': 3, 'border-color': '#345d50' } },
      { selector: 'edge.selected', style: { width: 3 } }
    ]
  });
  cy.on('tap', 'node', event => event.target.data('kind') === 'concept' ? selectConcept(event.target.id()) : showRepo(event.target.id()));
  cy.on('tap', 'edge', event => showEdge(event.target.data()));
  cy.on('tap', event => { if (event.target === cy) cy.elements().removeClass('muted selected'); });
  cy.on('tap', () => window.dispatchEvent(new Event('map-change')));
  for (const id of ['software', 'intrinsic', 'extrinsic']) $(id).addEventListener('change', () => render());
  $('fit').addEventListener('click', () => cy.fit(cy.elements(), 35));
  $('zoom-in').addEventListener('click', () => cy.zoom(cy.zoom() * 1.2));
  $('zoom-out').addEventListener('click', () => cy.zoom(cy.zoom() / 1.2));
  $('reset').addEventListener('click', () => { for (const id of ['software', 'intrinsic', 'extrinsic']) $(id).checked = true; selectConcept('dependency', true); });
  window.addEventListener('resize', () => {
    if ($('concept-view').hidden) return;
    cy.resize();
    if (viewportWidth !== window.innerWidth) {
      cy.fit(cy.elements(), 35);
      focusMobileMap(cy, selection, window.innerWidth);
      viewportWidth = window.innerWidth;
    }
  });
  window.addEventListener('select-concept', event => selectConcept(event.detail));
  window.conceptView = {
    state: () => ({ concept, repository, selected: selection, software: $('software').checked, intrinsic: $('intrinsic').checked, extrinsic: $('extrinsic').checked }),
    restore(state) {
      for (const id of ['software', 'intrinsic', 'extrinsic']) $(id).checked = state[id];
      selectConcept(state.concept);
      if (graph.software.some(repo => repo.id === state.repository)) showRepo(state.repository);
      if (state.selected !== state.repository) {
        const edge = elementsFor(graph, state).find(item => item.data.id === state.selected && item.data.source);
        if (edge) showEdge(edge.data);
      }
      focusMobileMap(cy, selection, window.innerWidth);
    }
  };
  selectConcept(concept);
  cy.fit(cy.elements(), 35);
  focusMobileMap(cy, concept, window.innerWidth);
} catch (error) {
  details.replaceChildren(element('h2', 'Unable to load the map'), element('p', error.message));
}
})();
