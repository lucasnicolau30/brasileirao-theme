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
  internacional: [3, 1, 2]
};
const FIRST_YEAR = { brasileirao: 1937, copaDoBrasil: 1989, libertadores: 1960 };
const LAST_YEAR = 2025; // última temporada incluída
// Ano repetido na mesma lista só quando houve dois títulos no mesmo ano.
const ALLOWED_DUPLICATES = { palmeiras: { brasileirao: [1967] } };
const HEX = /^#[0-9a-f]{6}$/i;

test('há 12 times, com slug e rótulo únicos', () => {
  assert.equal(teams.length, 12);
  assert.equal(new Set(teams.map((t) => t.slug)).size, teams.length);
  assert.equal(new Set(teams.map((t) => t.label)).size, teams.length);
});

for (const team of teams) {
  test(`${team.slug}: campos obrigatórios e cores válidas`, () => {
    for (const key of ['bg', 'primary', 'accent', 'statusBg', 'statusFg', 'fg']) assert.match(team[key], HEX, `${key} inválida`);
    assert.equal(team.brackets.length, 6);
    team.brackets.forEach((c) => assert.match(c, HEX));
    assert.ok(team.swatch && team.swatch.length > 0, 'falta o swatch (quadradinhos de cor)');
  });

  test(`${team.slug}: títulos (anos em ordem, no intervalo certo, sem repetição indevida)`, () => {
    assert.deepEqual(Object.keys(team.titles).sort(), ['brasileirao', 'copaDoBrasil', 'libertadores']);
    for (const [key, years] of Object.entries(team.titles)) {
      assert.ok(Array.isArray(years), `${key} deve ser uma lista de anos`);
      years.forEach((y) => {
        assert.ok(Number.isInteger(y), `${key}: ${y} não é inteiro`);
        assert.ok(y >= FIRST_YEAR[key] && y <= LAST_YEAR, `${key}: ${y} fora de ${FIRST_YEAR[key]}-${LAST_YEAR}`);
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
  });

  test(`${team.slug}: o escudo de fundo existe e, se tem cor própria, ela aparece sobre o fundo`, () => {
    const crest = ['svg', 'png'].map((e) => path.join(root, 'assets', 'escudos', `${team.slug}.${e}`)).find(fs.existsSync);
    assert.ok(crest, 'falta assets/escudos/<slug>.svg ou .png');
    if (team.bgColor) {
      assert.match(team.bgColor, HEX);
      const own = path.join(root, 'assets', 'escudos', 'fundo', `${team.slug}.svg`);
      assert.ok(fs.existsSync(own), 'bgColor só vale para um SVG de uma cor em assets/escudos/fundo/');
      assert.ok(contrast(team.bgColor, team.bg) >= 4.5, 'a cor do escudo some sobre o fundo do editor');
    }
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

test('o package.json lista um tema de cores e um de ícones por time', () => {
  const pkg = require('../package.json');
  assert.equal(pkg.contributes.themes.length, teams.length);
  assert.equal(pkg.contributes.iconThemes.length, teams.length);
  for (const t of pkg.contributes.themes) assert.ok(fs.existsSync(path.join(root, t.path)), `${t.path} não existe`);
});
