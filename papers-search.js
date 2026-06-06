document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('search-input');
  var count = document.getElementById('papers-count');
  var papers = Array.from(document.querySelectorAll('.paper'));
  var sections = Array.from(document.querySelectorAll('.papers-section'));

  if (!input || papers.length === 0) return;

  var corpus = papers.map(function(p) { return p.textContent.toLowerCase(); });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    input.focus();
  }

  function search() {
    var query = input.value.toLowerCase().trim();
    var visible = 0;

    papers.forEach(function(p, i) {
      var match = query.length < 2 || corpus[i].includes(query);
      p.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    sections.forEach(function(s) {
      var anyVisible = Array.prototype.some.call(
        s.querySelectorAll('.paper'),
        function(p) { return p.style.display !== 'none'; }
      );
      s.style.display = anyVisible ? '' : 'none';
    });

    if (query.length < 2) {
      count.textContent = '';
    } else {
      count.textContent = visible + ' of ' + papers.length + ' papers';
    }
  }

  input.addEventListener('input', search);

  if (window.location.hash) {
    input.value = decodeURIComponent(window.location.hash.slice(1));
    search();
  }
});
