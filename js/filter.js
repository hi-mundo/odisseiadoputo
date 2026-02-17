/**
 * Filtro "burro" por tags — só esconde/mostra no cliente.
 * Cada post tem data-tags="codigo noticias" (valores em minúsculo).
 */
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.filter-tag');
  var posts = document.querySelectorAll('#post-list .post-preview');
  var seps = document.querySelectorAll('#post-list hr.post-sep');

  if (!buttons.length || !posts.length) return;

  function setActive(activeBtn) {
    buttons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn === activeBtn);
      btn.setAttribute('aria-pressed', btn === activeBtn ? 'true' : 'false');
    });
  }

  function filter(tag) {
    var isAll = tag === 'all';
    posts.forEach(function (post, i) {
      var postTags = (post.getAttribute('data-tags') || '').trim();
      var show = isAll || (postTags && postTags.split(/\s+/).indexOf(tag) !== -1);
      post.style.display = show ? '' : 'none';
      if (seps[i]) seps[i].style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.getAttribute('data-filter') || 'all';
      setActive(btn);
      filter(tag);
    });
  });
})();
