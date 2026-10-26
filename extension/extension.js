// Quando um tema "Brasileirão: <time>" está ativo:
//  - troca o tema de ícones pelo do mesmo time (o VS Code não liga um ao outro sozinho);
//  - põe o escudo do time, em branco e discreto, no fundo do editor (via extensão Background, que faz o patch no VS Code);
//  - coloca as cores do time no indent-rainbow (que só lê `indentRainbow.colors`, não as cores do tema);
//  - coloca as cores do time nos comentários do Better Comments (`better-comments.tags`; dependência desta extensão).
// Ao trocar para um tema de fora da coleção, devolve o que havia.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const palettes = require('./palettes.json');

const INDENT_SAVED = 'indentRainbow.saved';
const COMMENTS_SAVED = 'betterComments.saved';
const ICON_SAVED = 'iconTheme.saved';
const BG_SAVED = 'background.saved';
const BACKGROUND = 'shalldie.background';
const INDENT_RAINBOW = 'oderwat.indent-rainbow';
const BETTER_COMMENTS = 'aaron-bond.better-comments';
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

// O Better Comments só lê `better-comments.tags` ao iniciar, então mudar as tags só vale depois de recarregar a janela.
async function syncBetterComments(context, palette) {
  if (!vscode.extensions.getExtension(BETTER_COMMENTS)) return;
  const config = vscode.workspace.getConfiguration('better-comments');
  const current = (config.inspect('tags') || {}).globalValue;
  const saved = context.globalState.get(COMMENTS_SAVED);
  let changed = false;

  if (palette && palette.commentTags) {
    if (!saved) await context.globalState.update(COMMENTS_SAVED, { value: current ?? null });
    if (JSON.stringify(current) !== JSON.stringify(palette.commentTags)) {
      await config.update('tags', palette.commentTags, Global);
      changed = true;
    }
  } else if (saved) {
    await config.update('tags', saved.value ?? undefined, Global);
    await context.globalState.update(COMMENTS_SAVED, undefined);
    changed = true;
  }
  // Sem await: a pergunta ficaria parada e seguraria o escudo de fundo, que é aplicado depois.
  if (changed) {
    vscode.window.showInformationMessage(
      'Brasileirão Theme: para as cores dos comentários (// !, // ?, // TODO, // *) valerem, recarregue a janela.', 'Recarregar')
      .then((choice) => { if (choice === 'Recarregar') vscode.commands.executeCommand('workbench.action.reloadWindow'); });
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
    // Com um escudo antigo escolhido, o ícone de pasta também vira o escudo antigo (cada um tem o seu tema de ícones).
    const retro = chosenRetro(context, palette);
    const wanted = (retro && retro.iconTheme) || palette.iconTheme;
    if (current !== wanted) await workbench.update('iconTheme', wanted, Global);
  } else if (saved) {
    // Só restaura se o tema de ícones ainda for da coleção; se você escolheu outro à mão, respeita.
    if (isOwn(current)) await workbench.update('iconTheme', saved.value ?? undefined, Global);
    await context.globalState.update(ICON_SAVED, undefined);
  }
}

// O VS Code não tem API para imagem de fundo; quem faz isso é a extensão Background, que lê `background.editor`.
const CREST_SIZE = 'auto 80vh';
// Todo escudo de fundo tem a mesma altura (80vh). Só uma imagem absurdamente larga (mais de 1,5 vez a altura) é limitada pela largura e fica
// mais baixa, para não passar da área do editor; o monograma do Flamengo retrô (1,37) cabe e tem a altura igual à dos demais.
const MAX_CREST_ASPECT = 1.5;
const crestSize = (aspect) => (aspect > MAX_CREST_ASPECT ? `${Math.round(MAX_CREST_ASPECT * 80)}vh auto` : CREST_SIZE);
const CREST_VARIANTS = 'crest.variants';

