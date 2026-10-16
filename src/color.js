// Funções de cor compartilhadas pelo gerador e pela checagem de contraste.
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

// mix(a, b, t): t=0 devolve a, t=1 devolve b.
function mix(a, b, t) {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
}

function luminance(h) {
  const c = toRgb(h).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// Texto branco ou quase preto, o que tiver mais contraste com o fundo dado.
const pickText = (bg) => (contrast('#ffffff', bg) >= contrast('#0d0d0d', bg) ? '#ffffff' : '#0d0d0d');

module.exports = { mix, contrast, pickText };
