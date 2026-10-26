// Cores dos comentários especiais da extensão Better Comments (`better-comments.tags`), tiradas das cores do time.
// Um tema não consegue pintar `// !` ou `// TODO`, então a extensão do tema grava estas tags nas configurações quando o time é escolhido.
// Os times em preto e branco só têm tons de cinza; o que separa as tags é o estilo (negrito, itálico, sublinhado, fundo).
const base = { strikethrough: false, underline: false, backgroundColor: 'transparent', bold: false, italic: false };

// '//' é código comentado: riscado e um pouco mais apagado que o comentário comum (#8a8a8a), mas ainda legível.
const STRUCK = '#808080';

function commentTags(team) {
  const [b1, b2, b3] = team.brackets;
  return [
    { ...base, tag: '!', color: team.accent, bold: true, backgroundColor: team.primary + '33' },
    { ...base, tag: '?', color: b3, italic: true },
    { ...base, tag: 'todo', color: b2, bold: true, underline: true },
    { ...base, tag: '*', color: b1 },
    { ...base, tag: '//', color: STRUCK, strikethrough: true }
  ];
}

module.exports = { commentTags, STRUCK };
