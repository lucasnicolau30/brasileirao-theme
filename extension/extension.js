// Quando um tema "Brasileirão: <time>" está ativo:
//  - troca o tema de ícones pelo do mesmo time (o VS Code não liga um ao outro sozinho);
//  - põe o escudo do time, em branco e discreto, no fundo do editor (via extensão Background, que faz o patch no VS Code);
//  - coloca as cores do time no indent-rainbow (que só lê `indentRainbow.colors`, não as cores do tema).
// Ao trocar para um tema de fora da coleção, devolve o que havia.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const palettes = require('./palettes.json');

const INDENT_SAVED = 'indentRainbow.saved';
const ICON_SAVED = 'iconTheme.saved';
const BG_SAVED = 'background.saved';
const BACKGROUND = 'shalldie.background';
const INDENT_RAINBOW = 'oderwat.indent-rainbow';
const MATERIAL = 'pkief.material-icon-theme';
const OWN_ICON_PREFIX = 'brasileirao-';
const Global = vscode.ConfigurationTarget.Global;

async function syncIndentRainbow(context, palette) {
  if (!vscode.extensions.getExtension(INDENT_RAINBOW)) return;
  const config = vscode.workspace.getConfiguration('indentRainbow');
  const current = (config.inspect('colors') || {}).globalValue;
  const saved = context.globalState.get(INDENT_SAVED);

  if (palette) {
    if (!saved) await context.globalState.update(INDENT_SAVED, { value: current ?? null });
    if (JSON.stringify(current) !== JSON.stringify(palette.colors)) await config.update('colors', palette.colors, Global);
  } else if (saved) {
    await config.update('colors', saved.value ?? undefined, Global);
    await context.globalState.update(INDENT_SAVED, undefined);
  }
}

async function syncIconTheme(context, palette) {
  if (!vscode.workspace.getConfiguration('brasileirao').get('syncIconTheme', true)) return;
  const workbench = vscode.workspace.getConfiguration('workbench');
  const current = (workbench.inspect('iconTheme') || {}).globalValue;
  const saved = context.globalState.get(ICON_SAVED);
  const isOwn = (id) => typeof id === 'string' && id.startsWith(OWN_ICON_PREFIX);

  if (palette) {
    // Guarda o tema de ícones de antes. Se já era um da coleção (não dá para saber o anterior), usa o Material
    // quando estiver instalado, já que o tema da coleção é feito em cima dele.
    if (!saved) {
      const fallback = vscode.extensions.getExtension(MATERIAL) ? 'material-icon-theme' : null;
      await context.globalState.update(ICON_SAVED, { value: isOwn(current) ? fallback : current ?? null });
    }
    if (current !== palette.iconTheme) await workbench.update('iconTheme', palette.iconTheme, Global);
  } else if (saved) {
    // Só restaura se o tema de ícones ainda for da coleção; se você escolheu outro à mão, respeita.
    if (isOwn(current)) await workbench.update('iconTheme', saved.value ?? undefined, Global);
    await context.globalState.update(ICON_SAVED, undefined);
  }
}

// O VS Code não tem API para imagem de fundo; quem faz isso é a extensão Background, que lê `background.editor`.
const CREST_SIZE = 'auto 80vh';
// Seções que uma versão anterior também preenchia (explorador e painel); se sobrou algo guardado, devolve.
const LEGACY_SECTIONS = ['sidebar', 'panel'];

