/**
 * Efeito fog no fundo — animação sutil das camadas de neblina
 * O fundo fica fixo (position: fixed); só as opacidades/transforms mudam.
 */
(function () {
  'use strict';

  var layers = document.querySelectorAll('.fog-layer');
  if (!layers.length) return;

  var phase = [0, Math.PI * 0.66, Math.PI * 1.33];
  var speed = 0.00015;
  var amplitude = 0.08;

  function animate() {
    var t = Date.now() * speed;
    layers.forEach(function (el, i) {
      var p = phase[i];
      var x = Math.sin(t + p) * amplitude * 100;
      var y = Math.cos(t * 0.7 + p) * amplitude * 50;
      var opacity = 0.4 + Math.sin(t * 0.5 + p) * 0.08;
      el.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(1.02)';
      el.style.opacity = Math.max(0.3, Math.min(0.6, opacity));
    });
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
