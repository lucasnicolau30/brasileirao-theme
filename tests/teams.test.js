// Testes dos dados de src/teams.js e da coerência entre eles e o que o build gerou.
// Uso: npm test   (roda `node --test tests/`; é preciso ter rodado `npm run build` antes)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const teams = require('../src/teams');
const { PREFIX, ID } = require('../src/brand');
const { contrast } = require('../src/color');

const root = path.join(__dirname, '..');
const palettes = require('../extension/palettes.json');

// Contagens conferidas à mão (independentes dos anos em teams.js): se um ano for apagado ou incluído por engano, falha.
// Brasileirão pelo critério da CBF (1959 em diante, mais o Atlético-MG em 1937); o Flamengo conta também 1987.
const EXPECTED = {
  flamengo: [9, 5, 4],
  fluminense: [4, 1, 1],
  botafogo: [3, 0, 1],
  vasco: [4, 1, 1],
  corinthians: [7, 4, 1],
  palmeiras: [12, 4, 3],
  'sao-paulo': [6, 1, 3],
  santos: [8, 1, 3],
  cruzeiro: [4, 6, 2],
  'atletico-mg': [3, 2, 1],
  gremio: [2, 5, 3],
  internacional: [3, 1, 2],
  bahia: [2, 0, 0],
  fortaleza: [0, 0, 0],
  'athletico-pr': [1, 1, 0],
  vitoria: [0, 0, 0],
  sport: [1, 1, 0],
  ceara: [0, 0, 0],
  guarani: [1, 0, 0],
  remo: [0, 0, 0],
  paysandu: [0, 0, 0],
  amazonas: [0, 0, 0],
  coritiba: [1, 0, 0],
  goias: [0, 0, 0],
  bragantino: [0, 0, 0],
  mirassol: [0, 0, 0],
  chapecoense: [0, 0, 0]
};
const FIRST_YEAR = { brasileirao: 1937, copaDoBrasil: 1989, libertadores: 1960, mundial: 1960, sulAmericana: 2002, serieB: 1971, serieC: 1981, serieD: 2009, copaDoNordeste: 1994 };
// Mundial (Intercontinental + Mundial da FIFA), Sul-Americana, Série B, C e D: [mundial, sulAmericana, serieB, serieC, serieD], conferido à mão nas listas oficiais.
const EXPECTED_OTHER = {
  flamengo: [1, 0, 0, 0, 0],
  fluminense: [0, 0, 0, 0, 0],
  botafogo: [0, 0, 0, 0, 0],
  vasco: [0, 0, 0, 0, 0],
  corinthians: [2, 0, 0, 0, 0],
  palmeiras: [0, 0, 0, 0, 0],
  'sao-paulo': [3, 1, 0, 0, 0],
  santos: [2, 0, 0, 0, 0],
  cruzeiro: [0, 0, 0, 0, 0],
  'atletico-mg': [0, 0, 0, 0, 0],
  gremio: [1, 0, 0, 0, 0],
  internacional: [1, 1, 0, 0, 0],
  bahia: [0, 0, 0, 0, 0],
  fortaleza: [0, 0, 1, 0, 0],
  'athletico-pr': [0, 2, 1, 0, 0],
  vitoria: [0, 0, 1, 0, 0],
  sport: [0, 0, 1, 0, 0],
  ceara: [0, 0, 0, 0, 0],
  guarani: [0, 0, 1, 0, 0],
  remo: [0, 0, 0, 1, 0],
  paysandu: [0, 0, 2, 0, 0],
  amazonas: [0, 0, 0, 1, 0],
  coritiba: [0, 0, 3, 0, 0],
  goias: [0, 0, 2, 0, 0],
  bragantino: [0, 0, 2, 1, 0],
  mirassol: [0, 0, 0, 1, 1],
  chapecoense: [0, 1, 1, 0, 0]
};
const LAST_YEAR = 2025; // última temporada incluída
const LAST_YEAR_NORDESTE = 2026; // a Copa do Nordeste de 2026 já foi decidida (Vitória)
// Copa do Nordeste (só times do Nordeste), conferida à mão na Wikipédia: número de títulos por time.
const EXPECTED_NORDESTE = { bahia: 5, vitoria: 5, ceara: 3, fortaleza: 3, sport: 3 };
// Ano repetido na mesma lista só quando houve dois títulos no mesmo ano.
const ALLOWED_DUPLICATES = { palmeiras: { brasileirao: [1967] } };
const HEX = /^#[0-9a-f]{6}$/i;

