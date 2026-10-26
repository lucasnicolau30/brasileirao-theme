// Gera os temas de cores, os temas de ícones e o bloco `contributes` do package.json.
// Uso: node src/build.js
const fs = require('fs');
const path = require('path');
const teams = require('./teams');
const { buildTheme } = require('./theme');
const os = require('os');
const { PREFIX, ID } = require('./brand');
const { iconTheme, iconFiles, materialIconTheme } = require('./icons');
const { commentTags } = require('./comments');
const escudosRetro = require('./escudos-retro.json');

const root = path.join(__dirname, '..');
// Escudo no fundo do editor: centro da área de texto, que é uns 50px à esquerda do centro do editor (o minimapa ocupa a direita).
const BG_POSITION = 'calc(50% - 50px) 50%';
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

// Material Icon Theme instalado nesta máquina (a versão mais nova). Se existir, o tema de ícones usa os
// ícones de arquivo dele (MIT; a licença vai junto no pacote). Sem ele, usa os 18 ícones próprios.
function findMaterial() {
  const dir = path.join(os.homedir(), '.vscode', 'extensions');
  if (!fs.existsSync(dir)) return null;
  const found = fs.readdirSync(dir).filter((d) => d.startsWith('pkief.material-icon-theme-')).sort();
  if (!found.length) return null;
  const base = path.join(dir, found[found.length - 1]);
  const json = path.join(base, 'dist', 'material-icons.json');
  return fs.existsSync(json) ? { base, theme: JSON.parse(fs.readFileSync(json, 'utf8')) } : null;
}

