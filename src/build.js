// Gera os temas de cores, os temas de ícones e o bloco `contributes` do package.json.
// Uso: node src/build.js
const fs = require('fs');
const path = require('path');
const teams = require('./teams');
const { buildTheme } = require('./theme');
const os = require('os');
const { PREFIX, ID } = require('./brand');
const { iconTheme, iconFiles, materialIconTheme } = require('./icons');

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
function copyBackgroundImage(slug, crest, dir, tint) {
  const hd = ['svg', 'png'].map((ext) => path.join(root, 'assets', 'escudos', 'fundo', `${slug}.${ext}`)).find(fs.existsSync);
  const source = hd || crest;
  // O hash no nome muda o caminho quando a imagem muda, e assim o VS Code e a extensão Background não ficam com a cópia antiga em cache.
  const hash = require('crypto').createHash('sha1').update(fs.readFileSync(source)).digest('hex').slice(0, 8);
  const name = `fundo-${hash}${path.extname(source)}`;
  if (tint && source.endsWith('.svg')) {
    fs.writeFileSync(path.join(dir, name), fs.readFileSync(source, 'utf8').replace(/#ffffff/gi, tint));
  } else {
    fs.copyFileSync(source, path.join(dir, name));
  }
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

const material = findMaterial();
const materialFiles = new Set();
const backgrounds = {};
const themes = [];
const iconThemes = [];
let crests = 0;

for (const team of teams) {
  write(path.join(root, 'themes', `${team.slug}-color-theme.json`), JSON.stringify(buildTheme(team), null, 2) + '\n');
  themes.push({ label: `${PREFIX}: ${team.label}`, uiTheme: 'vs-dark', path: `./themes/${team.slug}-color-theme.json` });

  const crest = findCrest(team.slug);
  const crestFile = crest ? 'escudo.svg' : null;
  if (crest) {
    crests += 1;
    write(path.join(root, 'icons', team.slug, crestFile), crestToSvg(crest));
  }
  for (const [name, svg] of Object.entries(iconFiles(team, Boolean(crest), Boolean(material)))) {
    write(path.join(root, 'icons', team.slug, name), svg + '\n');
  }
  const backgroundImage = crest ? copyBackgroundImage(team.slug, crest, path.join(root, 'icons', team.slug), team.bgColor) : null;
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
}

// Uma única cópia dos ícones do Material, compartilhada pelos 12 temas, com a licença (MIT).
if (material) {
  fs.mkdirSync(path.join(root, 'icons', '_material'), { recursive: true });
  for (const f of materialFiles) {
    fs.copyFileSync(path.join(material.base, 'icons', f), path.join(root, 'icons', '_material', f));
  }
  fs.copyFileSync(path.join(material.base, 'LICENSE.txt'), path.join(root, 'icons', '_material', 'LICENSE.txt'));
}

// Cores que a extensão aplica no indent-rainbow quando o tema do time está ativo (4 níveis, 8% de opacidade).
const hexToRgba = (h, a) => `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;
const palettes = {};
for (const team of teams) {
  palettes[`${PREFIX}: ${team.label}`] = { slug: team.slug, titles: team.titles, swatch: team.swatch, accent: team.accent, primary: team.primary, statusFg: team.statusFg, background: backgrounds[team.slug], backgroundTint: Boolean(team.bgColor), backgroundSize: team.bgSize || null, backgroundPosition: team.bgPosition || BG_POSITION, iconTheme: `${ID}-${team.slug}`, colors: team.brackets.slice(0, 4).map((h) => hexToRgba(h, 0.08)) };
}
write(path.join(root, 'extension', 'palettes.json'), JSON.stringify(palettes, null, 2) + '\n');

// Ícone da extensão: o logo em assets/icone.png nas duas versões; sem esse arquivo, o ícone padrão (faixas).
const logoIcon = path.join(root, 'assets', 'icone.png');
fs.copyFileSync(fs.existsSync(logoIcon) ? logoIcon : path.join(root, 'images', 'icon-padrao.png'), path.join(root, 'images', 'icon.png'));

const pkgFile = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
pkg.contributes = {
  views: { explorer: [{ type: 'webview', id: 'brasileirao.titulos', name: 'Títulos', visibility: 'visible', initialSize: 3, contextualTitle: 'Brasileirão Theme' }] },
  themes,
  iconThemes,
  commands: [{ command: 'brasileirao.escolherTime', title: `${PREFIX}: Escolher time` }],
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
write(pkgFile, JSON.stringify(pkg, null, 2) + '\n');

console.log(`${teams.length} temas de cores, ${teams.length} temas de ícones, ${crests} escudo(s)${material ? `, ícones de arquivo do Material (${materialFiles.size} SVGs)` : ''}`);
