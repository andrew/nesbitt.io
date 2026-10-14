(() => {
const graph = window.mapData;
const $ = id => document.getElementById(id);
document.body.classList.add('filters-collapsed');
let restoring = false;
let currentHash;

function state() {
  const repos = window.repositoryView.state();
  return repos.view === 'repositories' ? repos : { view: 'concepts', ...window.conceptView.state() };
}

function save(replace = false) {
  if (restoring) return;
  const hash = mapHash(state());
  if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
  currentHash = hash;
}

function restore() {
  if (location.hash === currentHash) return;
  restoring = true;
  const requested = mapState(graph, location.hash);
  if (requested.view === 'repositories') window.repositoryView.restore(requested);
  else {
    window.repositoryView.switchView(false);
    window.conceptView.restore(requested);
  }
  restoring = false;
  save(true);
}

function openResult(result) {
  restoring = true;
  if (result.kind === 'concept') {
    window.repositoryView.switchView(false);
    window.conceptView.restore({ ...mapState(graph, '#view=concepts'), concept: result.id, selected: result.id });
  } else {
    const repo = graph.repositories.find(item => item.id === result.id);
    const current = window.repositoryView.state();
    const visible = repositoryElementsFor(graph, current).some(item => item.data.id === repo.id);
    window.repositoryView.restore({ ...current, area: visible ? current.area : repo.areas[0] || '', supporting: current.supporting || repo.scope === 'supporting', selected: repo.id });
  }
  restoring = false;
  $('search-panel').hidden = true;
  save();
  const details = $(result.kind === 'concept' ? 'details' : 'repo-details');
  details.focus({ preventScroll: true });
  if (matchMedia('(max-width: 650px)').matches) details.scrollIntoView({ block: 'start' });
}

function search() {
  const results = searchMap(graph, $('map-search').value);
  $('search-results').replaceChildren();
  $('search-status').textContent = `${results.length} ${results.length === 1 ? 'match' : 'matches'} across all concepts and repositories`;
  for (const result of results) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card';
    button.textContent = result.label;
    const kind = document.createElement('span');
    kind.textContent = result.kind === 'concept' ? 'Concept' : 'Repository';
    button.append(kind);
    button.addEventListener('click', () => openResult(result));
    $('search-results').append(button);
  }
  $('search-panel').hidden = false;
}

$('map-search').addEventListener('input', search);
$('map-search').addEventListener('focus', search);
$('map-search').addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'Enter') {
    event.preventDefault();
    const first = $('search-results').querySelector('button');
    if (event.key === 'Enter') first?.click();
    else first?.focus();
  }
});
$('search-close').addEventListener('click', () => { $('map-search').focus(); $('search-panel').hidden = true; });
$('filter-toggle').addEventListener('click', () => {
  const collapsed = document.body.classList.toggle('filters-collapsed');
  $('filter-toggle').setAttribute('aria-expanded', String(!collapsed));
  window.dispatchEvent(new Event('resize'));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('search-panel').hidden) {
    $('map-search').focus();
    $('search-panel').hidden = true;
  }
});
document.addEventListener('click', event => {
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    $('map-search').focus();
  }
  if (!event.target.closest('.global-search')) $('search-panel').hidden = true;
  save();
});
document.addEventListener('change', () => save());
window.addEventListener('map-change', () => save());
window.addEventListener('popstate', restore);
window.addEventListener('hashchange', restore);
$('audit-date').textContent = `Updated ${graph.audit_date}`;
restore();
})();