test('há 24 times, com slug e rótulo únicos', () => {
  assert.equal(teams.length, 27);
  assert.equal(new Set(teams.map((t) => t.slug)).size, teams.length);
  assert.equal(new Set(teams.map((t) => t.label)).size, teams.length);
});

for (const team of teams) {
  test(`${team.slug}: campos obrigatórios e cores válidas`, () => {
    for (const key of ['bg', 'primary', 'accent', 'statusBg', 'statusFg', 'fg']) assert.match(team[key], HEX, `${key} inválida`);
    assert.equal(team.brackets.length, 6);
    team.brackets.forEach((c) => assert.match(c, HEX));
    assert.ok(team.swatch && team.swatch.length > 0, 'falta o swatch (quadradinhos de cor)');
    assert.match(team.uf, /^[A-Z]{2}$/, 'uf deve ser a sigla do estado');
  });

  test(`${team.slug}: colchetes na cor do time (sem cinza solto) e regra de colchetes no tema`, () => {
    const spread = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return Math.max(...c) - Math.min(...c); };
    // Os times em preto e branco têm o cinza como identidade; nos coloridos, cada nível é a cor do time ou branco.
    if (spread(team.accent) >= 40) {
      team.brackets.forEach((c, i) => assert.ok(c.toLowerCase() === '#ffffff' || spread(c) >= 12, `nível ${i + 1} (${c}) é cinza`));
    }
    const theme = require(path.join(root, 'themes', `${team.slug}-color-theme.json`));
    const rule = theme.tokenColors.find((r) => r.name === 'Colchetes');
    assert.ok(rule, 'falta a regra "Colchetes" em tokenColors');
    assert.equal(rule.settings.foreground, team.brackets[0]);
  });

  test(`${team.slug}: tags do Better Comments legíveis e gravadas na paleta`, () => {
    const tags = palettes[`${PREFIX}: ${team.label}`].commentTags;
    assert.deepEqual(tags.map((t) => t.tag), ['!', '?', 'todo', '*', '//']);
    tags.forEach((t) => assert.ok(contrast(t.color, team.bg) >= 4.5, `tag "${t.tag}" (${t.color}) ilegível sobre o fundo`));
    assert.equal(new Set(tags.slice(0, 4).map((t) => JSON.stringify([t.color, t.bold, t.italic, t.underline, t.backgroundColor]))).size, 4, 'duas tags com a mesma aparência');
  });

  test(`${team.slug}: títulos (anos em ordem, no intervalo certo, sem repetição indevida)`, () => {
    assert.deepEqual(Object.keys(team.titles).sort(), ['brasileirao', 'copaDoBrasil', 'copaDoNordeste', 'libertadores', 'mundial', 'serieB', 'serieC', 'serieD', 'sulAmericana']);
    for (const [key, years] of Object.entries(team.titles)) {
      assert.ok(Array.isArray(years), `${key} deve ser uma lista de anos`);
      years.forEach((y) => {
        assert.ok(Number.isInteger(y), `${key}: ${y} não é inteiro`);
        const ultimo = key === 'copaDoNordeste' ? LAST_YEAR_NORDESTE : LAST_YEAR;
        assert.ok(y >= FIRST_YEAR[key] && y <= ultimo, `${key}: ${y} fora de ${FIRST_YEAR[key]}-${ultimo}`);
      });
      assert.deepEqual(years, [...years].sort((a, b) => a - b), `${key}: anos fora de ordem`);
      const allowed = (ALLOWED_DUPLICATES[team.slug] || {})[key] || [];
      years.forEach((y, i) => {
        if (i > 0 && years[i - 1] === y) assert.ok(allowed.includes(y), `${key}: ${y} repetido`);
      });
    }
  });

  test(`${team.slug}: contagem de títulos confere com a tabela conferida à mão`, () => {
    const t = team.titles;
    assert.deepEqual([t.brasileirao.length, t.copaDoBrasil.length, t.libertadores.length], EXPECTED[team.slug]);
    assert.deepEqual([t.mundial, t.sulAmericana, t.serieB, t.serieC, t.serieD].map((y) => y.length), EXPECTED_OTHER[team.slug]);
    assert.equal(t.copaDoNordeste.length, EXPECTED_NORDESTE[team.slug] ?? 0, 'Copa do Nordeste');
  });

  test(`${team.slug}: o escudo de fundo existe`, () => {
    const crest = ['svg', 'png'].map((e) => path.join(root, 'assets', 'escudos', `${team.slug}.${e}`)).find(fs.existsSync);
    assert.ok(crest, 'falta assets/escudos/<slug>.svg ou .png');
  });

  test(`${team.slug}: o build gerou tema, ícones e paleta coerentes`, () => {
    const label = `${PREFIX}: ${team.label}`;
    const p = palettes[label];
    assert.ok(p, `falta ${label} em extension/palettes.json (rode npm run build)`);
    assert.equal(p.slug, team.slug);
    assert.equal(p.iconTheme, `${ID}-${team.slug}`);
    assert.deepEqual(p.titles, team.titles, 'palettes.json desatualizado em relação a teams.js');
    assert.ok(fs.existsSync(path.join(root, 'themes', `${team.slug}-color-theme.json`)));
    assert.ok(fs.existsSync(path.join(root, 'icons', team.slug, 'icon-theme.json')));
    assert.ok(p.background && fs.existsSync(path.join(root, 'icons', team.slug, p.background)), 'imagem de fundo não encontrada');
  });
}

