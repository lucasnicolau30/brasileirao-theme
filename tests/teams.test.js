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
  chapecoense: [0, 0, 0],
  criciuma: [0, 1, 0],
  juventude: [0, 1, 0],
  parana: [0, 0, 0],
  'santo-andre': [0, 1, 0],
  'santa-cruz': [0, 0, 0],
  'sampaio-correa': [0, 0, 0],
  portuguesa: [0, 0, 0],
  'ponte-preta': [0, 0, 0],
  'america-mg': [0, 0, 0],
  nautico: [0, 0, 0],
  'atletico-go': [0, 0, 0],
  'vila-nova': [0, 0, 0],
  cuiaba: [0, 0, 0],
  brasiliense: [0, 0, 0],
  gama: [0, 0, 0],
  abc: [0, 0, 0],
  'america-rn': [0, 0, 0],
  'botafogo-pb': [0, 0, 0],
  'nacional-am': [0, 0, 0],
  bangu: [0, 0, 0],
  ituano: [0, 0, 0],
  'volta-redonda': [0, 0, 0],
  avai: [0, 0, 0]
};
const FIRST_YEAR = { estadual: 1900, brasileirao: 1937, copaDoBrasil: 1989, libertadores: 1960, mundial: 1960, sulAmericana: 2002, serieB: 1971, serieC: 1981, serieD: 2009, copaDoNordeste: 1994, copaVerde: 2014 };
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
  chapecoense: [0, 1, 1, 0, 0],
  criciuma: [0, 0, 1, 1, 0],
  juventude: [0, 0, 1, 0, 0],
  // Paraná: o segundo título de Série B (2000) é a Copa João Havelange (Módulo Amarelo), que o clube conta como Série B e a CBF não reconhece; entra por decisão do dono do projeto.
  parana: [0, 0, 2, 0, 0],
  'santo-andre': [0, 0, 0, 0, 0],
  'santa-cruz': [0, 0, 0, 1, 0],
  'sampaio-correa': [0, 0, 1, 1, 1],
  portuguesa: [0, 0, 1, 0, 0],
  'ponte-preta': [0, 0, 0, 1, 0],
  'america-mg': [0, 0, 2, 1, 0],
  nautico: [0, 0, 0, 1, 0],
  'atletico-go': [0, 0, 1, 2, 0],
  'vila-nova': [0, 0, 0, 3, 0],
  cuiaba: [0, 0, 0, 0, 0],
  brasiliense: [0, 0, 1, 1, 0],
  gama: [0, 0, 1, 0, 0],
  abc: [0, 0, 0, 1, 0],
  'america-rn': [0, 0, 0, 0, 1],
  'botafogo-pb': [0, 0, 0, 0, 1],
  'nacional-am': [0, 0, 0, 0, 0],
  bangu: [0, 0, 0, 0, 0],
  ituano: [0, 0, 0, 2, 0],
  'volta-redonda': [0, 0, 0, 1, 1],
  avai: [0, 0, 0, 1, 0]
};
const LAST_YEAR = 2025; // última temporada incluída
const LAST_YEAR_NORDESTE = 2026; // a Copa do Nordeste de 2026 já foi decidida (Vitória)
const LAST_YEAR_VERDE = 2026; // a Copa Verde de 2026 já foi decidida (Paysandu)
const LAST_YEAR_ESTADUAL = 2026; // os estaduais de 2026 já foram decididos
// Copa do Nordeste (só times do Nordeste), conferida à mão na Wikipédia: número de títulos por time.
// Copa Verde (só times do Norte e do Centro-Oeste), conferida à mão na Wikipédia: número de títulos por time.
const EXPECTED_VERDE = { paysandu: 6, remo: 1, goias: 1, cuiaba: 2, brasiliense: 1 };
const EXPECTED_NORDESTE = { bahia: 5, vitoria: 5, ceara: 3, fortaleza: 3, sport: 3, 'santa-cruz': 1, 'sampaio-correa': 1, 'america-rn': 1 };
// Ano repetido na mesma lista só quando houve dois títulos no mesmo ano.
// Estaduais (tabela de títulos de cada campeonato estadual, ou a lista de campeões onde não há tabela; o América-RN tem 40 no artigo mas só 38 anos
// listados, então valem os 38). Só os times menores têm: os 12 grandes ficam com [].
const EXPECTED_ESTADUAL = { bragantino: 1, portuguesa: 3, 'america-mg': 16, juventude: 1, bahia: 52, vitoria: 30, fortaleza: 47, ceara: 47, 'athletico-pr': 28, coritiba: 39, parana: 7, sport: 46, 'santa-cruz': 29, nautico: 24, paysandu: 51, remo: 48, amazonas: 2, goias: 29, 'atletico-go': 18, 'vila-nova': 16, criciuma: 12, chapecoense: 7, 'sampaio-correa': 37, cuiaba: 13, brasiliense: 11, gama: 15, abc: 56, 'america-rn': 38, 'botafogo-pb': 31, 'nacional-am': 44, bangu: 2, ituano: 2, avai: 19 };
const ALLOWED_DUPLICATES = { palmeiras: { brasileirao: [1967] } };
const HEX = /^#[0-9a-f]{6}$/i;

