document.addEventListener('DOMContentLoaded', function() {
  var filter = document.getElementById('feed-filter');
  var list = document.getElementById('feed-list');
  if (!filter || !list) return;

  function apply(category) {
    var chips = filter.querySelectorAll('.feed-chip');
    for (var i = 0; i < chips.length; i++) {
      var on = chips[i].dataset.category === category;
      chips[i].classList.toggle('is-active', on);
    }
    var days = list.querySelectorAll('.feed-day');
    for (var d = 0; d < days.length; d++) {
      var items = days[d].querySelectorAll('.feed-item');
      var visible = 0;
      for (var j = 0; j < items.length; j++) {
        var show = category === 'all' || items[j].dataset.category === category;
        items[j].hidden = !show;
        if (show) visible++;
      }
      days[d].hidden = visible === 0;
      var heading = days[d].previousElementSibling;
      if (heading && heading.classList.contains('feed-date')) heading.hidden = visible === 0;
    }
    if (history.replaceState) {
      var hash = category === 'all' ? '' : '#' + category;
      history.replaceState(null, '', location.pathname + hash);
    }
  }

  filter.addEventListener('click', function(e) {
    var chip = e.target.closest('.feed-chip');
    if (!chip) return;
    var next = chip.classList.contains('is-active') ? 'all' : chip.dataset.category;
    apply(next);
  });

  var initial = location.hash ? location.hash.slice(1) : 'all';
  apply(initial);
});