test('toda seção do package.json tem página na extensão', () => {
  const ids = require('../package.json').contributes.views.explorer.map((v) => v.id);
  assert.deepEqual(ids, ['brasileirao.titulos']);
  const code = fs.readFileSync(path.join(root, 'extension', 'extension.js'), 'utf8');
  ids.forEach((id) => assert.ok(code.includes(`'${id}'`), `${id} sem página em extension.js`));
});

test('o package.json depende do Better Comments', () => {
  assert.deepEqual(require('../package.json').extensionDependencies, ['aaron-bond.better-comments']);
});

test('o package.json lista um tema de cores e um de ícones por time', () => {
  const pkg = require('../package.json');
  assert.equal(pkg.contributes.themes.length, teams.length);
  // Um tema de ícones por time, mais um por escudo antigo (a pasta também muda quando um retrô é escolhido).
  const retros = teams.flatMap((t) => [...palettes[`${PREFIX}: ${t.label}`].retro, ...palettes[`${PREFIX}: ${t.label}`].alternates]);
  assert.equal(pkg.contributes.iconThemes.length, teams.length + retros.length);
  for (const t of teams) {
    for (const r of [...palettes[`${PREFIX}: ${t.label}`].retro, ...palettes[`${PREFIX}: ${t.label}`].alternates]) {
      assert.equal(r.iconTheme, `${ID}-${t.slug}-${r.id}`);
      const registrado = pkg.contributes.iconThemes.find((i) => i.id === r.iconTheme);
      assert.ok(registrado, `${r.iconTheme} não está no package.json`);
      assert.ok(fs.existsSync(path.join(root, registrado.path)), `${registrado.path} não existe`);
      const tema = require(path.join(root, registrado.path));
      assert.match(tema.iconDefinitions[tema.folder].iconPath, new RegExp(`^\./escudo-${r.id}-[0-9a-f]{8}\.svg$`), `${r.iconTheme}: a pasta deve usar o escudo antigo (com hash no nome)`);
      assert.ok(fs.existsSync(path.join(root, path.dirname(registrado.path), tema.iconDefinitions[tema.folder].iconPath)), `${r.iconTheme}: o ícone da pasta não existe`);
    }
  }
  for (const t of pkg.contributes.themes) assert.ok(fs.existsSync(path.join(root, t.path)), `${t.path} não existe`);
});

test('escudos antigos: lista válida, só de times existentes, e os arquivos da paleta foram copiados', () => {
  const lista = require('../src/escudos-retro.json');
  const slugs = new Set(teams.map((t) => t.slug));
  for (const [slug, entries] of Object.entries(lista)) {
    if (slug.startsWith('_')) continue;
    assert.ok(slugs.has(slug), `${slug} não é um time`);
    assert.ok(entries.length >= 1 && entries.length <= 6, `${slug}: quantidade de escudos fora do esperado`);
    assert.equal(new Set(entries.map((e) => e.id)).size, entries.length, `${slug}: id repetido`);
    for (const e of entries) {
      assert.match(e.id, /^[a-z0-9-]+$/, `${slug}: id inválido ${e.id}`);
      assert.ok(e.label && e.label.length <= 40, `${slug}/${e.id}: legenda vazia ou longa`);
      // Cada escudo vem da Commons ('commons') ou de um arquivo fornecido pelo dono do projeto ('local', em _originais/).
      assert.match(e.commons || e.local || e.copiarDe || '', /\.(svg|png|jpe?g)$/i, `${slug}/${e.id}: falta o arquivo (commons ou local)`);
    }
  }
  for (const team of teams) {
    for (const r of [...palettes[`${PREFIX}: ${team.label}`].retro, ...palettes[`${PREFIX}: ${team.label}`].alternates]) {
      assert.ok(fs.existsSync(path.join(root, 'icons', team.slug, r.file)), `${team.slug}/${r.file} está na paleta mas não foi copiado`);
      assert.ok((lista[team.slug] || []).some((e) => e.id === r.id), `${team.slug}/${r.id} não está na lista`);
    }
  }
});

