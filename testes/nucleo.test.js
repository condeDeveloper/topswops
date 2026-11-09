// O comportamento. Nada de tabela aqui: isto e o que a iteracao faz, e o que o
// juiz diz que ela faz.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  identidade,
  valido,
  parado,
  passo,
  conta,
  trajetoria,
  permutacoes,
  fatorial,
} from '../src/topswops.js';
import { passoIngenuo, potencial, potencialMaximo, cotaDaProva, conferirProva } from '../src/juiz.js';

test('o baralho ordenado ja esta parado, e nao da nenhum passo', () => {
  for (let n = 1; n <= 8; n++) {
    assert.equal(parado(identidade(n)), true);
    assert.equal(conta(identidade(n)), 0);
  }
});

test('parado olha so a primeira carta: o resto pode estar como quiser', () => {
  assert.equal(parado([1, 4, 3, 2]), true);
  assert.equal(conta([1, 4, 3, 2]), 0);
  assert.equal(passo([1, 4, 3, 2]), null);
});

test('o passo inverte exatamente as k primeiras, com k a carta da frente', () => {
  assert.deepEqual(passo([3, 1, 2, 4]), [2, 1, 3, 4]);
  assert.deepEqual(passo([4, 1, 2, 3]), [3, 2, 1, 4]);
  assert.deepEqual(passo([2, 3, 1]), [3, 2, 1]);
});

test('depois do passo a carta k fica na posicao k, sempre', () => {
  for (const p of permutacoes(7)) {
    const k = p[0];
    if (k === 1) continue;
    const q = passo(p);
    assert.equal(q[k - 1], k, 'baralho ' + p.join(','));
  }
});

test('o passo nao mexe no baralho que recebeu', () => {
  const original = [4, 1, 2, 3];
  const copia = original.slice();
  passo(original);
  assert.deepEqual(original, copia);
});

test('conta nao mexe no baralho que recebeu', () => {
  const original = [5, 3, 1, 4, 2];
  const copia = original.slice();
  conta(original);
  assert.deepEqual(original, copia);
});

test('o caminho tem um baralho a mais que o numero de passos', () => {
  for (const p of permutacoes(6)) {
    assert.equal(trajetoria(p).length, conta(p) + 1);
  }
});

test('o caminho termina parado e so termina ali', () => {
  for (const p of permutacoes(6)) {
    const caminho = trajetoria(p);
    assert.equal(parado(caminho[caminho.length - 1]), true);
    for (let i = 0; i < caminho.length - 1; i++) {
      assert.equal(parado(caminho[i]), false);
    }
  }
});

test('todo baralho do caminho continua sendo uma permutacao', () => {
  for (const p of permutacoes(6)) {
    for (const b of trajetoria(p)) assert.equal(valido(b), true);
  }
});

test('valido recusa repetida, faltando e fora da faixa', () => {
  assert.equal(valido([1, 2, 3]), true);
  assert.equal(valido([1, 1, 3]), false);
  assert.equal(valido([1, 2, 4]), false);
  assert.equal(valido([0, 1, 2]), false);
  assert.equal(valido([1, 2, 2.5]), false);
});

test('o gerador entrega COPIAS: guardar a lista nao da tudo igual ao ultimo', () => {
  const todas = [...permutacoes(4)];
  assert.equal(todas.length, 24);
  assert.deepEqual(todas[0], [1, 2, 3, 4]);
  assert.deepEqual(todas[23], [4, 3, 2, 1]);
  assert.equal(new Set(todas.map((p) => p.join(','))).size, 24);
});

test('o gerador varre n! permutacoes distintas, em ordem lexicografica', () => {
  for (let n = 1; n <= 7; n++) {
    const todas = [...permutacoes(n)].map((p) => p.join(','));
    assert.equal(todas.length, fatorial(n));
    assert.equal(new Set(todas).size, fatorial(n));
    const ordenadas = todas.slice().sort();
    assert.deepEqual(todas, ordenadas);
  }
});

test('o juiz lento e o passo rapido concordam em todo baralho ate 7 cartas', () => {
  for (let n = 1; n <= 7; n++) {
    for (const p of permutacoes(n)) {
      assert.deepEqual(passo(p), passoIngenuo(p), 'baralho ' + p.join(','));
    }
  }
});

test('o potencial e a soma de 2^i das posicoes ja certas', () => {
  assert.equal(potencial([1, 2, 3]), 2 + 4 + 8);
  assert.equal(potencial([3, 2, 1]), 4);
  assert.equal(potencial([2, 3, 1]), 0);
  assert.equal(potencial(identidade(5)), potencialMaximo(5));
});

test('o potencial cresce em TODO passo de TODO baralho ate 7 cartas', () => {
  for (let n = 1; n <= 7; n++) {
    for (const p of permutacoes(n)) {
      const r = conferirProva(p);
      assert.equal(r.passos, conta(p), 'baralho ' + p.join(','));
    }
  }
});

test('o ganho minimo de um passo e 4, e nunca 2, que e o que a prova pede', () => {
  // A prova se contenta com ganho positivo e mostra que ele e pelo menos 2. O 2
  // exigiria que TODAS as posicoes 1..k-1 estivessem certas antes do passo — e a
  // posicao 1 nunca esta, porque e dela que saiu o k que acabou de ser lido.
  let menor = Infinity;
  for (let n = 3; n <= 7; n++) {
    for (const p of permutacoes(n)) {
      const r = conferirProva(p);
      if (r.menorGanho !== null && r.menorGanho < menor) menor = r.menorGanho;
    }
  }
  assert.equal(menor, 4);
});

test('o numero de passos nunca passa da cota que a prova entrega', () => {
  for (let n = 1; n <= 8; n++) {
    for (const p of permutacoes(n)) {
      assert.ok(conta(p) <= cotaDaProva(n), 'baralho ' + p.join(','));
    }
  }
});

test('comecar com a carta mais alta prende essa carta: ela nao se mexe mais', () => {
  for (let n = 3; n <= 7; n++) {
    for (const p of permutacoes(n)) {
      if (p[0] !== n) continue;
      const caminho = trajetoria(p);
      for (let i = 1; i < caminho.length; i++) {
        assert.equal(caminho[i][n - 1], n, 'baralho ' + p.join(','));
      }
    }
  }
});

test('o baralho invertido n, n-1, ..., 1 para em um passo so', () => {
  for (let n = 2; n <= 9; n++) {
    const invertido = identidade(n).reverse();
    assert.equal(conta(invertido), 1);
  }
});
