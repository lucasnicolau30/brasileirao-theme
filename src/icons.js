const path = require('path');
const { mix } = require('./color');

const SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">';
const FONT = 'font-family="Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle"';

// Ícone de arquivo: quadrado arredondado colorido com a sigla do tipo.
function badge(color, text, textColor, fontSize) {
  return `${SVG_OPEN}<rect x="1" y="1" width="14" height="14" rx="3" fill="${color}"/>` +
    `<text x="8" y="${8 + fontSize * 0.36}" ${FONT} font-size="${fontSize}" fill="${textColor}">${text}</text></svg>`;
}

const genericFile = () =>
  `${SVG_OPEN}<path d="M3.5 1.5h6l3 3v10h-9z" fill="none" stroke="#9a9a9a" stroke-width="1" stroke-linejoin="round"/>` +
  '<path d="M9.5 1.5v3h3" fill="none" stroke="#9a9a9a" stroke-width="1" stroke-linejoin="round"/></svg>';

// Tipos de arquivo da v1: id, cor, sigla, cor do texto, tamanho da fonte, extensões e nomes de arquivo.
const FILE_TYPES = [
  { id: 'js', color: '#e8c933', text: 'JS', ink: '#1a1a1a', size: 7, ext: ['js', 'mjs', 'cjs'] },
  { id: 'jsx', color: '#2fb8d4', text: 'JSX', ink: '#0d0d0d', size: 5.5, ext: ['jsx'] },
  { id: 'ts', color: '#3a7bd5', text: 'TS', ink: '#ffffff', size: 7, ext: ['ts', 'mts', 'cts'] },
  { id: 'tsx', color: '#2a5fb0', text: 'TSX', ink: '#ffffff', size: 5.5, ext: ['tsx'] },
  { id: 'json', color: '#b58a3c', text: '{ }', ink: '#ffffff', size: 7, ext: ['json', 'jsonc'] },
  { id: 'pkg', color: '#4f9d52', text: 'PKG', ink: '#ffffff', size: 5.5, names: ['package.json', 'package-lock.json'] },
  { id: 'html', color: '#d9593a', text: '&lt;/&gt;', ink: '#ffffff', size: 6, ext: ['html', 'htm'] },
  { id: 'css', color: '#3b82c4', text: 'CSS', ink: '#ffffff', size: 5.5, ext: ['css', 'scss', 'sass', 'less'] },
  { id: 'md', color: '#6e7f91', text: 'MD', ink: '#ffffff', size: 7, ext: ['md', 'markdown'] },
  { id: 'py', color: '#4b8bbe', text: 'PY', ink: '#ffffff', size: 7, ext: ['py'] },
  { id: 'java', color: '#c8512f', text: 'JV', ink: '#ffffff', size: 7, ext: ['java'] },
  { id: 'cs', color: '#7b3fa0', text: 'C#', ink: '#ffffff', size: 7, ext: ['cs'] },
  { id: 'sql', color: '#8a6fb0', text: 'SQL', ink: '#ffffff', size: 5.5, ext: ['sql'] },
  { id: 'yml', color: '#b34f82', text: 'YML', ink: '#ffffff', size: 5.5, ext: ['yml', 'yaml'] },
  { id: 'sh', color: '#4a8f67', text: 'SH', ink: '#ffffff', size: 7, ext: ['sh', 'bash', 'zsh'] },
  { id: 'img', color: '#2f9c95', text: 'IMG', ink: '#ffffff', size: 5.5, ext: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp'] },
  { id: 'txt', color: '#7a7a7a', text: 'TXT', ink: '#ffffff', size: 5.5, ext: ['txt', 'log'] },
  { id: 'cfg', color: '#8c7a4a', text: 'CFG', ink: '#ffffff', size: 5.5, ext: ['env', 'ini', 'toml', 'cfg', 'conf', 'gitignore', 'gitattributes'] }
];

function folderClosed(color) {
  return `${SVG_OPEN}<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H6l1.5 1.5h6A1.5 1.5 0 0 1 15 5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5z" fill="${color}"/></svg>`;
}

function folderOpen(color) {
  const back = mix(color, '#000000', 0.35);
  const front = mix(color, '#ffffff', 0.2);
  return `${SVG_OPEN}<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2H6l1.5 1.5h6A1.5 1.5 0 0 1 15 5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5z" fill="${back}"/>` +
    `<path d="M3.2 6.2A1 1 0 0 1 4.1 5.5H15l-1.6 7.6a1 1 0 0 1-1 .8H2.5z" fill="${front}"/></svg>`;
}

// Pastas especiais: a pasta do time mais uma marca no canto.
function folderMarked(color, mark) {
  return folderClosed(color).replace('</svg>', `${mark}</svg>`);
}
const nodeModulesFolder = () =>
  folderMarked('#5d6b5d', '<circle cx="11.5" cy="10.5" r="2.6" fill="#5fb760" stroke="#0d0d0d" stroke-width="0.8"/>');
const gitFolder = () =>
  folderMarked('#6b625d', '<path d="M11.5 7.9l2.6 2.6-2.6 2.6-2.6-2.6z" fill="#e8743c" stroke="#0d0d0d" stroke-width="0.8" stroke-linejoin="round"/>');

// Monta o tema de ícones de um time. `crestFile` é o nome do arquivo do escudo (se existir).
function iconTheme(team, crestFile) {
  const defs = {
    _file: { iconPath: './file.svg' },
    _folder: { iconPath: crestFile ? `./${crestFile}` : './folder.svg' },
    _folder_open: { iconPath: crestFile ? `./${crestFile}` : './folder-open.svg' },
    _nm: { iconPath: './folder-node-modules.svg' },
    _git: { iconPath: './folder-git.svg' }
  };
  const fileExtensions = {};
  const fileNames = {};
  for (const t of FILE_TYPES) {
    defs['_' + t.id] = { iconPath: `./${t.id}.svg` };
    for (const e of t.ext || []) fileExtensions[e] = '_' + t.id;
    for (const n of t.names || []) fileNames[n] = '_' + t.id;
  }
  return {
    iconDefinitions: defs,
    file: '_file',
    folder: '_folder',
    folderExpanded: '_folder_open',
    rootFolder: '_folder',
    rootFolderExpanded: '_folder_open',
    folderNames: { node_modules: '_nm', '.git': '_git' },
    folderNamesExpanded: { node_modules: '_nm', '.git': '_git' },
    fileExtensions,
    fileNames
  };
}

// Tema de ícones "Material com a pasta do time": usa os ícones de arquivo do Material Icon Theme
// (instalado na máquina) e troca TODAS as pastas pelo ícone do time. `material` é o JSON do tema do Material
// e `materialRef` o caminho relativo, a partir da pasta do tema do time, até a cópia dos SVGs do Material.
// Devolve também o conjunto de SVGs do Material que ficaram em uso, para o build copiá-los.
function materialIconTheme(material, crestFile, materialRef) {
  const folderKeys = ['folderNames', 'folderNamesExpanded', 'rootFolderNames', 'rootFolderNamesExpanded'];
  const theme = JSON.parse(JSON.stringify(material));
  const own = {
    _folder: { iconPath: crestFile ? `./${crestFile}` : './folder.svg' },
    _folder_open: { iconPath: crestFile ? `./${crestFile}` : './folder-open.svg' }
  };
  for (const k of folderKeys) {
    theme[k] = {};
    if (theme.light) theme.light[k] = {};
  }
  theme.folder = '_folder';
  theme.folderExpanded = '_folder_open';
  theme.rootFolder = '_folder';
  theme.rootFolderExpanded = '_folder_open';

  // Só os ícones ainda referenciados (arquivos, linguagens e variações claras) precisam ser copiados.
  const used = new Set([theme.file]);
  const collect = (obj) => {
    if (!obj) return;
    for (const group of ['fileExtensions', 'fileNames', 'languageIds']) {
      for (const id of Object.values(obj[group] || {})) used.add(id);
    }
  };
  collect(theme);
  collect(theme.light);
  collect(theme.highContrast);

  const defs = {};
  const files = [];
  for (const id of used) {
    const def = material.iconDefinitions[id];
    if (!def) continue;
    const name = path.basename(def.iconPath);
    defs[id] = { iconPath: `${materialRef}/${name}` };
    files.push(name);
  }
  theme.iconDefinitions = { ...defs, ...own };
  return { theme, files };
}

// Arquivos SVG do tema de ícones (nome do arquivo -> conteúdo).
function iconFiles(team, hasCrest, onlyFolders = false) {
  const files = onlyFolders ? {} : { 'file.svg': genericFile(), 'folder-node-modules.svg': nodeModulesFolder(), 'folder-git.svg': gitFolder() };
  if (!hasCrest) {
    files['folder.svg'] = folderClosed(team.primary);
    files['folder-open.svg'] = folderOpen(team.primary);
  }
  if (!onlyFolders) for (const t of FILE_TYPES) files[`${t.id}.svg`] = badge(t.color, t.text, t.ink, t.size);
  return files;
}

module.exports = { iconTheme, iconFiles, materialIconTheme, FILE_TYPES };