test('o comando de escolher escudo está no package.json e na extensão', () => {
  const cmds = require('../package.json').contributes.commands.map((c) => c.command);
  assert.ok(cmds.includes('brasileirao.escolherEscudo'));
  assert.ok(fs.readFileSync(path.join(root, 'extension', 'extension.js'), 'utf8').includes("registerCommand('brasileirao.escolherEscudo'"));
});

test('o seletor de times abre a lista com todas as opções de escudo, sem alternador de modo, e a barra de status tem o botão Escudos', () => {
  const code = fs.readFileSync(path.join(root, 'extension', 'extension.js'), 'utf8');
  for (const trecho of ['optionsLabel', 'pickRetro(context, palette, chosen.team)', "'$(shield) Escudos'", "'$(organization) Times'"]) assert.ok(code.includes(trecho), `falta ${trecho} em extension.js`);
  for (const sobra of ['isToggle', 'picker.retro', 'Mostrar escudos retrô']) assert.ok(!code.includes(sobra), `${sobra} não deve mais existir`);
});

test('o .vscodeignore deixa de fora só o que é de desenvolvimento e mantém escudos, fundos, retrô e troféus no pacote', () => {
  const linhas = fs.readFileSync(path.join(root, '.vscodeignore'), 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const fora of ['src/**', 'assets/**', 'tests/**', '.gitignore', '*.py', '__pycache__/**', '**/*.pyc', '*.vsix', 'images/screenshots/**']) {
    assert.ok(linhas.includes(fora), `${fora} deveria estar no .vscodeignore`);
  }
  // O que o pacote precisa levar não pode ser excluído por nenhuma regra.
  for (const dentro of ['icons', 'icons/_material', 'images/trofeus', 'themes', 'extension']) {
    assert.ok(!linhas.some((l) => l === dentro || l === `${dentro}/**` || l === `${dentro}/`), `${dentro} não pode estar no .vscodeignore`);
  }
});