async function syncCrest(context, palette) {
  if (!vscode.extensions.getExtension(BACKGROUND)) {
    if (palette && !context.globalState.get('background.warned')) {
      await context.globalState.update('background.warned', true);
      const choice = await vscode.window.showInformationMessage(
        'Brasileirão Theme: para o escudo no fundo do editor, instale a extensão "Background" (shalldie).', 'Instalar');
      if (choice === 'Instalar') vscode.commands.executeCommand('workbench.extensions.installExtension', BACKGROUND);
    }
    return;
  }
  const own = vscode.workspace.getConfiguration('brasileirao');
  const config = vscode.workspace.getConfiguration('background');
  const opacity = Math.min(0.3, Math.max(0.01, Number(own.get('crestOpacity', 0.08)) || 0.08));
  // O formato antigo guardava só o editor: { value }.
  const saved = context.globalState.get(BG_SAVED);
  const newSaved = { ...((saved && ('value' in saved ? { editor: saved.value } : saved.sections)) || {}) };
  let changed = false;

  const section = 'editor';
  const current = (config.inspect(section) || {}).globalValue;
  const wanted = palette && palette.background && own.get('crestBackground', true);
  if (wanted) {
    if (!(section in newSaved)) newSaved[section] = current ?? null;
    const next = {
      images: [path.join(__dirname, '..', 'icons', palette.slug, palette.background)],
      style: {
        'background-position': palette.backgroundPosition || 'calc(50% - 50px) 50%',
        'background-size': palette.backgroundSize || CREST_SIZE,
        // Os escudos viram brancos pelo filtro; um escudo já na cor do time (backgroundTint) não leva filtro.
        filter: palette.backgroundTint ? 'none' : 'brightness(0) invert(1)',
        opacity
      },
      useFront: true,
      interval: 0,
      random: false
    };
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      await config.update(section, next, Global);
      changed = true;
    }
    // A Background guarda uma cópia da imagem no patch dela: se o arquivo mudou mas o caminho não, ela não percebe.
    const stat = fs.statSync(next.images[0]);
    const stamp = `${next.images[0]}|${stat.size}|${Math.round(stat.mtimeMs)}`;
    if (context.globalState.get('background.imageStamp') !== stamp) {
      await context.globalState.update('background.imageStamp', stamp);
      changed = true;
    }
  } else if (section in newSaved) {
    await config.update(section, newSaved[section] ?? undefined, Global);
    delete newSaved[section];
    changed = true;
  }
  for (const legacy of LEGACY_SECTIONS) {
    if (!(legacy in newSaved)) continue;
    await config.update(legacy, newSaved[legacy] ?? undefined, Global);
    delete newSaved[legacy];
    changed = true;
  }
  await context.globalState.update(BG_SAVED, Object.keys(newSaved).length ? { sections: newSaved } : undefined);
  if (changed) await offerReload(context);
}

// A Background só reaplica o patch (e pede para reiniciar) pelo comando dela; mudar `background.editor` não basta.
async function offerReload(context) {
  // Na primeira vez, explica o que vai acontecer (a Background modifica arquivos do VS Code), para ninguém achar que ele quebrou.
  if (!context.globalState.get('background.explained')) {
    await context.globalState.update('background.explained', true);
    const choice = await vscode.window.showInformationMessage(
      'Brasileirão Theme: o escudo no fundo do editor usa a extensão Background, que altera arquivos do VS Code. '
      + 'Por isso ele vai pedir para reiniciar e, em algumas versões, pode avisar que a instalação está "corrompida". É esperado e inofensivo. '
      + 'Para não usar o escudo de fundo, desligue "brasileirao.crestBackground".',
      'Entendi', 'Desligar o escudo');
    if (choice === 'Desligar o escudo') {
      await vscode.workspace.getConfiguration('brasileirao').update('crestBackground', false, Global);
      return;
    }
  }
  await vscode.commands.executeCommand('extension.background.install');
}

// Seção "Títulos" no explorador: troféus de Brasileirão, Copa do Brasil e Libertadores, cada um com uma bolinha "xN".
// Fotos dos troféus recortadas do fundo, em images/trofeus (créditos em CREDITS.txt). A Libertadores fica no meio.
const TROPHIES = [
  { key: 'copaDoBrasil', label: 'Copa do Brasil', file: 'copa-do-brasil.png' },
  { key: 'libertadores', label: 'Libertadores', file: 'libertadores.png' },
  { key: 'brasileirao', label: 'Brasileirão', file: 'brasileirao.png' }
];
const trophyUri = (file) => `data:image/png;base64,${fs.readFileSync(path.join(__dirname, '..', 'images', 'trofeus', file)).toString('base64')}`;