test('há 50 times, com slug e rótulo únicos', () => {
  assert.equal(teams.length, 50);
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
    assert.deepEqual(Object.keys(team.titles).sort(), ['brasileirao', 'copaDoBrasil', 'copaDoNordeste', 'copaVerde', 'estadual', 'libertadores', 'mundial', 'serieB', 'serieC', 'serieD', 'sulAmericana']);
    for (const [key, years] of Object.entries(team.titles)) {
      assert.ok(Array.isArray(years), `${key} deve ser uma lista de anos`);
      years.forEach((y) => {
        assert.ok(Number.isInteger(y), `${key}: ${y} não é inteiro`);
        const ultimo = key === 'copaDoNordeste' ? LAST_YEAR_NORDESTE : key === 'copaVerde' ? LAST_YEAR_VERDE : key === 'estadual' ? LAST_YEAR_ESTADUAL : LAST_YEAR;
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
    assert.equal(t.copaVerde.length, EXPECTED_VERDE[team.slug] ?? 0, 'Copa Verde');
    assert.equal(t.estadual.length, EXPECTED_ESTADUAL[team.slug] ?? 0, 'estadual');
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
    assert.deepEqual(itens('Amazonas'), ['Série C', 'Estadual'], 'só o que o time ganhou, sem troféus zerados');
    assert.deepEqual(itens('Flamengo'), ['Copa do Brasil', 'Libertadores', 'Mundial', 'Brasileirão'], 'o Mundial fica logo à direita da Libertadores');
    assert.deepEqual(itens('São Paulo'), ['Copa do Brasil', 'Libertadores', 'Mundial', 'Brasileirão', 'Sul-Americana']);
    // Com 5 competições o Mundial (o ápice) fica no centro.
    for (const time of ['São Paulo', 'Corinthians', 'Santos', 'Grêmio', 'Internacional']) assert.equal(itens(time)[2], 'Mundial', `${time}: Mundial deve ficar no centro`);
    // Criciúma: a Copa do Brasil fica no centro (titleCenter em teams.js); os outros times mantêm a ordem padrão. O Estadual vai sempre por último, fora da conta do centro.
    assert.deepEqual(itens('Criciúma'), ['Série B', 'Copa do Brasil', 'Série C', 'Estadual']);
    assert.deepEqual(itens('Bragantino'), ['Série C', 'Série B', 'Estadual'], 'Bragantino: a Série B fica no centro (titleOrder em teams.js)');
    // Sampaio Corrêa: a ordem vem de titleOrder em teams.js (Série C, Série B, Copa do Nordeste, Série D), não da lista padrão.
    assert.deepEqual(itens('Sampaio Corrêa'), ['Série C', 'Série B', 'Copa do Nordeste', 'Série D']);
    // Todos os troféus têm a mesma altura: nenhum item recebe classe de tamanho especial, e a altura vem de uma variável única.
    for (const time of ['São Paulo', 'Flamengo', 'Palmeiras', 'Amazonas']) assert.ok(!/class="item big/.test(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`])), `${time}: nenhum troféu pode ser maior que os outros`);
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Flamengo`]).includes('var(--h)'), 'a altura dos troféus deve vir da variável única --h');
    // Copa do Nordeste: só os times do Nordeste a mostram (Ceará só tem ela).
    assert.deepEqual(itens('Ceará'), ['Copa do Nordeste']);
    assert.deepEqual(itens('Bahia'), ['Brasileirão', 'Copa do Nordeste']);
    assert.deepEqual(itens('Vitória'), ['Copa do Nordeste', 'Série B']);
    assert.deepEqual(itens('Sport'), ['Copa do Brasil', 'Brasileirão', 'Copa do Nordeste', 'Série B']);
    // Copa Verde: Paysandu, Remo, Goiás, Cuiabá e Brasiliense a mostram, logo depois da Copa do Nordeste na ordem padrão.
    assert.deepEqual(itens('Goiás'), ['Copa Verde', 'Série B']);
    assert.deepEqual(itens('Cuiabá'), ['Copa Verde']);
    assert.deepEqual(itens('Brasiliense'), ['Copa Verde', 'Série B', 'Série C']);
    assert.deepEqual(itens('Gama'), ['Série B']);
    assert.deepEqual(itens('ABC'), ['Série C']);
    assert.deepEqual(itens('América-RN'), ['Copa do Nordeste', 'Série D']);
    assert.deepEqual(itens('Botafogo-PB'), ['Série D']);
    assert.deepEqual(itens('Nacional-AM'), ['Estadual']);
    // O Estadual usa o troféu do estado (estadual-<uf>.png: o Amazonense nos times do Amazonas); estado sem a foto não mostra o Estadual (Remo, do Pará).
    const b64 = (f) => fs.readFileSync(path.join(root, 'images', 'trofeus', f)).toString('base64');
    for (const time of ['Nacional-AM', 'Amazonas']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-am.png')), `${time}: deve usar o troféu do Amazonense`);
    // Bangu, o único time menor do Rio: o Estadual dele usa a taça do Carioca (estadual-rj.png).
    assert.deepEqual(itens('Bangu'), ['Estadual']);
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Bangu`]).includes(b64('estadual-rj.png')), 'Bangu: deve usar o troféu do Carioca');
    // Times menores de São Paulo (Bragantino, Portuguesa): taça do Paulista; os 4 sem título paulista (Guarani, Santo André, Mirassol, Ponte Preta) não mostram o Estadual.
    assert.deepEqual(itens('Ituano'), ['Série C', 'Estadual']);
    // Times menores de Santa Catarina (Criciúma, Chapecoense e Avaí): taça do Catarinense.
    assert.deepEqual(itens('Avaí'), ['Série C', 'Estadual']);
    assert.deepEqual(itens('Chapecoense'), ['Série B', 'Sul-Americana', 'Estadual'], 'Chapecoense: a Sul-Americana fica no centro (titleOrder em teams.js)');
    for (const time of ['Criciúma', 'Chapecoense', 'Avaí']) assert.ok(itens(time).includes('Estadual') && m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-sc.png')), `${time}: deve usar o troféu do Catarinense`);
    assert.deepEqual(itens('Volta Redonda'), ['Série C', 'Série D'], 'Volta Redonda: só Séries C e D (sem título carioca, então sem Estadual)');
    for (const time of ['Bragantino', 'Portuguesa', 'Ituano']) assert.ok(itens(time).includes('Estadual') && m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-sp.png')), `${time}: deve usar o troféu do Paulista`);
    for (const time of ['Guarani', 'Santo André', 'Mirassol', 'Ponte Preta', 'Palmeiras']) assert.ok(!itens(time).includes('Estadual'), `${time}: sem Estadual`);
    assert.ok(!itens('Remo').includes('Estadual') && !itens('Sport').includes('Estadual'), 'estado sem a foto do troféu não mostra o Estadual');
    // Os 12 grandes não mostram o Estadual (só os times menores).
    for (const time of ['Flamengo', 'São Paulo', 'Cruzeiro']) assert.ok(!itens(time).includes('Estadual'), `${time}: grande não mostra o Estadual`);
    assert.deepEqual(itens('Remo'), ['Copa Verde', 'Série C']);
    assert.ok(itens('Paysandu').includes('Copa Verde') && !itens('Sport').includes('Copa Verde'), 'só quem venceu a Copa Verde mostra o troféu');
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
    for (const key of ['serieB', 'serieC', 'serieD', 'estadual']) assert.deepEqual(team.titles[key], [], `${team.slug}: ${key} deve ficar vazio nos 12 grandes`);
  }
  assert.equal(teams.filter((x) => GRANDES.includes(x.slug)).length, 12);
  assert.ok(teams.filter((x) => !GRANDES.includes(x.slug)).some((t) => t.titles.serieB.length || t.titles.serieC.length), 'os times novos ainda têm Série B/C');
});

test('toda competição da seção Títulos tem a sua foto de troféu em images/trofeus', () => {
  const codigo = fs.readFileSync(path.join(root, 'extension', 'extension.js'), 'utf8');
  const arquivos = [...codigo.slice(codigo.indexOf('const COMPETITIONS'), codigo.indexOf('];', codigo.indexOf('const COMPETITIONS'))).matchAll(/file: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(arquivos.length, 10, 'são 10 competições com foto própria (o Estadual tem uma por estado: estadual-<uf>.png)');
  for (const uf of ['am', 'rj', 'sp', 'sc']) assert.ok(fs.existsSync(path.join(root, 'images', 'trofeus', `estadual-${uf}.png`)), `falta images/trofeus/estadual-${uf}.png`);
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
    assert.equal(m.exports.crestSize(1.596), 'auto 80vh', 'o escudo do Criciúma (1,596) tem a mesma altura dos demais');
    assert.equal(m.exports.crestSize(1.8), '128vh auto', 'uma imagem absurdamente larga é limitada pela largura');
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

test('todo escudo antigo tem como rótulo a data de uso, com o nome antes só quando o escudo é de outro clube (Colorado e Pinheiros, do Paraná)', () => {
  const retro = JSON.parse(fs.readFileSync(path.join(root, 'src', 'escudos-retro.json'), 'utf8'));
  for (const [slug, lista] of Object.entries(retro)) {
    if (!Array.isArray(lista)) continue;
    for (const r of lista) assert.match(r.label, r.atual ? /^Completo( \(desde \d{4}\))?$/ : /^([^\d·]+ · )?\d{4}(–\d{4})?(\/\d{4}(–\d{4})?)?$/, `${slug}/${r.id}: "${r.label}" deve ser a data de uso (dois períodos separados por /), com o nome do clube e " · " antes ("Colorado · 1971–1989") só para escudo de outro clube`);
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

test('os times estão agrupados por estado e, em cada estado, em ordem de títulos (Libertadores, Brasileirão, Copa do Brasil, Sul-Americana, Séries B, C e D)', () => {
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
    // Mais títulos primeiro, comparando nesta ordem; só se tudo empata vale a ordem do arquivo (Série B vale mais que a C, que vale mais que a D).
    const criterios = ['libertadores', 'brasileirao', 'copaDoBrasil', 'sulAmericana', 'serieB', 'serieC', 'serieD'];
    const dif = criterios.map((k) => a.titles[k].length - b.titles[k].length).find((d) => d !== 0) || 0;
    assert.ok(dif >= 0, `${b.slug} (mais títulos) deveria vir antes de ${a.slug}`);
  }
  assert.deepEqual(teams.map((x) => x.slug), ['flamengo', 'fluminense', 'vasco', 'botafogo', 'volta-redonda', 'bangu', 'palmeiras', 'santos', 'sao-paulo', 'corinthians', 'guarani', 'santo-andre', 'bragantino', 'portuguesa', 'ituano', 'mirassol', 'ponte-preta', 'cruzeiro', 'atletico-mg', 'america-mg', 'gremio', 'internacional',
    'juventude', 'bahia', 'vitoria', 'fortaleza', 'ceara', 'athletico-pr', 'coritiba', 'parana', 'sport', 'santa-cruz', 'nautico', 'paysandu', 'remo', 'amazonas', 'nacional-am', 'goias', 'atletico-go', 'vila-nova', 'criciuma', 'chapecoense', 'avai', 'sampaio-correa', 'cuiaba', 'brasiliense', 'gama', 'abc', 'america-rn', 'botafogo-pb']);
});
