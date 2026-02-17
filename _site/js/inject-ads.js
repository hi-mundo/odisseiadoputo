/**
 * Injeta blocos de publicidade (ad-tv) automaticamente pelo site:
 * - Dentro de posts: a cada N blocos de conteúdo (parágrafos, títulos, etc.)
 * - Na home: a cada N posts na lista
 * - Em páginas (ex: Sobre): no meio do conteúdo
 */
(function () {
  'use strict';

  var INTROS = [
    'Um pouquinho de jabá',
    'Um pouquinho de jabá antes de continuar...',
    'Intervalo comercial. Vai buscar um café.',
    'Jabá estratégico aqui.',
    'Patrocinado pelo café que a gente toma.',
    'Pausa pra olhar um anúncio (ou não).',
    'Jabá até aqui. Sem vergonha.'
  ];
  var JOKES = [
    'escritor também passa fome',
    'escritor também passa fome',
    'obrigado por não usar adblock (ou use, a gente entende)'
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createAdNode() {
    var intro = pick(INTROS);
    var joke = pick(JOKES);
    var html = '<aside class="ad-tv ad-tv-injected" role="complementary" aria-label="Espaço publicitário">' +
      '<p class="ad-tv-intro">' + escapeHtml(intro) + '</p>' +
      '<div class="ad-tv-frame">' +
        '<div class="ad-tv-screen">' +
          '<div class="ad-tv-placeholder">' +
            '<span class="ad-tv-label">Publicidade</span>' +
            '<span class="ad-tv-size">300 &times; 250</span>' +
          '</div>' +
        '</div>' +
        '<div class="ad-tv-stand"></div>' +
        '<p class="ad-tv-joke">' + escapeHtml(joke) + '</p>' +
      '</div>' +
    '</aside>';
    var wrap = document.createElement('div');
    wrap.className = 'ad-tv-wrap';
    wrap.innerHTML = html;
    return wrap.firstElementChild;
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function insertAfter(node, ref) {
    if (ref.nextSibling) {
      ref.parentNode.insertBefore(node, ref.nextSibling);
    } else {
      ref.parentNode.appendChild(node);
    }
  }

  /* Posts: conteúdo dentro de article ( .post-body ou coluna ) */
  function injectInPost() {
    var article = document.querySelector('article.reading-content');
    if (!article) return;
    var contentRoot = article.querySelector('.post-body') ||
      article.querySelector('.row > [class*="col-lg-8"], .row > [class*="col-md-10"]');
    if (!contentRoot) return;

    var blockSelector = 'p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, div.highlight, figure, .table-responsive, table';
    var blocks = [];
    var child = contentRoot.firstElementChild;
    while (child) {
      var next = child.nextElementSibling;
      if (child.classList && child.classList.contains('ad-tv')) {
        child = next;
        continue;
      }
      if (child.tagName === 'HR' || (child.classList && child.classList.contains('pager'))) break;
      if (child.matches && child.matches(blockSelector)) blocks.push(child);
      child = next;
    }
    if (blocks.length < 4) return;

    var interval = 4;
    var afterIndices = [];
    for (var i = interval - 1; i < blocks.length - 1; i += interval) {
      afterIndices.push(i);
    }
    for (var j = afterIndices.length - 1; j >= 0; j--) {
      var ad = createAdNode();
      insertAfter(ad, blocks[afterIndices[j]]);
    }
  }

  /* Home: lista de posts #post-list — ad a cada N posts */
  function injectInHome() {
    var list = document.getElementById('post-list');
    if (!list) return;
    var previews = list.querySelectorAll('.post-preview');
    if (previews.length === 0) return;

    var interval = 4;
    var indices = [];
    for (var i = interval - 1; i < previews.length; i += interval) {
      indices.push(i);
    }
    for (var j = indices.length - 1; j >= 0; j--) {
      var ad = createAdNode();
      var ref = previews[indices[j]];
      var next = ref.nextElementSibling;
      if (next) {
        ref.parentNode.insertBefore(ad, next);
      } else {
        ref.parentNode.appendChild(ad);
      }
    }
  }

  /* Páginas (Sobre, etc.): uma ad no meio */
  function injectInPage() {
    if (document.getElementById('post-list') || document.querySelector('article.reading-content')) return;
    var main = document.querySelector('.container .row [class*="col-"]');
    if (!main) return;
    var sections = main.querySelectorAll('section, .about-team, .about-subscription');
    if (sections.length === 0) return;
    var after = sections[Math.floor(sections.length / 2) - 1] || sections[0];
    var ad = createAdNode();
    insertAfter(ad, after);
  }

  function run() {
    if (document.getElementById('post-list') && document.querySelector('#post-list .post-preview')) {
      injectInHome();
      return;
    }
    if (document.querySelector('article.reading-content')) {
      injectInPost();
      return;
    }
    injectInPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