// Bolinha na cor do time, com o "xN" em branco. Nos times de cor clara (branco, cinza, creme) o branco sumiria, então a bolinha é preta, que também é cor deles.
function ballColors(primary) {
  const color = primary || '#444444';
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255);
  const light = 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45;
  return { bg: light ? '#0b0b0b' : color, fg: '#ffffff' };
}

// "1980 · 1982 · 1967 (2x)": ano repetido (dois títulos no mesmo ano) vira "(2x)".
function formatYears(years) {
  const counts = new Map();
  years.forEach((y) => counts.set(y, (counts.get(y) || 0) + 1));
  return [...counts].map(([y, n]) => (n > 1 ? `${y} (${n}x)` : String(y))).join(' · ');
}

function tooltipText(label, years) {
  const n = years.length;
  const total = n === 0 ? 'nenhum título' : n === 1 ? '1 título' : `${n} títulos`;
  return `<b>${label}</b> · ${total}${n ? `<br>${formatYears(years)}` : ''}`;
}

function titlesHtml(palette) {
  const ball = ballColors(palette && palette.primary);
  const nonce = crypto.randomBytes(16).toString('base64');
  const body = !palette || !palette.titles
    ? '<p class="hint">Escolha um tema "Brasileirão: &lt;time&gt;" para ver os títulos.</p>'
    : `<div class="row">${TROPHIES.map((t) => `
        <div class="item${t.key === 'libertadores' ? ' big' : ''}" data-tip="${tooltipText(t.label, palette.titles[t.key]).replace(/"/g, '&quot;')}">
          <div class="trophy"><img src="${trophyUri(t.file)}" alt="${t.label}"><span class="ball">x${palette.titles[t.key].length}</span></div>
          <div class="name">${t.label}</div>
        </div>`).join('')}</div><div id="tip" role="tooltip"></div>`;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
<style>
  html, body { overflow-x: hidden; }
  body { margin: 0; padding: 12px 8px; color: var(--vscode-foreground); font-family: var(--vscode-font-family); font-size: 11px; }
  .row { display: flex; align-items: flex-end; justify-content: space-between; gap: 4px; }
  .item { flex: 1 1 0; min-width: 0; text-align: center; cursor: pointer; }
  .trophy { position: relative; display: flex; justify-content: center; }
  .trophy img { display: block; max-width: 100%; height: 100px; object-fit: contain; }
  .item.big .trophy img { height: 135px; }
  .ball { position: absolute; right: 2px; bottom: 2px; min-width: 22px; height: 22px; padding: 0 4px; box-sizing: border-box; border-radius: 11px;
    background: ${ball.bg}; color: ${ball.fg}; font-weight: 700; font-size: 11px; line-height: 22px; text-align: center; box-shadow: 0 0 0 2px var(--vscode-sideBar-background); }
  .name { margin-top: 8px; color: #e0b94a; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hint { opacity: .6; margin: 0; }
  #tip { display: none; position: fixed; z-index: 10; max-width: calc(100vw - 8px); padding: 6px 8px; border-radius: 4px; line-height: 1.5;
    background: var(--vscode-editorHoverWidget-background, #252526); color: var(--vscode-editorHoverWidget-foreground, #ccc);
    border: 1px solid var(--vscode-editorHoverWidget-border, #454545); box-shadow: 0 2px 8px rgba(0, 0, 0, .5); pointer-events: none; }
  #tip b { color: #e0b94a; }
</style></head><body>${body}
<script nonce="${nonce}">
  const tip = document.getElementById('tip');
  document.querySelectorAll('.item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      tip.innerHTML = el.dataset.tip;
      tip.style.display = 'block';
      const r = el.getBoundingClientRect();
      const x = Math.max(4, Math.min(innerWidth - tip.offsetWidth - 4, r.left + r.width / 2 - tip.offsetWidth / 2));
      // A seção é pequena e não dá para a caixinha sair dela: fica acima do troféu e, sem espaço, em cima dele, sempre dentro da área visível.
      const above = r.top - tip.offsetHeight - 6;
      const y = above >= 4 ? above : r.top + 8;
      tip.style.left = x + 'px';
      tip.style.top = Math.max(4, Math.min(innerHeight - tip.offsetHeight - 4, y)) + 'px';
    });
    el.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  });
