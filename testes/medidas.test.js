// Os numeros do README, presos. Se o codigo mudar e um numero mudar, isto
// quebra antes de o README virar mentira.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  tabelaVarredura,
  tabelaDaCota,
  tabelaDoPotencial,
  tabelaPrimeiraCarta,
  tabelaHistograma,
  tabelaDominio,
  tabelaDegraus,
  tabelaCartaAlta,
} from '../src/medidas.js';
import { MAXIMOS_CONHECIDOS } from '../src/juiz.js';

const MINUTO = 120_000;

test('o maximo de passos bate com os dez valores conhecidos, de n=1 a n=10', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(10);
  assert.deepEqual(linhas.map((l) => l.maximo), MAXIMOS_CONHECIDOS);
  assert.deepEqual(MAXIMOS_CONHECIDOS, [0, 1, 2, 4, 7, 10, 16, 22, 30, 38]);
});

test('n=11: 39.916.800 baralhos, maximo 51, um recordista so', { timeout: MINUTO }, () => {
  const l = tabelaVarredura(11)[10];
  assert.equal(l.n, 11);
  assert.equal(l.permutacoes, 39_916_800);
  assert.equal(l.maximo, 51);
  assert.equal(l.recordes, 1);
  assert.equal(l.recordista, '4 9 11 6 10 7 8 2 1 3 5');
  assert.equal(l.imediatas, 3_628_800);
});

test('o recordista passa a ser unico a partir de n=8', { timeout: MINUTO }, () => {
  const recordes = tabelaVarredura(11).map((l) => l.recordes);
  assert.deepEqual(recordes, [1, 1, 2, 2, 1, 5, 2, 1, 1, 1, 1]);
  for (let n = 8; n <= 11; n++) assert.equal(recordes[n - 1], 1);
});

test('o recordista NAO comeca com a carta mais alta em nenhum n de 8 a 11', { timeout: MINUTO }, () => {
  for (const l of tabelaVarredura(11)) {
    if (l.n < 8) continue;
    const primeira = Number(l.recordista.split(' ')[0]);
    assert.notEqual(primeira, l.n, 'n=' + l.n);
  }
  assert.equal(tabelaVarredura(10)[9].recordista, '5 9 1 8 6 2 10 4 7 3');
});

test('a media de passos em n=10 e 6,1093 e em n=11 e 6,9628', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(11);
  assert.equal(linhas[9].media.toFixed(4), '6.1093');
  assert.equal(linhas[10].media.toFixed(4), '6.9628');
});

test('a cota da prova em n=10 e 1.023 contra um maximo real de 38', { timeout: MINUTO }, () => {
  const l = tabelaDaCota(10)[8];
  assert.equal(l.n, 10);
  assert.equal(l.potencialMaximo, 2046);
  assert.equal(l.cota, 1023);
  assert.equal(l.cotaApertada, 511);
  assert.equal(l.maximo, 38);
  assert.equal(l.folga.toFixed(1), '26.9');
  assert.equal(l.folgaApertada.toFixed(1), '13.4');
});

test('a folga da cota cresce com n: a prova piora quanto mais cartas', { timeout: MINUTO }, () => {
  const folgas = tabelaDaCota(11).map((l) => l.folga);
  for (let i = 1; i < folgas.length; i++) assert.ok(folgas[i] > folgas[i - 1]);
  assert.equal(folgas[folgas.length - 1].toFixed(1), '40.1');
});

test('o ganho minimo de potencial e 4 em toda ordem de 3 a 10, nunca o 2 da prova', { timeout: MINUTO }, () => {
  const linhas = tabelaDoPotencial(10);
  for (const l of linhas) {
    if (l.n === 2) continue; // um passo so no dominio inteiro, e ele ganha 6
    assert.equal(l.menorGanho, 4, 'n=' + l.n);
  }
});

test('em n=10 sao 22.169.434 passos, 2.763.932 deles no ganho minimo', { timeout: MINUTO }, () => {
  const l = tabelaDoPotencial(10)[8];
  assert.equal(l.n, 10);
  assert.equal(l.permutacoes, 3_628_800);
  assert.equal(l.passos, 22_169_434);
  assert.equal(l.noMinimo, 2_763_932);
  assert.equal((l.fracaoNoMinimo * 100).toFixed(2), '12.47');
});

test('a media cai quanto mais alta a carta da frente: a mais alta e a mais barata', { timeout: MINUTO }, () => {
  const linhas = tabelaPrimeiraCarta(11).slice(1); // sem a carta 1, que ja esta parada
  for (let i = 1; i < linhas.length; i++) {
    assert.ok(linhas[i].media < linhas[i - 1].media, 'carta ' + linhas[i].carta);
  }
  assert.equal(linhas[0].media.toFixed(4), '7.8627');
  assert.equal(linhas[linhas.length - 1].media.toFixed(4), '7.1093');
  assert.equal(linhas[0].maximo, 50);
  assert.equal(linhas[linhas.length - 1].maximo, 39);
});

test('o recorde de n=11 esta no grupo da carta 4, nao no da 11', { timeout: MINUTO }, () => {
  const linhas = tabelaPrimeiraCarta(11);
  assert.equal(linhas[3].carta, 4);
  assert.equal(linhas[3].maximo, 51);
  assert.equal(Math.max(...linhas.map((l) => l.maximo)), 51);
});

test('carta mais alta na frente = o problema de n-1 cartas mais um passo, exato', { timeout: MINUTO }, () => {
  const linhas = tabelaCartaAlta(11);
  assert.equal(linhas.length, 9);
  for (const l of linhas) {
    assert.equal(l.mediaBate, true, 'n=' + l.n);
    assert.equal(l.maximoBate, true, 'n=' + l.n);
  }
  const ultima = linhas[8];
  assert.equal(ultima.n, 11);
  assert.equal(ultima.maximoAnterior, 38);
  assert.equal(ultima.maximoDoGrupo, 39);
});

test('os tres primeiros degraus do histograma sao (n-1)! cada, e o quarto nao', { timeout: MINUTO }, () => {
  const linhas = tabelaDegraus(11);
  assert.equal(linhas.length, 9);
  for (const l of linhas) {
    assert.equal(l.tresIguais, true, 'n=' + l.n);
    assert.equal(l.oQuartoTambem, false, 'n=' + l.n);
  }
  const n10 = linhas.find((l) => l.n === 10);
  assert.equal(n10.anterior, 362_880);
  assert.equal(n10.em2, 362_880);
  assert.equal(n10.em3, 339_840);
});

test('o histograma de n=10 comeca com tres degraus de 10,00% cravados', { timeout: MINUTO }, () => {
  const h = tabelaHistograma(10);
  for (const passos of [0, 1, 2]) {
    assert.equal(h[passos].quantas, 362_880);
    assert.equal((h[passos].fracao * 100).toFixed(2), '10.00');
  }
  assert.equal(h[3].quantas, 339_840);
  assert.equal(h.length, 39); // de 0 a 38 passos
  assert.equal(h.reduce((s, l) => s + l.quantas, 0), 3_628_800);
});

test('o dominio varrido e n! em toda ordem, sem sobrar nem faltar baralho', { timeout: MINUTO }, () => {
  for (const l of tabelaDominio(10)) {
    assert.equal(l.bate, true, 'n=' + l.n);
    assert.equal(l.varridas, l.fatorial);
  }
  assert.equal(tabelaDominio(10)[9].fatorial, 3_628_800);
});