test('a seção Títulos mostra só as competições em que o time tem título (e a taça do Mundial existe)', () => {
  assert.ok(fs.existsSync(path.join(root, 'images', 'trofeus', 'mundial.png')), 'falta images/trofeus/mundial.png');
  const Module = require('module');
  const stub = { ConfigurationTarget: { Global: 1 }, extensions: {}, workspace: {}, window: {}, commands: {} };
  const original = Module._load;
  Module._load = function (request, ...rest) { return request === 'vscode' ? stub : original.call(this, request, ...rest); };
  try {
    const file = path.join(root, 'extension', 'extension.js');
    const m = new Module(file, null);
    m.filename = file;
    m.paths = Module._nodeModulePaths(path.dirname(file));
    m._compile(`${fs.readFileSync(file, 'utf8')}\nmodule.exports.titlesHtml = titlesHtml;`, file);
    const itens = (team) => [...m.exports.titlesHtml(palettes[`${PREFIX}: ${team}`]).matchAll(/<div class="name">([^<]+)<\/div>/g)].map((x) => x[1]);
    assert.deepEqual(itens('Amazonas'), ['Série C'], 'só a Série C, sem troféus zerados');
    assert.deepEqual(itens('Remo'), ['Série C']);
    assert.deepEqual(itens('Flamengo'), ['Copa do Brasil', 'Libertadores', 'Mundial', 'Brasileirão'], 'o Mundial fica logo à direita da Libertadores');
    assert.deepEqual(itens('São Paulo'), ['Copa do Brasil', 'Libertadores', 'Mundial', 'Brasileirão', 'Sul-Americana']);
    // Com 5 competições o Mundial (o ápice) fica no centro.
    for (const time of ['São Paulo', 'Corinthians', 'Santos', 'Grêmio', 'Internacional']) assert.equal(itens(time)[2], 'Mundial', `${time}: Mundial deve ficar no centro`);
    // Todos os troféus têm a mesma altura: nenhum item recebe classe de tamanho especial, e a altura vem de uma variável única.
    for (const time of ['São Paulo', 'Flamengo', 'Palmeiras', 'Amazonas']) assert.ok(!/class="item big/.test(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`])), `${time}: nenhum troféu pode ser maior que os outros`);
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Flamengo`]).includes('var(--h)'), 'a altura dos troféus deve vir da variável única --h');
    // Copa do Nordeste: só os times do Nordeste a mostram (Ceará só tem ela).
    assert.deepEqual(itens('Ceará'), ['Copa do Nordeste']);
    assert.deepEqual(itens('Bahia'), ['Brasileirão', 'Copa do Nordeste']);
    assert.deepEqual(itens('Vitória'), ['Copa do Nordeste', 'Série B']);
    assert.deepEqual(itens('Sport'), ['Copa do Brasil', 'Brasileirão', 'Copa do Nordeste', 'Série B']);
    assert.ok(!itens('Goiás').includes('Copa do Nordeste') && !itens('Remo').includes('Copa do Nordeste'), 'times de fora do Nordeste não mostram a Copa do Nordeste');
    // Time sem títulos nas competições acompanhadas não mostra item nenhum.
    const semTitulos = { ...palettes[`${PREFIX}: Ceará`], titles: Object.fromEntries(Object.keys(palettes[`${PREFIX}: Ceará`].titles).map((k) => [k, []])) };
    assert.deepEqual([...m.exports.titlesHtml(semTitulos).matchAll(/<div class="name">([^<]+)<\/div>/g)], []);
    assert.ok(m.exports.titlesHtml(semTitulos).includes('Ainda sem títulos'));
    // 4 ou 5 competições ficam numa linha só; 1 a 3 mantêm o tamanho normal, centralizadas.
    const linha = (team) => m.exports.titlesHtml(palettes[`${PREFIX}: ${team}`]).includes('class="row inline"');
    assert.equal(linha('Flamengo'), true, 'Flamengo (4 competições) deve ficar numa linha só');
    assert.equal(linha('São Paulo'), true, 'São Paulo (5 competições) deve ficar numa linha só');
    assert.equal(linha('Amazonas'), false, 'um item só não precisa de linha única');
    assert.equal(linha('Botafogo'), false, 'três itens ou menos usam o tamanho normal');
  } finally {
    Module._load = original;
  }
});

const GRANDES = ['flamengo', 'fluminense', 'vasco', 'botafogo', 'palmeiras', 'santos', 'sao-paulo', 'corinthians', 'cruzeiro', 'atletico-mg', 'gremio', 'internacional'];

test('os 12 grandes não mostram títulos de Série B, C nem D (decisão do usuário), mas os times novos mostram', () => {
  for (const team of teams.filter((x) => GRANDES.includes(x.slug))) {
    for (const key of ['serieB', 'serieC', 'serieD']) assert.deepEqual(team.titles[key], [], `${team.slug}: ${key} deve ficar vazio nos 12 grandes`);
  }
  assert.equal(teams.filter((x) => GRANDES.includes(x.slug)).length, 12);
  assert.ok(teams.filter((x) => !GRANDES.includes(x.slug)).some((t) => t.titles.serieB.length || t.titles.serieC.length), 'os times novos ainda têm Série B/C');
});

test('toda competição da seção Títulos tem a sua foto de troféu em images/trofeus', () => {
  const codigo = fs.readFileSync(path.join(root, 'extension', 'extension.js'), 'utf8');
  const arquivos = [...codigo.slice(codigo.indexOf('const COMPETITIONS'), codigo.indexOf('];', codigo.indexOf('const COMPETITIONS'))).matchAll(/file: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(arquivos.length, 9, 'são 9 competições, cada uma com foto');
  for (const f of arquivos) assert.ok(fs.existsSync(path.join(root, 'images', 'trofeus', f)), `falta images/trofeus/${f}`);
});

test('todo escudo de fundo tem a mesma altura (só uma imagem absurdamente larga é limitada pela largura)', () => {
  const Module = require('module');
  const stub = { ConfigurationTarget: { Global: 1 }, extensions: {}, workspace: {}, window: {}, commands: {} };
  const original = Module._load;
  Module._load = function (request, ...rest) { return request === 'vscode' ? stub : original.call(this, request, ...rest); };
  try {
    const file = path.join(root, 'extension', 'extension.js');
    const m = new Module(file, null);
    m.filename = file;
    m.paths = Module._nodeModulePaths(path.dirname(file));
    m._compile(`${fs.readFileSync(file, 'utf8')}\nmodule.exports.crestSize = crestSize;`, file);
    assert.equal(m.exports.crestSize(0.8), 'auto 80vh');
    assert.equal(m.exports.crestSize(1.04), 'auto 80vh', 'o fundo do Flamengo (1,04), já aprovado, não muda');
    assert.equal(m.exports.crestSize(1.37), 'auto 80vh', 'o monograma largo do Flamengo retrô tem a mesma altura dos demais');
    assert.equal(m.exports.crestSize(1.8), '120vh auto', 'uma imagem absurdamente larga é limitada pela largura');
    assert.equal(m.exports.crestSize(null), 'auto 80vh', 'sem proporção conhecida, vale o padrão');
  } finally {
    Module._load = original;
  }
  // Toda imagem de fundo (atual ou retrô) tem a proporção registrada na paleta.
  for (const team of teams) {
    const p = palettes[`${PREFIX}: ${team.label}`];
    assert.ok(typeof p.backgroundAspect === 'number' && p.backgroundAspect > 0.3 && p.backgroundAspect < 3, `${team.slug}: backgroundAspect inválida`);
    for (const r of p.retro) assert.ok(typeof r.aspect === 'number' && r.aspect > 0.3 && r.aspect < 3, `${team.slug}/${r.id}: aspect inválida`);
  }
});

test('todo escudo antigo tem como rótulo só a data de uso', () => {
  const retro = JSON.parse(fs.readFileSync(path.join(root, 'src', 'escudos-retro.json'), 'utf8'));
  for (const [slug, lista] of Object.entries(retro)) {
    if (!Array.isArray(lista)) continue;
    for (const r of lista) assert.match(r.label, r.atual ? /^Completo( \(desde \d{4}\))?$/ : /^\d{4}(–\d{4})?(\/\d{4}(–\d{4})?)?$/, `${slug}/${r.id}: "${r.label}" deve ser só a data de uso (dois períodos separados por /)`);
  }
});

test('todo time tem o nome do escudo atual, com "desde" só quando a data é firme', () => {
  for (const t of teams) assert.match(t.crestLabel || '', /^[^()]+( \(desde [^()]+\))?$/, `${t.slug}: crestLabel deve ser Nome ou Nome (desde Ano)`);
});

test('o Fluminense tem um só escudo atual (o completo, desde 2002) e três retrôs com período', () => {
  const p = palettes[`${PREFIX}: Fluminense`];
  assert.equal(p.crestLabel, 'Atual · desde 2002');
  assert.deepEqual(p.alternates, []);
  assert.deepEqual(p.retro.map((r) => r.label), ['1902–1905', '1905–1906', '2011–2012']);
});

test('os escudos antigos de todo time estão em ordem cronológica no seletor', () => {
  for (const team of teams) {
    const anos = (palettes[`${PREFIX}: ${team.label}`].retro || []).map((r) => Number(r.label.match(/\d{4}/)[0]));
    assert.deepEqual(anos, [...anos].sort((a, b) => a - b), `${team.slug}: retrôs fora de ordem (${anos.join(', ')})`);
  }
});

test('os times estão agrupados por estado e, em cada estado, em ordem de Libertadores e, no empate, de Brasileirão', () => {
  const uf = (x) => x.uf;
  const vistos = [];
  teams.forEach((x, i) => {
    if (i > 0 && uf(teams[i - 1]) === uf(x)) return;
    assert.ok(!vistos.includes(uf(x)), `${x.slug}: o estado ${uf(x)} aparece em dois blocos separados`);
    vistos.push(uf(x));
  });
  for (let i = 1; i < teams.length; i++) {
    const a = teams[i - 1];
    const b = teams[i];
    if (uf(a) !== uf(b)) continue;
    const [la, ba] = [a.titles.libertadores.length, a.titles.brasileirao.length];
    const [lb, bb] = [b.titles.libertadores.length, b.titles.brasileirao.length];
    assert.ok(la > lb || (la === lb && ba >= bb), `${a.slug} deveria vir depois de ${b.slug}`);
  }
  assert.deepEqual(teams.map((x) => x.slug), ['flamengo', 'fluminense', 'vasco', 'botafogo', 'palmeiras', 'santos', 'sao-paulo', 'corinthians', 'guarani', 'bragantino', 'mirassol', 'cruzeiro', 'atletico-mg',
    'gremio', 'internacional', 'bahia', 'vitoria', 'fortaleza', 'ceara', 'athletico-pr', 'coritiba', 'sport', 'remo', 'paysandu', 'amazonas', 'goias', 'chapecoense']);
});