// Escudo opcional: se existir assets/escudos/<slug>.svg (ou .png), vira o ícone da pasta.
function findCrest(slug) {
  for (const ext of ['svg', 'png']) {
    const f = path.join(root, 'assets', 'escudos', `${slug}.${ext}`);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

// Imagem para o fundo do editor, onde o escudo aparece grande: usa assets/escudos/fundo/<slug>.(svg|png) quando
// existe (versão em alta resolução) e, senão, o próprio escudo. Copia sem alterar. Devolve o nome do arquivo.
function copyBackgroundImage(slug, crest, dir) {
  const hd = ['svg', 'png'].map((ext) => path.join(root, 'assets', 'escudos', 'fundo', `${slug}.${ext}`)).find(fs.existsSync);
  const source = hd || crest;
  // O hash no nome muda o caminho quando a imagem muda, e assim o VS Code e a extensão Background não ficam com a cópia antiga em cache.
  const hash = require('crypto').createHash('sha1').update(fs.readFileSync(source)).digest('hex').slice(0, 8);
  const name = `fundo-${hash}${path.extname(source)}`;
  fs.copyFileSync(source, path.join(dir, name));
  return name;
}

// Devolve um SVG quadrado de 16x16 com o escudo centralizado, qualquer que seja o formato de origem.
function crestToSvg(file) {
  if (file.endsWith('.png')) {
    const buf = fs.readFileSync(file);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">' +
      `<image x="0" y="0" width="16" height="16" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${buf.toString('base64')}"/></svg>\n`;
  }
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/<svg\b[^>]*>/);
  if (!m) throw new Error(`SVG sem tag raiz: ${file}`);
  let tag = m[0];
  const attr = (name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
  const num = (v) => parseFloat(String(v).replace(/[a-z%]+$/i, ''));
  let viewBox = attr('viewBox');
  if (!viewBox) {
    const w = num(attr('width'));
    const h = num(attr('height'));
    if (!(w > 0 && h > 0)) throw new Error(`SVG sem viewBox nem width/height: ${file}`);
    viewBox = `0 0 ${w} ${h}`;
  }
  tag = tag.replace(/\s(width|height|viewBox|preserveAspectRatio)="[^"]*"/g, '').replace(/>$/, ` viewBox="${viewBox}" width="16" height="16" preserveAspectRatio="xMidYMid meet">`);
  return text.replace(m[0], tag);
}

// Começa do zero para não sobrar arquivo de um time que saiu da lista.
for (const dir of ['themes', 'icons']) fs.rmSync(path.join(root, dir), { recursive: true, force: true });

// Proporção (largura/altura) de uma imagem de fundo, lida do cabeçalho do PNG ou do viewBox do SVG. A extensão a usa para limitar a largura dos escudos largos.
function imageAspect(file) {
  const buf = fs.readFileSync(file);
  if (file.endsWith('.png')) return buf.readUInt32BE(16) / buf.readUInt32BE(20); // IHDR: largura e altura
  const root = buf.toString('utf8').match(/<svg\b[^>]*>/);
  const box = root && root[0].match(/viewBox="([^"]+)"/);
  if (box) {
    const [, , w, h] = box[1].replace(/,/g, ' ').trim().split(/\s+/).map(Number);
    return w / h;
  }
  // Sem viewBox (como o escudo do Botafogo), vale width/height da tag.
  const w = root && parseFloat((root[0].match(/\swidth="([\d.]+)/) || [])[1]);
  const h = root && parseFloat((root[0].match(/\sheight="([\d.]+)/) || [])[1]);
  if (!(w > 0 && h > 0)) throw new Error(`SVG sem viewBox nem width/height: ${file}`);
  return w / h;
}

// Escudos antigos: copia de assets/escudos/retro/<slug>/<id>.(svg|png) os que existem (baixar_escudos_retro.py). O hash no nome evita cache velho.
const missingRetro = [];
const retroByTeam = {};
function collectRetro(team) {
  const found = [];
  for (const entry of escudosRetro[team.slug] || []) {
    const source = ['svg', 'png'].map((ext) => path.join(root, 'assets', 'escudos', 'retro', team.slug, `${entry.id}.${ext}`)).find(fs.existsSync);
    if (!source) {
      missingRetro.push(`${team.slug}/${entry.id}`);
      continue;
    }
    const hash = require('crypto').createHash('sha1').update(fs.readFileSync(source)).digest('hex').slice(0, 8);
    const name = `retro-${entry.id}-${hash}${path.extname(source)}`;
    fs.mkdirSync(path.join(root, 'icons', team.slug), { recursive: true });
    fs.copyFileSync(source, path.join(root, 'icons', team.slug, name));
    // Retrô: o rótulo é a data de uso, com o nome depois ("1915 · União F.C.") só quando o escudo tem nome. Segundo escudo atual ("atual": true):
    // "Completo (desde 2018)" vira "Atual · Completo · desde 2018".
    const [, nome, desde] = entry.label.match(/^(.*?)(?: \((.*)\))?$/);
    const label = entry.atual ? ['Atual', nome, desde].filter(Boolean).join(' · ') : entry.label;
    found.push({ id: entry.id, label, fullLabel: label, atual: Boolean(entry.atual), file: name, aspect: Number(imageAspect(path.join(root, 'icons', team.slug, name)).toFixed(3)) });
  }
  // Ordem cronológica no seletor: pelo ano em que o escudo começa e, em empate, pelo ano em que termina (a ordem do JSON desempata).
  const anos = (r) => (r.label.match(/\d{4}/g) || []).map(Number);
  return found.sort((a, b) => (anos(a)[0] || 0) - (anos(b)[0] || 0) || (anos(a)[1] || anos(a)[0] || 0) - (anos(b)[1] || anos(b)[0] || 0));
}

const material = findMaterial();
const materialFiles = new Set();
const backgrounds = {};
const themes = [];
const iconThemes = [];
const crestIcons = {}; // slug -> { atual, lista }: nomes (com hash do conteúdo) dos ícones do escudo atual
let crests = 0;

for (const team of teams) {
  write(path.join(root, 'themes', `${team.slug}-color-theme.json`), JSON.stringify(buildTheme(team), null, 2) + '\n');
  themes.push({ label: `${PREFIX}: ${team.label}`, uiTheme: 'vs-dark', path: `./themes/${team.slug}-color-theme.json` });

  const crest = findCrest(team.slug);
  if (!crest) throw new Error(`falta assets/escudos/${team.slug}.svg (ou .png)`);
  crests += 1;
  // iconFromBackground: o ícone de pasta é a mesma silhueta do fundo (o CRF do Flamengo), não o escudo inteiro.
  const crestForIcon = team.iconFromBackground ? ['svg', 'png'].map((ext) => path.join(root, 'assets', 'escudos', 'fundo', `${team.slug}.${ext}`)).find(fs.existsSync) || crest : crest;
  // O ícone leva o hash do conteúdo no nome (como os retrôs e o fundo): o VS Code guarda a imagem pelo endereço e, com nome fixo ('escudo.svg'),
  // mostra o ícone antigo mesmo depois de reinstalar a extensão.
  const hashed = (name, svg) => `${name}-${require('crypto').createHash('sha1').update(svg).digest('hex').slice(0, 8)}.svg`;
  const crestSvgAtual = crestToSvg(crestForIcon);
  const crestFile = hashed('escudo', crestSvgAtual);
  write(path.join(root, 'icons', team.slug, crestFile), crestSvgAtual);
  crestIcons[team.slug] = { atual: crestFile, lista: crestFile };
  // Na lista do seletor de times o escudo aparece inteiro, qualquer que seja o ícone de pasta (listIcon na paleta).
  const hasFullCrest = (escudosRetro[team.slug] || []).some((e) => e.atual);
  if (team.iconFromBackground && hasFullCrest) {
    const listaSvg = crestToSvg(crest);
    crestIcons[team.slug].lista = hashed('escudo-lista', listaSvg);
    write(path.join(root, 'icons', team.slug, crestIcons[team.slug].lista), listaSvg);
  }
  for (const [name, svg] of Object.entries(iconFiles(Boolean(material)))) {
    write(path.join(root, 'icons', team.slug, name), svg + '\n');
  }
  const backgroundImage = copyBackgroundImage(team.slug, crest, path.join(root, 'icons', team.slug));
  backgrounds[team.slug] = backgroundImage;
  let theme;
  if (material) {
    const result = materialIconTheme(material.theme, crestFile, '../_material');
    result.files.forEach((f) => materialFiles.add(f));
    theme = result.theme;
  } else {
    theme = iconTheme(team, crestFile);
  }
  write(path.join(root, 'icons', team.slug, 'icon-theme.json'), JSON.stringify(theme, null, 2) + '\n');
  iconThemes.push({ id: `${ID}-${team.slug}`, label: `${PREFIX}: ${team.label}`, path: `./icons/${team.slug}/icon-theme.json` });

  // Escudo antigo escolhido: o ícone de pasta também muda. O tema de ícones é um arquivo fixo, então cada escudo antigo ganha o seu
  // (compacto, sem indentação). Para PNG usa a miniatura de 64 px (<id>.icon.png); o SVG entra como está.
  retroByTeam[team.slug] = collectRetro(team);
  for (const r of retroByTeam[team.slug]) {
    const small = path.join(root, 'assets', 'escudos', 'retro', team.slug, `${r.id}.icon.png`);
    const source = fs.existsSync(small) ? small : path.join(root, 'icons', team.slug, r.file);
    // O ícone de pasta leva o hash do conteúdo no nome (como o fundo): o VS Code guarda a imagem pelo endereço e, com nome fixo, mostra o ícone
    // antigo mesmo depois de reinstalar a extensão.
    const crestSvg = crestToSvg(source);
    const retroCrestFile = `escudo-${r.id}-${require('crypto').createHash('sha1').update(crestSvg).digest('hex').slice(0, 8)}.svg`;
    write(path.join(root, 'icons', team.slug, retroCrestFile), crestSvg);
    let retroTheme;
    if (material) {
      const result = materialIconTheme(material.theme, retroCrestFile, '../_material');
      result.files.forEach((f) => materialFiles.add(f));
      retroTheme = result.theme;
    } else {
      retroTheme = iconTheme(team, retroCrestFile);
    }
    r.iconTheme = `${ID}-${team.slug}-${r.id}`;
    write(path.join(root, 'icons', team.slug, `icon-theme-${r.id}.json`), JSON.stringify(retroTheme));
    iconThemes.push({ id: r.iconTheme, label: `${PREFIX}: ${team.label} (${r.atual ? '' : 'retrô '}${r.fullLabel})`, path: `./icons/${team.slug}/icon-theme-${r.id}.json` });
  }
}

// Uma única cópia dos ícones do Material, compartilhada pelos temas, com a licença (MIT).
if (material) {
  fs.mkdirSync(path.join(root, 'icons', '_material'), { recursive: true });
  for (const f of materialFiles) {
    fs.copyFileSync(path.join(material.base, 'icons', f), path.join(root, 'icons', '_material', f));
  }
  fs.copyFileSync(path.join(material.base, 'LICENSE.txt'), path.join(root, 'icons', '_material', 'LICENSE.txt'));
}

// Cores que a extensão aplica no indent-rainbow (4 níveis, 8% de opacidade) e no Better Comments (commentTags) quando o tema do time está ativo.
const hexToRgba = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;
const palettes = {};
for (const team of teams) {
  palettes[`${PREFIX}: ${team.label}`] = { slug: team.slug, crestLabel: ['Atual', retroByTeam[team.slug].some((r) => r.atual) ? 'Símbolo' : '', (team.crestLabel.match(/\((.*)\)$/) || [])[1]].filter(Boolean).join(' · '), crestIcon: crestIcons[team.slug].atual, listIcon: retroByTeam[team.slug].some((r) => r.atual) ? crestIcons[team.slug].lista : crestIcons[team.slug].atual, backgroundAspect: backgrounds[team.slug] ? Number(imageAspect(path.join(root, 'icons', team.slug, backgrounds[team.slug])).toFixed(3)) : null, titles: team.titles, retro: retroByTeam[team.slug].filter((r) => !r.atual), alternates: retroByTeam[team.slug].filter((r) => r.atual), swatch: team.swatch, primary: team.primary, background: backgrounds[team.slug], backgroundColored: Boolean(team.bgColored), backgroundSize: team.bgSize || null, backgroundPosition: team.bgPosition || BG_POSITION, iconTheme: `${ID}-${team.slug}`, colors: team.brackets.slice(0, 4).map((h) => hexToRgba(h, 0.08)), commentTags: commentTags(team) };
}
write(path.join(root, 'extension', 'palettes.json'), JSON.stringify(palettes, null, 2) + '\n');

// Ícone da extensão: o logo em assets/icone.png.
fs.copyFileSync(path.join(root, 'assets', 'icone.png'), path.join(root, 'images', 'icon.png'));

const pkgFile = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
pkg.contributes = {
  views: { explorer: [
    { type: 'webview', id: 'brasileirao.titulos', name: 'Títulos', visibility: 'visible', initialSize: 3, contextualTitle: 'Brasileirão Theme' }
  ] },
  themes,
  iconThemes,
  commands: [
    { command: 'brasileirao.escolherTime', title: `${PREFIX}: Escolher time` },
    { command: 'brasileirao.escolherEscudo', title: `${PREFIX}: Escolher escudo do fundo` }
  ],
  configuration: {
    title: 'Brasileirão Theme',
    properties: {
      'brasileirao.syncIconTheme': {
        type: 'boolean',
        default: true,
        description: 'Ao escolher um tema "Brasileirão: <time>", troca também o tema de ícones para o do mesmo time.'
      },
      'brasileirao.crestBackground': {
        type: 'boolean',
        default: true,
        description: 'Mostra o escudo do time, em branco e bem discreto, no fundo do editor. Precisa da extensão "Background" (shalldie.background).'
      },
      'brasileirao.crestOpacity': {
        type: 'number',
        default: 0.08,
        minimum: 0.01,
        maximum: 0.3,
        description: 'Opacidade do escudo no fundo do editor (0.01 a 0.3).'
      }
    }
  }
};
// Better Comments: o tema só consegue colorir `// !`, `// ?`, `// TODO` por meio dessa extensão, então ela é instalada junto.
pkg.extensionDependencies = ['aaron-bond.better-comments'];
write(pkgFile, JSON.stringify(pkg, null, 2) + '\n');

// Os créditos dos escudos antigos (autor e licença de cada arquivo) vão junto no pacote.
const retroCredits = path.join(root, 'assets', 'escudos', 'retro', 'CREDITS.txt');
if (fs.existsSync(retroCredits)) fs.copyFileSync(retroCredits, path.join(root, 'icons', 'retro-CREDITS.txt'));
const totalRetro = Object.values(escudosRetro).filter(Array.isArray).reduce((n, list) => n + list.length, 0);
console.log(`Escudos antigos: ${totalRetro - missingRetro.length} de ${totalRetro}${missingRetro.length ? ` (faltam: rode python baixar_escudos_retro.py)` : ''}`);
console.log(`${teams.length} temas de cores, ${teams.length} temas de ícones, ${crests} escudo(s)${material ? `, ícones de arquivo do Material (${materialFiles.size} SVGs)` : ''}`);
