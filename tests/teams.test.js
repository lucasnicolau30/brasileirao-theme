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
  paulista: [0, 1, 0],
  'santa-cruz': [0, 0, 0],
  'sampaio-correa': [0, 0, 0],
  'moto-club': [0, 0, 0],
  'maranhao-ac': [0, 0, 0],
  portuguesa: [0, 0, 0],
  'ponte-preta': [0, 0, 0],
  'america-mg': [0, 0, 0],
  uberlandia: [0, 0, 0],
  'villa-nova': [0, 0, 0],
  oeste: [0, 0, 0],
  'botafogo-sp': [0, 0, 0],
  'juventus-sp': [0, 0, 0],
  'inter-de-limeira': [0, 0, 0],
  londrina: [0, 0, 0],
  joinville: [0, 0, 0],
  mixto: [0, 0, 0],
  treze: [0, 0, 0],
  'uniao-sao-joao': [0, 0, 0],
  novorizontino: [0, 0, 0],
  'xv-de-piracicaba': [0, 0, 0],
  'uniao-barbarense': [0, 0, 0],
  'tuna-luso': [0, 0, 0],
  'sao-raimundo-pa': [0, 0, 0],
  'boa-esporte': [0, 0, 0],
  'operario-pr': [0, 0, 0],
  maringa: [0, 0, 0],
  'guarany-de-sobral': [0, 0, 0],
  'ferroviario-ce': [0, 0, 0],
  brusque: [0, 0, 0],
  aparecidense: [0, 0, 0],
  'retro-pe': [0, 0, 0],
  'barra-sc': [0, 0, 0],
  tombense: [0, 0, 0],
  tupi: [0, 0, 0],
  nautico: [0, 0, 0],
  'atletico-go': [0, 0, 0],
  'vila-nova': [0, 0, 0],
  cuiaba: [0, 0, 0],
  luverdense: [0, 0, 0],
  brasiliense: [0, 0, 0],
  gama: [0, 0, 0],
  abc: [0, 0, 0],
  'america-rn': [0, 0, 0],
  'botafogo-pb': [0, 0, 0],
  campinense: [0, 0, 0],
  crb: [0, 0, 0],
  csa: [0, 0, 0],
  'operario-ms': [0, 0, 0],
  'comercial-ms': [0, 0, 0],
  'nacional-am': [0, 0, 0],
  'rio-negro-am': [0, 0, 0],
  'sao-raimundo-am': [0, 0, 0],
  manaus: [0, 0, 0],
  bangu: [0, 0, 0],
  olaria: [0, 0, 0],
  macae: [0, 0, 0],
  'america-rj': [0, 0, 0],
  'campo-grande': [0, 0, 0],
  ituano: [0, 0, 0],
  'volta-redonda': [0, 0, 0],
  avai: [0, 0, 0],
  figueirense: [0, 0, 0],
  brasilia: [0, 0, 0],
  'rio-branco-ac': [0, 0, 0],
  'atletico-ac': [0, 0, 0],
  'independencia': [0, 0, 0],
  'juventus-ac': [0, 0, 0],
  'asa': [0, 0, 0],
  'macapa': [0, 0, 0],
  'trem': [0, 0, 0],
  'ypiranga-ap': [0, 0, 0],
  'santos-ap': [0, 0, 0],
  'rio-branco-es': [0, 0, 0],
  'desportiva': [0, 0, 0],
  'vitoria-es': [0, 0, 0],
  'serra': [0, 0, 0],
  'parnahyba': [0, 0, 0],
  'piaui': [0, 0, 0],
  'altos': [0, 0, 0],
  'ji-parana': [0, 0, 0],
  'vilhena': [0, 0, 0],
  'porto-velho': [0, 0, 0],
  'bare': [0, 0, 0],
  'sao-raimundo-rr': [0, 0, 0],
  'gas': [0, 0, 0],
  'sergipe': [0, 0, 0],
  'confianca': [0, 0, 0],
  'itabaiana': [0, 0, 0],
  'palmas': [0, 0, 0],
  'tocantinopolis': [0, 0, 0],
  'gurupi': [0, 0, 0],
  'flamengo-pi': [0, 0, 0],
  'botafogo-pi': [0, 0, 0],
  'ypiranga-ba': [0, 0, 0],
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
  paulista: [0, 0, 0, 1, 0],
  'santa-cruz': [0, 0, 0, 1, 0],
  'sampaio-correa': [0, 0, 1, 1, 1],
  'moto-club': [0, 0, 0, 0, 0],
  'maranhao-ac': [0, 0, 0, 0, 0],
  portuguesa: [0, 0, 1, 0, 0],
  'ponte-preta': [0, 0, 0, 1, 0],
  'america-mg': [0, 0, 2, 1, 0],
  uberlandia: [0, 0, 1, 0, 1],
  'villa-nova': [0, 0, 1, 0, 0],
  oeste: [0, 0, 0, 1, 0],
  'botafogo-sp': [0, 0, 0, 0, 1],
  'juventus-sp': [0, 0, 1, 0, 0],
  'inter-de-limeira': [0, 0, 1, 0, 0],
  londrina: [0, 0, 1, 0, 0],
  joinville: [0, 0, 1, 1, 0],
  mixto: [0, 0, 0, 0, 0],
  treze: [0, 0, 0, 0, 0],
  'uniao-sao-joao': [0, 0, 1, 1, 0],
  novorizontino: [0, 0, 1, 1, 0],
  'xv-de-piracicaba': [0, 0, 0, 1, 0],
  'uniao-barbarense': [0, 0, 0, 1, 0],
  'tuna-luso': [0, 0, 1, 1, 0],
  'sao-raimundo-pa': [0, 0, 0, 0, 1],
  'boa-esporte': [0, 0, 0, 1, 0],
  'operario-pr': [0, 0, 0, 1, 1],
  maringa: [0, 0, 0, 1, 0],
  'guarany-de-sobral': [0, 0, 0, 0, 1],
  'ferroviario-ce': [0, 0, 0, 0, 2],
  brusque: [0, 0, 0, 0, 1],
  aparecidense: [0, 0, 0, 0, 1],
  'retro-pe': [0, 0, 0, 0, 1],
  'barra-sc': [0, 0, 0, 0, 1],
  tombense: [0, 0, 0, 0, 1],
  tupi: [0, 0, 0, 0, 1],
  nautico: [0, 0, 0, 1, 0],
  'atletico-go': [0, 0, 1, 2, 0],
  'vila-nova': [0, 0, 0, 3, 0],
  cuiaba: [0, 0, 0, 0, 0],
  luverdense: [0, 0, 0, 0, 0],
  brasiliense: [0, 0, 1, 1, 0],
  gama: [0, 0, 1, 0, 0],
  abc: [0, 0, 0, 1, 0],
  'america-rn': [0, 0, 0, 0, 1],
  'botafogo-pb': [0, 0, 0, 0, 1],
  campinense: [0, 0, 0, 0, 0],
  crb: [0, 0, 0, 0, 0],
  csa: [0, 0, 0, 1, 0],
  'operario-ms': [0, 0, 1, 0, 0],
  'comercial-ms': [0, 0, 0, 0, 0],
  'nacional-am': [0, 0, 0, 0, 0],
  'rio-negro-am': [0, 0, 0, 0, 0],
  'sao-raimundo-am': [0, 0, 0, 0, 0],
  manaus: [0, 0, 0, 0, 0],
  bangu: [0, 0, 0, 0, 0],
  olaria: [0, 0, 0, 1, 0],
  macae: [0, 0, 0, 1, 0],
  'america-rj': [0, 0, 0, 0, 0],
  'campo-grande': [0, 0, 1, 0, 0],
  ituano: [0, 0, 0, 2, 0],
  'volta-redonda': [0, 0, 0, 1, 1],
  avai: [0, 0, 0, 1, 0],
  figueirense: [0, 0, 0, 0, 0],
  brasilia: [0, 0, 0, 0, 0],
  'rio-branco-ac': [0, 0, 0, 0, 0],
  'atletico-ac': [0, 0, 0, 0, 0],
  'independencia': [0, 0, 0, 0, 0],
  'juventus-ac': [0, 0, 0, 0, 0],
  'asa': [0, 0, 0, 0, 0],
  'macapa': [0, 0, 0, 0, 0],
  'trem': [0, 0, 0, 0, 0],
  'ypiranga-ap': [0, 0, 0, 0, 0],
  'santos-ap': [0, 0, 0, 0, 0],
  'rio-branco-es': [0, 0, 0, 0, 0],
  'desportiva': [0, 0, 0, 0, 0],
  'vitoria-es': [0, 0, 0, 0, 0],
  'serra': [0, 0, 0, 0, 0],
  'parnahyba': [0, 0, 0, 0, 0],
  'piaui': [0, 0, 0, 0, 0],
  'altos': [0, 0, 0, 0, 0],
  'ji-parana': [0, 0, 0, 0, 0],
  'vilhena': [0, 0, 0, 0, 0],
  'porto-velho': [0, 0, 0, 0, 0],
  'bare': [0, 0, 0, 0, 0],
  'sao-raimundo-rr': [0, 0, 0, 0, 0],
  'gas': [0, 0, 0, 0, 0],
  'sergipe': [0, 0, 0, 0, 0],
  'confianca': [0, 0, 0, 0, 0],
  'itabaiana': [0, 0, 0, 0, 0],
  'palmas': [0, 0, 0, 0, 0],
  'tocantinopolis': [0, 0, 0, 0, 0],
  'gurupi': [0, 0, 0, 0, 0],
  'flamengo-pi': [0, 0, 0, 0, 0],
  'botafogo-pi': [0, 0, 0, 0, 0],
  'ypiranga-ba': [0, 0, 0, 0, 0],
};
const LAST_YEAR = 2025; // última temporada incluída
const LAST_YEAR_NORDESTE = 2026; // a Copa do Nordeste de 2026 já foi decidida (Vitória)
const LAST_YEAR_VERDE = 2026; // a Copa Verde de 2026 já foi decidida (Paysandu)
const LAST_YEAR_ESTADUAL = 2026; // os estaduais de 2026 já foram decididos
const LAST_YEAR_SERIEB = 2026; // a Série B de 2026 já foi decidida (Novorizontino)
const LAST_YEAR_SERIEC = 2026; // a Série C de 2026 já foi decidida (Maringá)
const LAST_YEAR_SERIED = 2026; // a Série D de 2026 já foi decidida (Uberlândia)
// Copa do Nordeste (só times do Nordeste), conferida à mão na Wikipédia: número de títulos por time.
// Copa Verde (só times do Norte e do Centro-Oeste), conferida à mão na Wikipédia: número de títulos por time.
const EXPECTED_VERDE = { paysandu: 6, remo: 1, goias: 1, cuiaba: 2, luverdense: 1, brasiliense: 1, brasilia: 1 };
const EXPECTED_NORDESTE = { bahia: 5, vitoria: 5, ceara: 3, fortaleza: 3, sport: 3, 'santa-cruz': 1, 'sampaio-correa': 1, 'america-rn': 1, campinense: 1 };
// Ano repetido na mesma lista só quando houve dois títulos no mesmo ano.
// Estaduais (tabela de títulos de cada campeonato estadual, ou a lista de campeões onde não há tabela; o América-RN tem 40 no artigo mas só 38 anos
// listados, então valem os 38). Todos os times têm (inclusive os 12 grandes).
const EXPECTED_ESTADUAL = { bragantino: 1, portuguesa: 3, 'america-mg': 16, juventude: 1, bahia: 52, vitoria: 30, fortaleza: 47, ceara: 47, 'athletico-pr': 28, coritiba: 39, parana: 7, sport: 46, 'santa-cruz': 29, nautico: 24, paysandu: 51, remo: 48, amazonas: 2, goias: 29, 'atletico-go': 18, 'vila-nova': 16, criciuma: 12, chapecoense: 7, 'sampaio-correa': 37, 'moto-club': 26, 'maranhao-ac': 16, cuiaba: 13, luverdense: 3, brasiliense: 11, gama: 15, abc: 56, 'america-rn': 38, 'botafogo-pb': 31, 'nacional-am': 44, 'rio-negro-am': 16, 'sao-raimundo-am': 7, campinense: 22, 'america-rj': 7, crb: 45, csa: 40, manaus: 6, bangu: 2, ituano: 2, avai: 19, figueirense: 18, brasilia: 8, 'villa-nova': 5, 'juventus-sp': 1, 'inter-de-limeira': 1, londrina: 5, joinville: 12, mixto: 24, treze: 17, 'tuna-luso': 10, 'operario-pr': 3, 'ferroviario-ce': 9, brusque: 2, 'barra-sc': 1, 'operario-ms': 15, 'comercial-ms': 9, 'rio-branco-ac': 49, 'atletico-ac': 9, 'independencia': 13, 'juventus-ac': 14, 'asa': 7, 'macapa': 16, 'trem': 10, 'ypiranga-ap': 10, 'santos-ap': 8, 'rio-branco-es': 39, 'desportiva': 18, 'vitoria-es': 10, 'serra': 6, 'parnahyba': 13, 'piaui': 7, 'altos': 4, 'ji-parana': 9, 'vilhena': 5, 'porto-velho': 5, 'bare': 28, 'sao-raimundo-rr': 14, 'gas': 3, 'sergipe': 38, 'confianca': 24, 'itabaiana': 11, 'palmas': 8, 'tocantinopolis': 7, 'gurupi': 6, flamengo: 40, fluminense: 33, vasco: 24, botafogo: 21, corinthians: 31, palmeiras: 27, 'sao-paulo': 22, santos: 22, 'atletico-mg': 50, cruzeiro: 39, internacional: 46, gremio: 44, 'flamengo-pi': 17, 'botafogo-pi': 11, 'ypiranga-ba': 10 };
const ALLOWED_DUPLICATES = { palmeiras: { brasileirao: [1967] }, flamengo: { estadual: [1979] } };
const HEX = /^#[0-9a-f]{6}$/i;

