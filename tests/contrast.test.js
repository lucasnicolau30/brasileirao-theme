// Roda a checagem de contraste dos 12 temas (src/check-contrast.js) e exige que ela passe.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const path = require('path');

test('contraste mínimo em todos os temas', () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'src', 'check-contrast.js')], { encoding: 'utf8' });
  assert.equal(result.status, 0, `check-contrast falhou:\n${result.stdout}${result.stderr}`);
});
