function contributionsFor(graph, concept) {
  return graph.software.filter(repo => Object.hasOwn(repo.coverage, concept));
}

function elementsFor(graph, { concept = 'dependency', repository, software = true, intrinsic = true, extrinsic = true } = {}) {
  const focused = graph.software.find(repo => repo.id === repository);
  const covered = focused && new Set(Object.keys(focused.coverage));
  const elements = graph.elements.filter(({ data }) => (!covered || (data.source ? covered.has(data.source) && covered.has(data.target) : covered.has(data.id))) && (!data.source || (data.nature === 'intrinsic' ? intrinsic : extrinsic)));
  if (!software) return elements;
  const repos = focused ? [focused] : contributionsFor(graph, concept);
  return elements.concat(repos.flatMap((repo, i) => [
    { data: { id: repo.id, label: `${repo.organisation === 'alpha-omega-security' ? 'Alpha-Omega' : repo.organisation} /\n${repo.label}`, kind: 'software', organisation: repo.organisation, roles: repo.roles.join(' · ') }, position: { x: 80 + i * 210, y: 760 } },
    ...(focused ? Object.keys(repo.coverage) : [concept]).map(id => ({ data: { id: `contributes:${repo.id}:${id}`, source: repo.id, target: id, label: repo.coverage[id], kind: 'contribution', description: `${repo.id} ${repo.coverage[id]} ${graph.elements.find(e => e.data.id === id).data.label.toLowerCase()}.`, repository: repo.id } }))
  ]));
}

function loadMap() {
  const graph = structuredClone(window.mapData);
  const ids = new Set(graph.elements.filter(e => !e.data.source).map(e => e.data.id));
  for (const { data } of graph.elements) {
    if (data.source && (!ids.has(data.source) || !ids.has(data.target))) throw new Error(`Missing endpoint: ${data.id}`);
  }
  return graph;
}

function mapState(graph, hash = '') {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const concepts = graph.elements.filter(item => !item.data.source);
  if (params.get('view') === 'concepts') {
    const concept = concepts.some(item => item.data.id === params.get('concept')) ? params.get('concept') : 'dependency';
    const selected = params.get('selected') || concept;
    const repository = graph.software.find(repo => repo.id === (params.get('repository') || selected))?.id;
    return { view: 'concepts', concept, repository, selected, software: params.get('software') !== '0', intrinsic: params.get('intrinsic') !== '0', extrinsic: params.get('extrinsic') !== '0' };
  }
  const area = params.get('area');
  const kinds = params.has('links') ? params.get('links').split(',').filter(kind => Object.hasOwn(relationshipLabels, kind)) : Object.keys(relationshipLabels);
  return { view: 'repositories', area: area === '' || graph.areas.some(item => item.id === area) ? area : 'dependencies', supporting: params.get('supporting') === '1', context: params.get('context') !== '0', kinds, selected: params.get('selected') || undefined };
}

function mapHash(state) {
  const params = new URLSearchParams({ view: state.view });
  if (state.view === 'concepts') {
    params.set('concept', state.concept);
    if (state.repository) params.set('repository', state.repository);
    for (const key of ['software', 'intrinsic', 'extrinsic']) if (!state[key]) params.set(key, '0');
  } else {
    params.set('area', state.area);
    if (state.supporting) params.set('supporting', '1');
    if (!state.context) params.set('context', '0');
    const kinds = Object.keys(relationshipLabels).filter(kind => state.kinds.includes(kind));
    if (kinds.length !== Object.keys(relationshipLabels).length) params.set('links', kinds.join(','));
  }
  if (state.selected) params.set('selected', state.selected);
  return `#${params}`;
}

function searchMap(graph, query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const items = [
    ...graph.elements.filter(item => !item.data.source).map(({ data }) => ({ id: data.id, label: data.label, description: data.description, kind: 'concept' })),
    ...graph.repositories.map(repo => ({ id: repo.id, label: repo.id, description: repo.purpose, kind: 'repository' }))
  ];
  return items.filter(item => words.every(word => `${item.label} ${item.description}`.toLowerCase().includes(word)))
    .sort((a, b) => Number(b.label.toLowerCase() === query.toLowerCase().trim()) - Number(a.label.toLowerCase() === query.toLowerCase().trim()) || a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label));
}

const relationshipLabels = { data_flow: 'Data flow', supports_task: 'Task support', functional_overlap: 'Functional overlap', module_dependency: 'Module dependency' };
const organisationStyles = [
  { selector: 'node[organisation="ecosyste-ms"]', style: { 'background-color': '#e2f0ed', 'border-color': '#75a296' } },
  { selector: 'node[organisation="git-pkgs"]', style: { 'background-color': '#eef2e6', 'border-color': '#8c9d71' } },
  { selector: 'node[organisation="alpha-omega-security"]', style: { 'background-color': '#ece8f3', 'border-color': '#a08db5' } },
  { selector: 'node[organisation="andrew"]', style: { 'background-color': '#f6ecd9', 'border-color': '#b99b64' } }
];

