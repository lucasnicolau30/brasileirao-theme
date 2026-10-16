// Gera preview/index.html: os 12 temas lado a lado, com as cores e os ícones de cada time.
// É uma simulação aproximada do VS Code (para comparar temas rápido), não o editor de verdade.
// Uso: npm run preview            (gera e abre no navegador)
//      node src/preview.js slugs  (só alguns times, ex.: flamengo,sao-paulo)
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const teams = require('./teams');
const { buildTheme } = require('./theme');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const only = (args[0] || '').split(',').filter(Boolean);
const tok = (t, name) => t.tokenColors.find((r) => r.name === name).settings.foreground;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Resolve o ícone de um arquivo pelo tema de ícones do time (nome, depois extensão, depois padrão).
function iconFor(theme, slug, fileName) {
  const lower = fileName.toLowerCase();
  let id = theme.fileNames[lower];
  if (!id) {
    const parts = lower.split('.');
    for (let i = 1; i < parts.length && !id; i += 1) id = theme.fileExtensions[parts.slice(i).join('.')];
  }
  const def = theme.iconDefinitions[id || theme.file];
  return path.posix.join('..', 'icons', slug, def.iconPath.replace(/\\/g, '/')).replace(/\\/g, '/');
}

// Escudo do fundo do editor (icons/<slug>/fundo.*) e os troféus da seção "Títulos", como na extensão.
const fundoOf = (slug) => fs.readdirSync(path.join(root, 'icons', slug)).find((f) => f.startsWith('fundo'));
const TROPHY_FILES = [['copaDoBrasil', 'copa-do-brasil.png', 38], ['libertadores', 'libertadores.png', 50], ['brasileirao', 'brasileirao.png', 38]];
function ballStyle(primary) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(primary.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#0b0b0b' : primary;
}
function titlesStrip(team) {
  const items = TROPHY_FILES.map(([key, file, h]) => `<div class="tr"><img src="../images/trofeus/${file}" style="height:${h}px" alt=""><span class="ball" style="background:${ballStyle(team.primary)}">x${team.titles[key].length}</span></div>`).join('');
  return `<div class="titles"><div class="th">TÍTULOS</div><div class="trow">${items}</div></div>`;
}

function card(team) {
  const t = buildTheme(team);
  const c = t.colors;
  const icons = JSON.parse(fs.readFileSync(path.join(root, 'icons', team.slug, 'icon-theme.json'), 'utf8'));
  const img = (src) => `<img src="${src}" width="16" height="16" alt="">`;
  const folder = img(path.posix.join('..', 'icons', team.slug, icons.iconDefinitions[icons.folder].iconPath));
  const open = img(path.posix.join('..', 'icons', team.slug, icons.iconDefinitions[icons.folderExpanded].iconPath));
  const file = (n) => `<div class="row">${img(iconFor(icons, team.slug, n))}<span>${n}</span></div>`;

  const kw = c['editorCursor.foreground'];
  const S = (col, x) => `<span style="color:${col}">${esc(x)}</span>`;
  const [b1, b2, b3, b4] = team.brackets;
  const lines = [
    S(tok(t, 'Comentários'), '// total do pedido'),
    `${S(kw, 'function')} ${S(tok(t, 'Funções e métodos'), 'total')}${S(b1, '(')}itens${S(b1, ')')} ${S(b1, '{')}`,
    `  ${S(kw, 'const')} n ${S('#9a9a9a', '=')} ${S(tok(t, 'Números e constantes'), '42')};`,
    `  ${S(kw, 'const')} lista ${S('#9a9a9a', '=')} ${S(b2, '[')}${S(b3, '{')} id: ${S(tok(t, 'Números e constantes'), '1')} ${S(b3, '}')}${S(b2, ']')};`,
    `  ${S(kw, 'return')} itens.${S(tok(t, 'Funções e métodos'), 'map')}${S(b2, '(')}i => ${S(b4, '(')}i.preco${S(b4, ')')}${S(b2, ')')}`,
    `    .${S(tok(t, 'Funções e métodos'), 'join')}${S(b3, '(')}${S(tok(t, 'Strings'), '"-"')}${S(b3, ')')};`,
    S(b1, '}')
  ];
  const code = lines.map((l, i) => {
    const active = i === 2;
    return `<div class="ln" style="${active ? `background:${c['editor.lineHighlightBackground']}` : ''}"><span class="n" style="color:${active ? kw : c['editorLineNumber.foreground']}">${i + 1}</span>${l}</div>`;
  }).join('');

  return `<section class="w" style="background:${c['editor.background']};color:${c['editor.foreground']}">
  <div class="title" style="background:${c['titleBar.activeBackground']};color:${c['titleBar.activeForeground']};border-bottom:1px solid ${c['titleBar.border']}">${esc(team.label)} — projeto</div>
  <div class="act" style="background:${c['activityBar.background']};border-right:1px solid ${c['activityBar.border']}">
    <div class="ai" style="border-left:2px solid ${c['activityBar.activeBorder']};color:${c['activityBar.foreground']}">▤</div>
    <div class="ai" style="color:${c['activityBar.inactiveForeground']}">⌕</div>
    <div class="ai" style="color:${c['activityBar.inactiveForeground']}">⑂</div>
  </div>
  <div class="side" style="background:${c['sideBar.background']};color:${c['sideBar.foreground']};border-right:1px solid ${c['sideBar.border']}">
    <div class="row">${open}<span>src</span></div>
    <div class="row in">${folder}<span>components</span></div>
    <div class="in">${file('index.js')}${file('app.ts')}${file('style.css')}</div>
    ${file('package.json')}${file('README.md')}${file('.env')}
    ${titlesStrip(team)}
  </div>
  <div class="tabs" style="background:${c['editorGroupHeader.tabsBackground']}">
    <div class="tab" style="background:${c['tab.activeBackground']};color:${c['tab.activeForeground']};border-top:2px solid ${c['tab.activeBorderTop']}">index.js</div>
    <div class="tab" style="color:${c['tab.inactiveForeground']}">app.ts</div>
  </div>
  <div class="ed"><div class="crest" style="background:url(../icons/${team.slug}/${fundoOf(team.slug)}) 42% 50%/auto 85% no-repeat${team.bgColor ? ';filter:none' : ''}"></div>${code}</div>
  <div class="status" style="background:${c['statusBar.background']};color:${c['statusBar.foreground']};border-top:1px solid ${c['statusBar.border']}"><span>⎇ main</span><span>JavaScript</span></div>
</section>`;
}