// Escudo antigo escolhido para o time (guardado por time em globalState); sem escolha, ou se o arquivo sumiu, vale o escudo atual.
function chosenRetro(context, palette) {
  const id = (context.globalState.get(CREST_VARIANTS) || {})[palette.slug];
  const entry = [...(palette.alternates || []), ...(palette.retro || [])].find((r) => r.id === id);
  return entry && fs.existsSync(path.join(__dirname, '..', 'icons', palette.slug, entry.file)) ? entry : undefined;
}
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
  const retro = palette && chosenRetro(context, palette);
  const wanted = palette && (retro || palette.background) && own.get('crestBackground', true);
  if (wanted) {
    if (!(section in newSaved)) newSaved[section] = current ?? null;
    const next = {
      images: [path.join(__dirname, '..', 'icons', palette.slug, retro ? retro.file : palette.background)],
      style: {
        // A posição ajustada à mão vale para a silhueta atual; os escudos antigos têm proporções próprias e usam a posição padrão.
        'background-position': (!retro && palette.backgroundPosition) || 'calc(50% - 50px) 50%',
        'background-size': (!retro && palette.backgroundSize) || crestSize(retro ? retro.aspect : palette.backgroundAspect),
        // Os escudos atuais viram brancos pelo filtro (os coloridos não levam filtro). Os antigos ficam coloridos,
        // senão virariam uma mancha, e um pouco mais fortes, porque a cor sozinha é mais discreta que o branco.
        filter: retro || palette.backgroundColored ? 'none' : 'brightness(0) invert(1)',
        opacity: retro || palette.backgroundColored ? Math.min(0.3, opacity * 1.5) : opacity
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

// Seções do explorador. "Títulos": um item por competição em que o time tem título, com uma bolinha "xN" (o mouse mostra os anos).
// Competição sem título não mostra nada, e os itens ficam centralizados. Fotos dos troféus em images/trofeus (créditos em CREDITS.txt).
const COMPETITIONS = [
  { key: 'copaDoBrasil', label: 'Copa do Brasil', file: 'copa-do-brasil.png' },
  { key: 'libertadores', label: 'Libertadores', file: 'libertadores.png' },
  { key: 'mundial', label: 'Mundial', file: 'mundial.png' },
  { key: 'brasileirao', label: 'Brasileirão', file: 'brasileirao.png' },
  { key: 'sulAmericana', label: 'Sul-Americana', file: 'sul-americana.png' },
  { key: 'copaDoNordeste', label: 'Copa do Nordeste', file: 'copa-do-nordeste.png' },
  { key: 'serieB', label: 'Série B', file: 'serie-b.png' },
  { key: 'serieC', label: 'Série C', file: 'serie-c.png' },
  { key: 'serieD', label: 'Série D', file: 'serie-d.png' }
];
const pngAspect = (file) => {
  const buf = fs.readFileSync(path.join(__dirname, '..', 'images', 'trofeus', file));
  return buf.readUInt32BE(16) / buf.readUInt32BE(20); // IHDR: largura e altura
};
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

// Competições em que o time tem título, na ordem de exibição. O Mundial é o ápice: fica logo à direita da Libertadores e, com 5 itens,
// no centro. (A ordem da lista COMPETITIONS já põe o Mundial depois da Libertadores; aqui só se garante o centro nos casos de 5.)
function presentTitles(palette) {
  const present = COMPETITIONS.filter((c) => (palette.titles[c.key] || []).length);
  const mundial = present.find((c) => c.key === 'mundial');
  if (mundial && present.length === 5) {
    const rest = present.filter((c) => c !== mundial);
    return [...rest.slice(0, 2), mundial, ...rest.slice(2)];
  }
  return present;
}

function titleItemsHtml(palette) {
  const present = presentTitles(palette);
  const aspect = (c) => pngAspect(c.file);
  // Troféus estreitos (Libertadores, Mundial) parecem menores que os largos na mesma altura: cada um ganha uma compensação suave de altura (--k),
  // a raiz 0,3 da razão entre a proporção do mais largo e a dele. O mais largo fica com k = 1 e todos se apoiam na mesma base.
  const widest = Math.max(...present.map(aspect));
  return present.map((c) => {
    const k = Math.pow(widest / aspect(c), 0.3).toFixed(2);
    return `
        <div class="item${aspect(c) < 0.6 ? ' narrow' : ''}" style="--k:${k}" data-aspect="${aspect(c).toFixed(3)}" data-k="${k}" data-tip="${tooltipText(c.label, palette.titles[c.key]).replace(/"/g, '&quot;')}">
          <div class="trophy"><img src="${trophyUri(c.file)}" alt="${c.label}"><span class="ball">x${palette.titles[c.key].length}</span></div>
          <div class="name">${c.label}</div>
        </div>`;
  }).join('');
}

function titlesHtml(palette) {
  const ball = ballColors(palette && palette.primary);
  const nonce = crypto.randomBytes(16).toString('base64');
  const items = palette && palette.titles ? titleItemsHtml(palette) : '';
  // Com 4 ou 5 competições, tudo fica numa linha só (os itens dividem a largura da barra lateral e encolhem).
  const inline = Boolean(palette && palette.titles) && presentTitles(palette).length >= 4;
  const body = !palette || !palette.titles
    ? '<p class="hint">Escolha um tema "Brasileirão: &lt;time&gt;" para ver os títulos.</p>'
    : items
      ? `<div class="row${inline ? ' inline' : ''}">${items}</div><div id="tip" role="tooltip"></div>`
      : '<p class="hint">Ainda sem títulos nas competições acompanhadas.</p>';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
<style>
  html, body { overflow-x: hidden; }
  body { margin: 0; padding: 12px 8px; color: var(--vscode-foreground); font-family: var(--vscode-font-family); font-size: 11px; }
  /* Todos os troféus têm a mesma altura (--h); a largura de cada um segue a proporção da imagem. Na linha única o script reduz --h até caber. */
  .row { --h: 100px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 14px 10px; }
  .item { flex: 0 0 auto; min-width: 56px; text-align: center; cursor: pointer; }
  .trophy { position: relative; display: inline-flex; }
  .trophy img { display: block; height: calc(var(--h) * var(--k, 1)); width: auto; }
  /* Linha única: colunas de largura igual, cada troféu centralizado na sua; a altura comum vem do troféu mais largo (script fitInline). */
  .row.inline { flex-wrap: nowrap; align-items: flex-end; gap: 4px; margin: 0 -4px; }
  .row.inline .item { flex: 1 1 0; min-width: 0; }
  .row.inline .ball { min-width: 18px; height: 18px; padding: 0 3px; border-radius: 9px; font-size: 9.5px; line-height: 18px; }
  .row.inline .name { margin-top: 6px; font-size: 9.5px; line-height: 1.2; min-height: 2.4em; white-space: normal; overflow: visible; word-break: keep-all; }
  .ball { position: absolute; right: 2px; bottom: 2px; min-width: 22px; height: 22px; padding: 0 4px; box-sizing: border-box; border-radius: 11px;
    background: ${ball.bg}; color: ${ball.fg}; font-weight: 700; font-size: 11px; line-height: 22px; text-align: center; box-shadow: 0 0 0 2px var(--vscode-sideBar-background); }
  /* Troféu estreito (Libertadores, Mundial): a base ocupa a largura toda, então a bolinha ficaria em cima dela; vai meio para fora, no mesmo canto. */
  .item.narrow .ball { right: -12px; bottom: 0; }
  .row.inline .item.narrow .ball { right: -9px; }
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
  // Na linha única (4 ou 5 competições) as colunas têm a mesma largura: a altura comum dos troféus é a que deixa o mais largo caber na coluna
  // (limitada a 100 px) e, se algum nome ainda não couber, o texto encolhe um pouco.
  function fitInline() {
    const row = document.querySelector('.row.inline');
    if (!row) return;
    const items = [...row.querySelectorAll('.item')];
    const names = [...row.querySelectorAll('.name')];
    const coluna = Math.min(...items.map((el) => el.clientWidth));
    const widest = Math.max(...items.map((el) => (parseFloat(el.dataset.aspect) || 0.8) * (parseFloat(el.dataset.k) || 1)));
    row.style.setProperty('--h', Math.max(40, Math.min(100, Math.floor(coluna / widest) - 2)) + 'px');
    let size = 9.5;
    names.forEach((el) => { el.style.fontSize = size + 'px'; });
    while (size > 7 && names.some((el) => el.scrollWidth > el.clientWidth + 0.5)) {
      size -= 0.25;
      names.forEach((el) => { el.style.fontSize = size + 'px'; });
    }
  }
  fitInline();
  addEventListener('resize', fitInline);
</script></body></html>`;
}

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Cada seção do explorador é um webview com a sua página, refeita quando o tema muda. Para uma seção nova: página aqui, entrada em `views` no build.
const VIEWS = {
  'brasileirao.titulos': titlesHtml
};

function registerViews(context) {
  const open = new Map();
  const refresh = () => {
    const themeName = vscode.workspace.getConfiguration('workbench').get('colorTheme');
    for (const [id, view] of open) view.webview.html = VIEWS[id](palettes[themeName]);
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
  for (const id of Object.keys(VIEWS)) {
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(id, {
      resolveWebviewView(v) {
        open.set(id, v);
        v.onDidDispose(() => open.delete(id));
        v.webview.options = { enableScripts: true };
        refresh();
      }
    }));
  }
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => { if (e.affectsConfiguration('workbench.colorTheme')) refresh(); }));
}

async function sync(context) {
  const themeName = vscode.workspace.getConfiguration('workbench').get('colorTheme');
  const palette = palettes[themeName];
  for (const fn of [syncIconTheme, syncIndentRainbow, syncBetterComments, syncCrest]) {
    try {
      await fn(context, palette);
    } catch (err) {
      console.warn(`Brasileirão Theme: ${fn.name} falhou`, err);
    }
  }
}

// "· 5 opções de escudo": o pontinho separa o nome do time da quantidade de escudos que ele tem para escolher (o atual, os atuais alternativos e os
// retrô), como em "Mundial · 1 título" na seção Títulos.
const optionsLabel = (n) => `· ${n} ${n === 1 ? 'opção' : 'opções'} de escudo`;
const iconFile = (palette, file) => {
  const full = path.join(__dirname, '..', 'icons', palette.slug, file);
  return fs.existsSync(full) ? vscode.Uri.file(full) : undefined;
};

// Guarda (ou apaga, com null) o escudo antigo escolhido para o time.
async function setCrestVariant(context, slug, id) {
  const variants = { ...(context.globalState.get(CREST_VARIANTS) || {}) };
  if (id) variants[slug] = id;
  else delete variants[slug];
  await context.globalState.update(CREST_VARIANTS, variants);
}

// Lista o escudo atual e os antigos do time, cada um com a miniatura. Devolve o id escolhido, null para o escudo atual ou undefined se cancelou.
async function pickRetro(context, palette, themeName, choices = [...(palette.alternates || []), ...(palette.retro || [])]) {
  const current = chosenRetro(context, palette);
  // "Em uso" marca o escudo que está no fundo; o primeiro item (crestLabel) é o escudo de hoje (a silhueta), não necessariamente o que está em uso.
  // Tudo no rótulo, que sai na cor cheia (a descrição do seletor do VS Code sai esmaecida): "Atual · Símbolo · desde 2018", "1915 · União F.C." e a marca de em uso.
  const line = (name, inUse) => [name, inUse ? '$(check) em uso' : ''].filter(Boolean).join(' · ');
  const items = [
    { label: line(palette.crestLabel || 'Atual', !current), inUse: !current, id: null, iconPath: iconFile(palette, palette.crestIcon || 'escudo.svg') },
    ...choices.map((r) => ({ label: line(r.label, current && current.id === r.id), inUse: Boolean(current && current.id === r.id), id: r.id, iconPath: iconFile(palette, r.file) }))
  ];
  const picker = vscode.window.createQuickPick();
  picker.title = `Escudo do fundo: ${themeName}`;
  picker.placeholder = 'Escolha o escudo';
  picker.items = items;
  // A seleção já começa no escudo em uso, e não no primeiro da lista.
  picker.activeItems = [items.find((i) => i.inUse) || items[0]];
  const picked = await new Promise((resolve) => {
    picker.onDidAccept(() => resolve(picker.selectedItems[0]));
    picker.onDidHide(() => resolve(undefined));
    picker.show();
  });
  picker.dispose();
  return picked ? picked.id : undefined;
}

// "Brasileirão: Escolher time": lista os times com o atual já selecionado. O seletor padrão do VS Code
// (botão "Set Color Theme" da página da extensão) abre em ordem alfabética e já aplica uma prévia do primeiro item.
// Escolher um time que tem mais de um escudo (atuais e retrô) abre a lista com todas as opções; sem opções extras, aplica o escudo atual.
async function chooseTeam(context) {
  const workbench = vscode.workspace.getConfiguration('workbench');
  const current = workbench.get('colorTheme');
  const picker = vscode.window.createQuickPick();
  picker.placeholder = 'Escolha o time';
  picker.title = 'Brasileirão Theme';

  // A descrição do seletor do VS Code sai esmaecida; o texto do rótulo sai na cor cheia. Por isso tudo vai no rótulo, em branco: a quantidade
  // de opções de escudo ("· 5 opções de escudo") e, no time em uso, só "em uso" (sem a quantidade).
  const teams = Object.entries(palettes).map(([team, p]) => {
    const extra = team === current ? ' · $(check) em uso' : ` ${optionsLabel(1 + (p.alternates || []).length + (p.retro || []).length)}`;
    return { team, label: team + extra, detail: p.swatch, iconPath: iconFile(p, p.listIcon || p.crestIcon || 'escudo.svg') };
  });
  picker.items = teams;
  picker.activeItems = teams.filter((i) => i.team === current);

  const chosen = await new Promise((resolve) => {
    picker.onDidAccept(() => resolve(picker.selectedItems[0]));
    picker.onDidHide(() => resolve(undefined));
    picker.show();
  });
  picker.dispose();
  if (!chosen) return;

  const palette = palettes[chosen.team];
  let variant = null; // null: escudo atual
  if ((palette.alternates || []).length || (palette.retro || []).length) {
    variant = await pickRetro(context, palette, chosen.team);
    if (variant === undefined) return;
  }
  // O escudo é gravado antes de trocar o tema, para a sincronização que a troca dispara já usar o escolhido.
  await setCrestVariant(context, palette.slug, variant);
  if (chosen.team !== current) await workbench.update('colorTheme', chosen.team, Global);
  else await sync(context);
}

// "Brasileirão: Escolher escudo do fundo": o escudo atual (silhueta) ou um dos antigos do time atual, com a miniatura de cada um.
async function chooseCrest(context) {
  const themeName = vscode.workspace.getConfiguration('workbench').get('colorTheme');
  const palette = palettes[themeName];
  if (!palette) {
    vscode.window.showInformationMessage('Escolha antes um tema "Brasileirão: <time>".');
    return;
  }
  if (!(palette.retro || []).length && !(palette.alternates || []).length) {
    vscode.window.showInformationMessage(`${themeName.replace(/^.*: /, '')} ainda não tem escudos antigos.`);
    return;
  }
  const picked = await pickRetro(context, palette, themeName);
  if (picked === undefined) return;
  await setCrestVariant(context, palette.slug, picked);
  await sync(context);
}

function activate(context) {
  sync(context);
  registerViews(context);
  context.subscriptions.push(vscode.commands.registerCommand('brasileirao.escolherTime', () => chooseTeam(context)));
  context.subscriptions.push(vscode.commands.registerCommand('brasileirao.escolherEscudo', () => chooseCrest(context)));
  // Os botões "Set Color Theme" e "Set File Icon Theme" da página da extensão são do VS Code e abrem o seletor padrão;
  // este botão na barra de status abre o seletor da coleção (com escudos), que também troca o tema de ícones.
  const pick = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  pick.command = 'brasileirao.escolherTime';
  pick.text = '$(organization) Times';
  pick.tooltip = 'Brasileirão: Escolher time';
  pick.show();
  context.subscriptions.push(pick);
  // Atalho para o escudo do fundo (atual ou retrô) do time em uso, sem passar pelo seletor de times.
  const crest = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -1);
  crest.command = 'brasileirao.escolherEscudo';
  crest.text = '$(shield) Escudos';
  crest.tooltip = 'Brasileirão: Escolher escudo do fundo (atuais ou retrô)';
  crest.show();
  context.subscriptions.push(crest);
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('workbench.colorTheme') || e.affectsConfiguration('brasileirao.syncIconTheme') || e.affectsConfiguration('brasileirao.crestBackground') || e.affectsConfiguration('brasileirao.crestOpacity')) sync(context);
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