function arrangeGraph(cy, { area, separate = false } = {}) {
  cy.layout({ name: 'circle', fit: false, radius: Math.max(250, cy.nodes().length * 15) }).run();
  cy.layout({ name: 'cose', animate: false, randomize: false, fit: false, padding: 45,
    nodeDimensionsIncludeLabels: true, nodeRepulsion: () => 800000, nodeOverlap: 20,
    idealEdgeLength: () => 100, edgeElasticity: () => 100,
    componentSpacing: 100, gravity: .3, numIter: 1500,
    initialTemp: 200, coolingFactor: .95, minTemp: 1 }).run();
  const bounds = cy.nodes().boundingBox();
  if (bounds.h > bounds.w) cy.nodes().positions(node => ({ x: node.position('y'), y: node.position('x') }));
  if (area === 'software-discovery') {
    const science = cy.getElementById('ecosyste-ms/science');
    const brief = cy.getElementById('git-pkgs/brief');
    if (science.length && brief.length) {
      const origin = { ...science.position() };
      const angle = Math.atan2(brief.position('y') - origin.y, brief.position('x') - origin.x);
      cy.nodes().positions(node => {
        const x = node.position('x') - origin.x;
        const y = node.position('y') - origin.y;
        return { x: x * Math.cos(angle) + y * Math.sin(angle), y: -x * Math.sin(angle) + y * Math.cos(angle) };
      });
    }
  }
  if (area === 'software-discovery' || separate) {
    const nodes = cy.nodes().toArray();
    for (let pass = 0; pass < 40; pass++) {
      let moved = false;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.position('x') - a.position('x'), dy = b.position('y') - a.position('y');
        const overlapX = (a.outerWidth() + b.outerWidth()) / 2 + 24 - Math.abs(dx);
        const overlapY = (a.outerHeight() + b.outerHeight()) / 2 + 24 - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) continue;
        const axis = overlapX < overlapY ? 'x' : 'y';
        const shift = ((axis === 'x' ? overlapX : overlapY) / 2 + .1) * (Math.sign(axis === 'x' ? dx : dy) || 1);
        a.position(axis, a.position(axis) - shift);
        b.position(axis, b.position(axis) + shift);
        moved = true;
      }
      if (!moved) break;
    }
  }
  cy.fit(cy.elements(), 45);
}

function focusMobileMap(cy, selected, viewportWidth) {
  if (viewportWidth > 650 || !cy.nodes().length) return;
  const item = cy.getElementById(selected || '');
  const anchor = item.length ? (item.isNode() ? item : item.source()) : cy.nodes().toArray().sort((a, b) => b.degree() - a.degree())[0];
  cy.zoom(Math.max(cy.zoom(), .85));
  cy.center(anchor);
}

function updateConceptGraph(cy, graph, options, reset = false) {
  const elements = elementsFor(graph, options);
  const nodes = elements.filter(item => !item.data.source);
  const relayout = reset || nodes.length !== cy.nodes().length || nodes.some(item => !cy.getElementById(item.data.id).length) || elements.some(item => item.data.kind === 'contribution' && !cy.getElementById(item.data.id).length);
  const positions = new Map(cy.nodes().map(node => [node.id(), { ...node.position() }]));
  cy.elements().remove();
  cy.add(elements.map(item => positions.has(item.data.id) ? { ...item, position: positions.get(item.data.id) } : item));
  if (relayout) arrangeGraph(cy, { separate: true });
}

function repositoryElementsFor(graph, { area = 'dependencies', supporting = false, context = false, kinds = Object.keys(relationshipLabels) } = {}) {
  const members = graph.repositories.filter(repo => (supporting || repo.scope === 'main') && (!area || repo.areas.includes(area)));
  const memberIds = new Set(members.map(repo => repo.id));
  const ids = new Set(memberIds);
  const relationships = graph.relationships.filter(edge => kinds.includes(edge.kind));
  if (area && context) {
    for (const edge of relationships) {
      if (memberIds.has(edge.source) || memberIds.has(edge.target)) {
        ids.add(edge.source);
        ids.add(edge.target);
      }
    }
  }
  const repos = graph.repositories.filter(repo => ids.has(repo.id));
  const edges = relationships.filter(edge => ids.has(edge.source) && ids.has(edge.target) && (memberIds.has(edge.source) || memberIds.has(edge.target)));
  return [
    ...repos.map((repo, i) => ({ data: { id: repo.id, label: `${repo.organisation === 'alpha-omega-security' ? 'Alpha-Omega' : repo.organisation} /\n${repo.label}`, kind: 'repository', organisation: repo.organisation, context: !memberIds.has(repo.id) }, position: { x: (i % 5) * 220, y: Math.floor(i / 5) * 150 } })),
    ...edges.map(edge => ({ data: { ...edge, label: relationshipLabels[edge.kind] } }))
  ];
}