const list = teams.filter((t) => !only.length || only.includes(t.slug));
const html = `<!doctype html><meta charset="utf-8"><title>Prévia dos temas</title>
<style>
  body{margin:0;background:#2b2b2b;font:12px Consolas,"Cascadia Mono",monospace;padding:12px;color:#ccc}
  h1{font:600 14px Arial;margin:0 0 4px} p{margin:0 0 12px;font:12px Arial;color:#aaa}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(520px,1fr));gap:12px}
  .w{display:grid;grid-template-columns:38px 150px 1fr;grid-template-rows:24px 26px 1fr 22px;height:330px;overflow:hidden;border-radius:4px}
  .title{grid-column:1/4;padding:4px 10px} .status{grid-column:1/4;padding:3px 10px;display:flex;justify-content:space-between}
  .act{grid-row:2/4;display:flex;flex-direction:column} .ai{height:32px;display:flex;align-items:center;justify-content:center;font-size:15px}
  .side{grid-row:2/4;padding:6px 4px;overflow:hidden} .row{display:flex;gap:6px;align-items:center;padding:2px 6px;white-space:nowrap} .in{padding-left:12px}
  .tabs{display:flex;grid-column:3} .tab{padding:5px 12px} .ed{grid-column:3;padding:6px 0;white-space:pre;overflow:hidden}
  .ed{position:relative}.crest{position:absolute;inset:0;pointer-events:none;filter:brightness(0) invert(1);opacity:.08}
  .side{position:relative}.titles{position:absolute;left:0;right:0;bottom:0;padding:4px 6px 6px;border-top:1px solid rgba(255,255,255,.08)}.th{font:600 9px Arial;opacity:.7;margin-bottom:4px}.trow{display:flex;align-items:flex-end;justify-content:space-around}.tr{position:relative}.tr img{display:block}.ball{position:absolute;right:-6px;bottom:0;min-width:14px;height:14px;border-radius:7px;color:#fff;font:700 8px/14px Arial;text-align:center;padding:0 2px}
  .ln{padding:0 8px 0 0}.n{display:inline-block;width:28px;text-align:right;margin-right:12px}
</style>
<h1>Brasileirão Theme — prévia</h1>
<p>Simulação aproximada do VS Code, para comparar os times. O resultado real está em Ctrl+K Ctrl+T.</p>
<div class="grid">${list.map(card).join('\n')}</div>`;

const out = path.join(root, 'preview', 'index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Prévia com ${list.length} time(s): ${out}`);

if (!process.argv.includes('--sem-abrir')) {
  // `start` não é um programa, é um comando do cmd; o primeiro "" é o título da janela.
  execFile('cmd', ['/c', 'start', '', out], () => {});
}
