document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var posts = [];
  var postsRequest;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    input.focus();
  }

  function loadPosts() {
    if (!postsRequest) {
      postsRequest = fetch('/search.json')
        .then(function(response) { return response.json(); })
        .then(function(data) { posts = data; });
    }

    return postsRequest;
  }

  function search() {
    var query = input.value.toLowerCase().trim();

    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }

    loadPosts().then(function() {
      if (input.value.toLowerCase().trim() !== query) return;

      var matches = posts.filter(function(post) {
        return post.title.toLowerCase().includes(query) ||
               post.excerpt.toLowerCase().includes(query) ||
               post.tags.some(function(tag) { return tag.toLowerCase().includes(query); });
      });

      if (matches.length === 0) {
        results.innerHTML = '<p>No results found.</p>';
        return;
      }

      var html = '<ul class="post-list">';
      matches.forEach(function(post) {
        html += '<li>';
        html += '<span class="post-meta">' + post.date + '</span> ';
        html += '<a href="' + post.url + '">' + post.title + '</a>';
        html += '</li>';
      });
      html += '</ul>';

      results.innerHTML = html;
    });
  }

  input.addEventListener('input', search);

  document.querySelectorAll('.search-tag').forEach(function(tag) {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      input.value = this.dataset.tag;
      search();
    });
  });

  if (window.location.hash) {
    input.value = decodeURIComponent(window.location.hash.slice(1));
    search();
  }
});
