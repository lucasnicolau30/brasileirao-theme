// Checa os contrastes mínimos nos temas. Sai com código 1 se algum falhar.
// Uso: node src/check-contrast.js
const teams = require('./teams');
const { buildTheme } = require('./theme');
const { contrast } = require('./color');

const CHECKS = [
  ['texto principal / fundo do editor', (c) => [c['editor.foreground'], c['editor.background']], 7],
  ['comentário / fundo do editor', (c, t) => [t.comment, c['editor.background']], 4.5],
  ['número de linha / fundo do editor', (c) => [c['editorLineNumber.foreground'], c['editor.background']], 4.5],
  ['texto da barra de status / barra de status', (c) => [c['statusBar.foreground'], c['statusBar.background']], 4.5],
  ['destaque como texto / fundo do editor', (c) => [c['editorCursor.foreground'], c['editor.background']], 4.5],
  ['texto do botão / botão', (c) => [c['button.foreground'], c['button.background']], 4.5],
  ['texto da barra de título / barra de título', (c) => [c['titleBar.activeForeground'], c['titleBar.activeBackground']], 4.5],
  ['ícone inativo da barra de atividades / barra de atividades', (c) => [c['activityBar.inactiveForeground'], c['activityBar.background']], 3],
  ['ícone ativo da barra de atividades / barra de atividades', (c) => [c['activityBar.foreground'], c['activityBar.background']], 4.5],
  ['aba inativa / fundo das abas', (c) => [c['tab.inactiveForeground'], c['tab.inactiveBackground']], 4.5],
  ['texto da lateral / fundo da lateral', (c) => [c['sideBar.foreground'], c['sideBar.background']], 4.5]
];

let failures = 0;
for (const team of teams) {
  const theme = buildTheme(team);
  const comment = theme.tokenColors.find((r) => r.name === 'Comentários').settings.foreground;
  for (const [name, pick, min] of CHECKS) {
    const [a, b] = pick(theme.colors, { comment });
    const ratio = contrast(a, b);
    if (ratio < min) {
      failures += 1;
      console.log(`FALHA  ${team.label}: ${name} = ${ratio.toFixed(2)}:1 (mínimo ${min}:1)  [${a} sobre ${b}]`);
    }
  }
  // Os 6 níveis de colchete precisam ser legíveis sobre o fundo.
  team.brackets.forEach((hex, i) => {
    const ratio = contrast(hex, theme.colors['editor.background']);
    if (ratio < 4.5) {
      failures += 1;
      console.log(`FALHA  ${team.label}: colchete nível ${i + 1} = ${ratio.toFixed(2)}:1 (mínimo 4.5:1)  [${hex}]`);
    }
  });
}

if (failures) {
  console.log(`\n${failures} falha(s).`);
  process.exit(1);
}
console.log(`Contraste ok nos ${teams.length} temas.`);