</script></body></html>`;
}

function registerTitlesView(context) {
  let view;
  const refresh = () => {
    if (!view) return;
    const themeName = vscode.workspace.getConfiguration('workbench').get('colorTheme');
    view.webview.html = titlesHtml(palettes[themeName]);
  };
  // Na primeira vez, abre a seção e a aumenta até caberem os troféus (ela nasce pequena, recolhida no fim do explorador).
  // O VS Code não deixa uma seção se ajustar ao conteúdo; depois disso o tamanho é o que você deixar.
  if (!context.globalState.get('titulos.revealed.v3')) {
    context.globalState.update('titulos.revealed.v3', true);
    setTimeout(async () => {
      await vscode.commands.executeCommand('brasileirao.titulos.focus');
      for (let i = 0; i < 3; i++) await vscode.commands.executeCommand('workbench.action.increaseViewSize');
    }, 2500);
  }
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('brasileirao.titulos', {
    resolveWebviewView(v) {
      view = v;
      v.webview.options = { enableScripts: true };
      refresh();
    }
  }));
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => { if (e.affectsConfiguration('workbench.colorTheme')) refresh(); }));
}

async function sync(context) {
  const themeName = vscode.workspace.getConfiguration('workbench').get('colorTheme');
  const palette = palettes[themeName];
  for (const fn of [syncIconTheme, syncIndentRainbow, syncCrest]) {
    try {
      await fn(context, palette);
    } catch (err) {
      console.warn(`Brasileirão Theme: ${fn.name} falhou`, err);
    }
  }
}

// "Brasileirão: Escolher time": lista os times com o atual já selecionado. O seletor padrão do VS Code
// (botão "Set Color Theme" da página da extensão) abre em ordem alfabética e já aplica uma prévia do primeiro item.
async function chooseTeam() {
  const workbench = vscode.workspace.getConfiguration('workbench');
  const current = workbench.get('colorTheme');
  // Cada time com o escudo como ícone e as cores em quadradinhos; o tema atual vem marcado.
  const items = Object.entries(palettes).map(([label, p]) => ({
    label,
    description: label === current ? 'atual' : undefined,
    detail: p.swatch,
    iconPath: vscode.Uri.file(path.join(__dirname, '..', 'icons', p.slug, 'escudo.svg'))
  }));
  const picker = vscode.window.createQuickPick();
  picker.title = 'Brasileirão Theme';
  picker.placeholder = 'Escolha o time';
  picker.items = items;
  picker.activeItems = items.filter((i) => i.label === current);
  const chosen = await new Promise((resolve) => {
    picker.onDidAccept(() => resolve(picker.selectedItems[0]));
    picker.onDidHide(() => resolve(undefined));
    picker.show();
  });
  picker.dispose();
  if (chosen && chosen.label !== current) await workbench.update('colorTheme', chosen.label, Global);
}

function activate(context) {
  sync(context);
  registerTitlesView(context);
  context.subscriptions.push(vscode.commands.registerCommand('brasileirao.escolherTime', chooseTeam));
  // Os botões "Set Color Theme" e "Set File Icon Theme" da página da extensão são do VS Code e abrem o seletor padrão;
  // este botão na barra de status abre o seletor da coleção (com escudos), que também troca o tema de ícones.
  const pick = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  pick.command = 'brasileirao.escolherTime';
  pick.text = '$(symbol-event) Times';
  pick.tooltip = 'Brasileirão: Escolher time';
  pick.show();
  context.subscriptions.push(pick);
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('workbench.colorTheme') || e.affectsConfiguration('brasileirao.syncIconTheme') || e.affectsConfiguration('brasileirao.crestBackground') || e.affectsConfiguration('brasileirao.crestOpacity')) sync(context);
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