test('há 126 times, com slug e rótulo únicos', () => {
  assert.equal(teams.length, 126);
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
        const ultimo = key === 'copaDoNordeste' ? LAST_YEAR_NORDESTE : key === 'copaVerde' ? LAST_YEAR_VERDE : key === 'estadual' ? LAST_YEAR_ESTADUAL : key === 'serieD' ? LAST_YEAR_SERIED : key === 'serieC' ? LAST_YEAR_SERIEC : key === 'serieB' ? LAST_YEAR_SERIEB : LAST_YEAR;
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
    assert.ok(entries.length >= 1 && entries.length <= 20, `${slug}: quantidade de escudos fora do esperado`);
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
    assert.deepEqual(itens('Amazonas FC'), ['Estadual', 'Série C'], 'Amazonas FC: o Estadual vem antes da Série C');
    assert.deepEqual(itens('Flamengo'), ['Copa do Brasil', 'Brasileirão', 'Mundial', 'Libertadores', 'Estadual'], 'Flamengo: ordem do titleOrder em teams.js');
    assert.deepEqual(itens('São Paulo'), ['Copa do Brasil', 'Brasileirão', 'Libertadores', 'Mundial', 'Sul-Americana', 'Estadual']);
    assert.deepEqual(itens('Internacional'), ['Copa do Brasil', 'Brasileirão', 'Libertadores', 'Mundial', 'Sul-Americana', 'Estadual']);
    for (const time of ['Santos', 'Corinthians', 'Grêmio']) assert.deepEqual(itens(time), ['Copa do Brasil', 'Brasileirão', 'Mundial', 'Libertadores', 'Estadual'], `${time}: mesma ordem do Flamengo (titleOrder em teams.js)`);
    // Com 5 competições o Mundial (o ápice) fica no centro.
    for (const time of ['Corinthians', 'Santos', 'Grêmio']) assert.equal(itens(time)[2], 'Mundial', `${time}: Mundial deve ficar no centro`);
    // Criciúma: a Série B fica no centro (titleOrder em teams.js); os outros times mantêm a ordem padrão. O Estadual vai sempre por último, fora da conta do centro.
    assert.deepEqual(itens('Criciúma'), ['Série C', 'Série B', 'Copa do Brasil', 'Estadual']);
    assert.deepEqual(itens('Bragantino'), ['Série C', 'Série B', 'Estadual'], 'Bragantino: a Série B fica no centro (titleOrder em teams.js)');
    // Sampaio Corrêa: a ordem vem de titleOrder em teams.js (Copa do Nordeste, Série D, Série B, Série C), não da lista padrão.
    assert.deepEqual(itens('Sampaio Corrêa'), ['Copa do Nordeste', 'Série D', 'Série B', 'Série C', 'Estadual']);
    // Todos os troféus têm a mesma altura: nenhum item recebe classe de tamanho especial, e a altura vem de uma variável única.
    for (const time of ['São Paulo', 'Flamengo', 'Palmeiras', 'Amazonas FC']) assert.ok(!/class="item big/.test(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`])), `${time}: nenhum troféu pode ser maior que os outros`);
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Flamengo`]).includes('var(--h)'), 'a altura dos troféus deve vir da variável única --h');
    // Copa do Nordeste: só os times do Nordeste a mostram (Ceará só tem ela).
    assert.deepEqual(itens('Ceará'), ['Estadual', 'Copa do Nordeste']);
    assert.deepEqual(itens('Bahia'), ['Copa do Nordeste', 'Brasileirão', 'Estadual']);
    assert.deepEqual(itens('Vitória'), ['Copa do Nordeste', 'Série B', 'Estadual']);
    assert.deepEqual(itens('Sport'), ['Copa do Brasil', 'Brasileirão', 'Copa do Nordeste', 'Série B', 'Estadual']);
    // Copa Verde: Paysandu, Remo, Goiás, Cuiabá e Brasiliense a mostram, logo depois da Copa do Nordeste na ordem padrão.
    assert.deepEqual(itens('Goiás'), ['Copa Verde', 'Série B', 'Estadual']);
    assert.deepEqual(itens('Cuiabá'), ['Estadual', 'Copa Verde']);
    assert.deepEqual(itens('Luverdense'), ['Estadual', 'Copa Verde']);
    assert.deepEqual(itens('Brasiliense'), ['Copa Verde', 'Série C', 'Série B', 'Estadual']);
    assert.deepEqual(itens('Gama'), ['Estadual', 'Série B']);
    assert.deepEqual(itens('Brasília'), ['Estadual', 'Copa Verde']);
    assert.deepEqual(itens('ABC'), ['Estadual', 'Série C']);
    assert.deepEqual(itens('Campinense'), ['Estadual', 'Copa do Nordeste']);
    assert.deepEqual(itens('América-RN'), ['Copa do Nordeste', 'Série D', 'Estadual'], 'América-RN: a Copa do Nordeste vem primeiro (titleOrder em teams.js)');
    assert.deepEqual(itens('Botafogo-PB'), ['Série D', 'Estadual']);
    assert.deepEqual(itens('Nacional-AM'), ['Estadual']);
    assert.deepEqual(itens('Rio Negro-AM'), ['Estadual']);
    assert.deepEqual(itens('São Raimundo-AM'), ['Estadual']);
    assert.deepEqual(itens('Manaus FC'), ['Estadual']);
    // O Estadual usa o troféu do estado (estadual-<uf>.png: o Amazonense nos times do Amazonas); estado sem a foto não mostra o Estadual (Goiás e Sport, de Goiás e Pernambuco).
    const b64 = (f) => fs.readFileSync(path.join(root, 'images', 'trofeus', f)).toString('base64');
    for (const time of ['Nacional-AM', 'Amazonas FC', 'Rio Negro-AM', 'São Raimundo-AM', 'Manaus FC']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-am.png')), `${time}: deve usar o troféu do Amazonense`);
    // Bangu, o único time menor do Rio: o Estadual dele usa a taça do Carioca (estadual-rj.png).
    assert.deepEqual(itens('Bangu'), ['Estadual']);
    assert.deepEqual(itens('América-RJ'), ['Estadual']);
    assert.deepEqual(itens('Olaria'), ['Série C']);
    assert.deepEqual(itens('Macaé'), ['Série C']);
    assert.deepEqual(itens('Campo Grande'), ['Série B']);
    for (const time of ['Bangu', 'América-RJ']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-rj.png')), `${time}: deve usar o troféu do Carioca`);
    // Times menores de São Paulo (Bragantino, Portuguesa): taça do Paulista; os 4 sem título paulista (Guarani, Santo André, Mirassol, Ponte Preta) não mostram o Estadual.
    assert.deepEqual(itens('Ituano'), ['Estadual', 'Série C']);
    // Minas Gerais não tem a foto da taça e Uberlândia, Tombense e Tupi não têm título do Mineiro (só do Interior).
    assert.deepEqual(itens('Uberlândia'), ['Série D', 'Série B'], 'Uberlândia: a Série D vem antes (titleOrder em teams.js)');
    assert.deepEqual(itens('Villa Nova-MG'), ['Estadual', 'Série B']);
    assert.deepEqual(itens('Tombense'), ['Série D']);
    // Os campeões nacionais de São Paulo e do Paraná: Oeste (Série C), Botafogo-SP (Série D), Juventus-SP e Inter de Limeira (Série B e Paulista A1) e Londrina (Série B e Paranaense).
    assert.deepEqual(itens('Osasco Sporting'), ['Série C']);
    assert.deepEqual(itens('Botafogo-SP'), ['Série D']);
    assert.deepEqual(itens('Juventus-SP'), ['Estadual', 'Série B']);
    assert.deepEqual(itens('Inter de Limeira'), ['Estadual', 'Série B']);
    assert.deepEqual(itens('Londrina'), ['Série B', 'Estadual']);
    assert.deepEqual(itens('Joinville'), ['Série C', 'Série B', 'Estadual']);
    assert.deepEqual(itens('Mixto'), ['Estadual']);
    assert.deepEqual(itens('Treze'), ['Estadual']);
    // Sul-Mato-Grossense: Operário-MS (Estadual antes da Série B) e Comercial-MS só têm o estadual, com a taça do estado.
    assert.deepEqual(itens('Operário-MS'), ['Estadual', 'Série B']);
    assert.deepEqual(itens('Comercial-MS'), ['Estadual']);
    for (const time of ['Operário-MS', 'Comercial-MS']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-ms.png')), `${time}: deve usar o troféu do Sul-Mato-Grossense`);
    // Campeões nacionais que faltavam: com taça do estado (Paraná, Pará, Ceará, Santa Catarina) o Estadual aparece por último; sem ela (Goiás, Pernambuco) só as Séries.
    assert.deepEqual(itens('União São João'), ['Série C', 'Série B']);
    assert.deepEqual(itens('Tuna Luso'), ['Série C', 'Série B', 'Estadual']);
    assert.deepEqual(itens('XV de Piracicaba'), ['Série C']);
    assert.deepEqual(itens('União Barbarense'), ['Série C']);
    assert.deepEqual(itens('Boa Esporte-MG'), ['Série C']);
    assert.deepEqual(itens('Operário-PR'), ['Série C', 'Série D', 'Estadual']);
    assert.deepEqual(itens('Maringá'), ['Série C']);
    assert.deepEqual(itens('São Raimundo-PA'), ['Série D']);
    assert.deepEqual(itens('Guarany de Sobral'), ['Série D']);
    assert.deepEqual(itens('Ferroviário-CE'), ['Estadual', 'Série D']);
    assert.deepEqual(itens('Aparecidense'), ['Série D']);
    assert.deepEqual(itens('Retrô'), ['Série D']);
    assert.deepEqual(itens('Brusque'), ['Estadual', 'Série D']);
    assert.deepEqual(itens('Barra-SC'), ['Estadual', 'Série D']);
    for (const [time, foto] of [['Londrina', 'pr'], ['Operário-PR', 'pr'], ['Athletico-PR', 'pr'], ['Tuna Luso', 'pa'], ['Remo', 'pa'], ['Ferroviário-CE', 'ce'], ['Fortaleza', 'ce']]) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64(`estadual-${foto}.png`)), `${time}: deve usar o troféu do estado (${foto})`);
    for (const time of ['Brusque', 'Barra-SC']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-sc.png')), `${time}: deve usar o troféu do Catarinense`);
    for (const time of ['Juventus-SP', 'Inter de Limeira']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-sp.png')), `${time}: deve usar o troféu do Paulista`);
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Joinville`]).includes(b64('estadual-sc.png')), 'Joinville: deve usar o troféu do Catarinense');
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Mixto`]).includes(b64('estadual-mt.png')), 'Mixto: deve usar o troféu do Mato-Grossense');
    assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: Treze`]).includes(b64('estadual-pb.png')), 'Treze: deve usar o troféu do Paraibano');
    assert.deepEqual(itens('Tupi'), ['Série D']);
    assert.deepEqual(itens('Paulista'), ['Série C', 'Copa do Brasil'], 'Paulista: sem título do Paulistão, então sem Estadual');
    // Times menores de Santa Catarina (Criciúma, Chapecoense, Avaí e Figueirense): taça do Catarinense.
    assert.deepEqual(itens('Avaí'), ['Estadual', 'Série C']);
    assert.deepEqual(itens('Figueirense'), ['Estadual']);
    assert.deepEqual(itens('Chapecoense'), ['Série B', 'Sul-Americana', 'Estadual'], 'Chapecoense: a Sul-Americana fica no centro (titleOrder em teams.js)');
    for (const time of ['Criciúma', 'Chapecoense', 'Avaí', 'Figueirense']) assert.ok(itens(time).includes('Estadual') && m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-sc.png')), `${time}: deve usar o troféu do Catarinense`);
    // Potiguar (ABC e América-RN) e Brasiliense (Brasiliense, Gama e Brasília): taças do estado.
    for (const time of ['ABC', 'América-RN']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-rn.png')), `${time}: deve usar o troféu do Potiguar`);
    for (const time of ['Brasiliense', 'Gama', 'Brasília']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-df.png')), `${time}: deve usar o troféu do Brasiliense`);
    // Mineiro (América-MG): taça do estado; Uberlândia, Tombense e Tupi só têm o Mineiro do Interior, que não conta.
    assert.deepEqual(itens('América-MG'), ['Série C', 'Série B', 'Estadual'], 'América-MG: a Série B fica no centro (titleOrder em teams.js)');
    for (const time of ['América-MG', 'Villa Nova-MG']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-mg.png')), `${time}: deve usar o troféu do Mineiro`);
    // Alagoano (CRB e CSA): taça do estado; só o CSA tem título nacional (Série C 2017).
    assert.deepEqual(itens('CRB'), ['Estadual']);
    assert.deepEqual(itens('CSA'), ['Estadual', 'Série C'], 'CSA: o Estadual vem antes da Série C (titleOrder em teams.js)');
    for (const time of ['CRB', 'CSA']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-al.png')), `${time}: deve usar o troféu do Alagoano`);
    // Paraibano (Botafogo-PB e Campinense): taça do estado.
    for (const time of ['Botafogo-PB', 'Campinense']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-pb.png')), `${time}: deve usar o troféu do Paraibano`);
    // Mato-Grossense (Cuiabá e Luverdense): taça do estado.
    for (const time of ['Cuiabá', 'Luverdense']) assert.ok(m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-mt.png')), `${time}: deve usar o troféu do Mato-Grossense`);
    assert.deepEqual(itens('Volta Redonda'), ['Série D', 'Série C'], 'Volta Redonda: só Séries D e C (sem título carioca, então sem Estadual)');
    for (const time of ['Bragantino', 'Portuguesa', 'Ituano']) assert.ok(itens(time).includes('Estadual') && m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-sp.png')), `${time}: deve usar o troféu do Paulista`);
    for (const time of ['Guarani', 'Santo André', 'Mirassol', 'Ponte Preta']) assert.ok(!itens(time).includes('Estadual'), `${time}: sem Estadual`);
    // Goiano (Goiás, Atlético-GO e Vila Nova): taça do estado.
    for (const time of ['Goiás', 'Atlético-GO', 'Vila Nova']) assert.ok(itens(time).includes('Estadual') && m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-go.png')), `${time}: deve usar o troféu do Goiano`);
    for (const time of ['Sport', 'Santa Cruz', 'Náutico']) assert.ok(itens(time).includes('Estadual') && m.exports.titlesHtml(palettes[`${PREFIX}: ${time}`]).includes(b64('estadual-pe.png')), `${time}: deve usar o troféu do Pernambucano`);
    // Os 12 grandes também mostram o Estadual (quando o estado tem a foto do troféu).
    for (const time of ['Flamengo', 'São Paulo', 'Cruzeiro']) assert.ok(itens(time).includes('Estadual'), `${time}: grande mostra o Estadual`);
    assert.deepEqual(itens('Remo'), ['Copa Verde', 'Série C', 'Estadual']);
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
    assert.equal(linha('Amazonas FC'), false, 'um item só não precisa de linha única');
    assert.equal(linha('Botafogo'), false, 'três itens ou menos usam o tamanho normal');
  } finally {
    Module._load = original;
  }
});

const GRANDES = ['flamengo', 'fluminense', 'vasco', 'botafogo', 'palmeiras', 'santos', 'sao-paulo', 'corinthians', 'cruzeiro', 'atletico-mg', 'gremio', 'internacional'];

test('os 12 grandes não mostram títulos de Série B, C nem D, mas os outros times mostram', () => {
  for (const team of teams.filter((x) => GRANDES.includes(x.slug))) {
    for (const key of ['serieB', 'serieC', 'serieD']) assert.deepEqual(team.titles[key], [], `${team.slug}: ${key} deve ficar vazio nos 12 grandes`);
  }
  assert.equal(teams.filter((x) => GRANDES.includes(x.slug)).length, 12);
  assert.ok(teams.filter((x) => !GRANDES.includes(x.slug)).some((t) => t.titles.serieB.length || t.titles.serieC.length), 'os times novos ainda têm Série B/C');
});

test('toda competição da seção Títulos tem a sua foto de troféu em images/trofeus', () => {
  const codigo = fs.readFileSync(path.join(root, 'extension', 'extension.js'), 'utf8');
  const arquivos = [...codigo.slice(codigo.indexOf('const COMPETITIONS'), codigo.indexOf('];', codigo.indexOf('const COMPETITIONS'))).matchAll(/file: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(arquivos.length, 10, 'são 10 competições com foto própria (o Estadual tem uma por estado: estadual-<uf>.png)');
  for (const uf of ['am', 'rj', 'sp', 'sc', 'rn', 'df', 'ms', 'ac', 'ap']) assert.ok(fs.existsSync(path.join(root, 'images', 'trofeus', `estadual-${uf}.png`)), `falta images/trofeus/estadual-${uf}.png`);
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
  for (const t of teams) assert.match(t.crestLabel || '', /^[^()]+( \([^()]+\))?$/, `${t.slug}: crestLabel deve ser Nome ou Nome (período)`);
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

test('os times estão agrupados por estado e, em cada estado, em ordem de títulos (Mundial, Libertadores, Brasileirão, Copa do Brasil, Sul-Americana, Copa do Nordeste, Séries B, C e D, Copa Verde e, no desempate, o Estadual e o ano do título mais importante)', () => {
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
    if (uf(a) !== uf(b) || a.antesDe || b.antesDe) continue; // exceção do `antesDe` (Remo antes do Tuna Luso)
    // Mais títulos primeiro, comparando nesta ordem; só se tudo empata vale a ordem do arquivo (Série B vale mais que a C, que vale mais que a D; sem troféu nacional que desempate, vale o estadual).
    const criterios = ['mundial', 'libertadores', 'brasileirao', 'copaDoBrasil', 'sulAmericana', 'copaDoNordeste', 'serieB', 'serieC', 'serieD', 'copaVerde', 'estadual'];
    const dif = criterios.map((k) => a.titles[k].length - b.titles[k].length).find((d) => d !== 0) || 0;
    assert.ok(dif >= 0, `${b.slug} (mais títulos) deveria vir antes de ${a.slug}`);
    if (dif === 0) {
      // mesma quantidade em tudo: vem primeiro quem ganhou antes o título mais importante
      const ano = (x, k) => (x.titles[k].length ? Math.min(...x.titles[k]) : Infinity);
      const dAno = criterios.map((k) => ano(a, k) - ano(b, k)).find((d) => d !== 0) || 0;
      assert.ok(dAno <= 0, `${a.slug} deveria vir depois de ${b.slug}: ${b.slug} ganhou antes o título mais importante`);
    }
  }
  assert.deepEqual(teams.map((x) => x.slug), ['flamengo', 'fluminense', 'vasco', 'botafogo', 'campo-grande', 'volta-redonda', 'olaria', 'macae', 'america-rj', 'bangu', 'sao-paulo', 'santos', 'corinthians', 'palmeiras', 'guarani', 'paulista', 'santo-andre', 'bragantino', 'uniao-sao-joao', 'novorizontino', 'portuguesa', 'juventus-sp', 'inter-de-limeira', 'ituano', 'mirassol', 'xv-de-piracicaba', 'uniao-barbarense', 'oeste', 'ponte-preta', 'botafogo-sp', 'cruzeiro', 'atletico-mg', 'america-mg', 'uberlandia', 'villa-nova', 'boa-esporte', 'tupi', 'tombense', 'gremio', 'internacional', 'juventude', 'bahia', 'vitoria', 'ypiranga-ba', 'fortaleza', 'ceara', 'ferroviario-ce', 'guarany-de-sobral', 'athletico-pr', 'coritiba', 'parana', 'londrina', 'operario-pr', 'maringa', 'sport', 'santa-cruz', 'nautico', 'retro-pe', 'paysandu', 'remo', 'tuna-luso', 'sao-raimundo-pa', 'amazonas', 'nacional-am', 'rio-negro-am', 'sao-raimundo-am', 'manaus', 'goias', 'atletico-go', 'vila-nova', 'aparecidense', 'criciuma', 'chapecoense', 'joinville', 'avai', 'brusque', 'barra-sc', 'figueirense', 'sampaio-correa', 'moto-club', 'maranhao-ac', 'cuiaba', 'luverdense', 'mixto', 'brasiliense', 'gama', 'brasilia', 'america-rn', 'abc', 'campinense', 'botafogo-pb', 'treze', 'csa', 'crb', 'asa', 'operario-ms', 'comercial-ms', 'rio-branco-ac', 'juventus-ac', 'independencia', 'atletico-ac', 'macapa', 'trem', 'ypiranga-ap', 'santos-ap', 'rio-branco-es', 'desportiva', 'vitoria-es', 'serra', 'flamengo-pi', 'parnahyba', 'botafogo-pi', 'piaui', 'altos', 'ji-parana', 'vilhena', 'porto-velho', 'bare', 'sao-raimundo-rr', 'gas', 'sergipe', 'confianca', 'itabaiana', 'palmas', 'tocantinopolis', 'gurupi']);
});
