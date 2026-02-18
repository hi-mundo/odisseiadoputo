/**
 * Tenta manter o Grow (Faves) dentro das tevisões: se o script do Grow
 * injetar um widget como filho direto do body, move para a primeira tevisão.
 */
(function () {
  'use strict';

  function moveGrowIntoTevisao() {
    var container = document.querySelector('[data-grow-container="tevisao"]');
    if (!container) return;

    var body = document.body;
    var moved = 0;
    [].slice.call(body.children).forEach(function (node) {
      if (node.nodeType !== 1) return;
      var id = (node.id || '').toLowerCase();
      var cls = (node.className && typeof node.className === 'string' ? node.className : '').toLowerCase();
      var isGrow = id.indexOf('grow') !== -1 || id.indexOf('faves') !== -1 ||
                   cls.indexOf('grow') !== -1 || cls.indexOf('faves') !== -1;
      var isGrowIframe = node.tagName === 'IFRAME' && node.src && node.src.indexOf('grow.me') !== -1;
      if ((isGrow || isGrowIframe) && node.getAttribute('data-grow-initializer') === null) {
        container.appendChild(node);
        moved++;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(moveGrowIntoTevisao, 1500);
    });
  } else {
    setTimeout(moveGrowIntoTevisao, 1500);
  }
})();
