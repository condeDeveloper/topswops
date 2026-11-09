// A varredura grande, separada porque passa de meio minuto: as 479.001.600
// permutacoes de doze cartas. Continua rodando no CI, com folga de tempo.
//
// A varredura roda UMA vez e os tres testes leem o mesmo resultado. Varrer tres
// vezes o mesmo dominio nao prova nada a mais e custa tres vezes o relogio.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { varrer } from '../src/varredura.js';
import { fatorial } from '../src/topswops.js';

const DEZ_MINUTOS = 600_000;

let cache = null;
function doze() {
  if (cache === null) cache = varrer(12);
  return cache;
}

test('doze cartas: 479.001.600 baralhos, maximo 65, e o recordista e unico', { timeout: DEZ_MINUTOS }, () => {
  const r = doze();
  assert.equal(r.total, 479_001_600);
  assert.equal(r.total, fatorial(12));
  assert.equal(r.maximo, 65);
  assert.equal(r.recordes, 1);
  assert.deepEqual(r.exemplos[0], [2, 6, 1, 10, 11, 8, 12, 3, 4, 7, 9, 5]);
  assert.equal(r.imediatas, 39_916_800);
  assert.equal(r.media.toFixed(4), '7.8474');
});

test('em doze cartas o recordista comeca com o 2, e a cota da prova fica 63 vezes folgada', { timeout: DEZ_MINUTOS }, () => {
  const r = doze();
  assert.equal(r.exemplos[0][0], 2);
  assert.equal(2 ** 12 - 1, 4095); // a cota da prova para n=12
  assert.equal((4095 / r.maximo).toFixed(1), '63.0');
});

test('os tres primeiros degraus de doze cartas tambem sao 11! cada', { timeout: DEZ_MINUTOS }, () => {
  const r = doze();
  const onzeFatorial = fatorial(11);
  assert.equal(onzeFatorial, 39_916_800);
  assert.equal(r.histograma[0], onzeFatorial);
  assert.equal(r.histograma[1], onzeFatorial);
  assert.equal(r.histograma[2], onzeFatorial);
  assert.notEqual(r.histograma[3], onzeFatorial);
  assert.equal(r.histograma[3], 37_900_800);
});
