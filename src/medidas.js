// As tabelas do README. Todo numero daqui sai de um metodo; nenhum e digitado.

import { fatorial } from './topswops.js';
import { cotaDaProva, potencialMaximo, MAXIMOS_CONHECIDOS } from './juiz.js';
import { varrer, conferirProvaNoDominio, porPrimeiraCarta } from './varredura.js';

/** Tabela 1 — a varredura por ordem. */
export function tabelaVarredura(ate = 11) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    linhas.push({
      n,
      permutacoes: r.total,
      maximo: r.maximo,
      conhecido: MAXIMOS_CONHECIDOS[n - 1] ?? null,
      recordes: r.recordes,
      media: r.media,
      imediatas: r.imediatas,
      recordista: r.exemplos[0].join(' '),
    });
  }
  return linhas;
}

/**
 * Tabela 2 — a cota da prova contra o maximo medido.
 *
 * `cotaApertada` e a mesma prova com uma observacao a mais, que a varredura
 * tornou visivel: a posicao 1 nunca entra na perda, porque e dela que saiu o k
 * que acabou de ser lido. Isso leva o ganho minimo de 2 para 4 e corta a cota
 * pela metade. Continua horrorosa.
 */
export function tabelaDaCota(ate = 11) {
  const linhas = [];
  for (let n = 2; n <= ate; n++) {
    const r = varrer(n);
    const cota = cotaDaProva(n);
    const apertada = Math.floor(potencialMaximo(n) / 4);
    linhas.push({
      n,
      potencialMaximo: potencialMaximo(n),
      cota,
      cotaApertada: apertada,
      maximo: r.maximo,
      folga: cota / r.maximo,
      folgaApertada: apertada / r.maximo,
    });
  }
  return linhas;
}

/** Tabela 3 — o crescimento do potencial em cada passo do dominio inteiro. */
export function tabelaDoPotencial(ate = 10) {
  const linhas = [];
  for (let n = 2; n <= ate; n++) {
    const r = conferirProvaNoDominio(n);
    linhas.push({
      n,
      permutacoes: r.permutacoes,
      passos: r.passosTotais,
      menorGanho: r.menorGanho,
      noMinimo: r.noMinimo,
      fracaoNoMinimo: r.noMinimo / r.passosTotais,
    });
  }
  return linhas;
}

/** Tabela 4 — os passos agrupados pela carta que comeca na frente. */
export function tabelaPrimeiraCarta(n = 11) {
  return porPrimeiraCarta(n).map((g) => ({
    carta: g.carta,
    quantas: g.quantas,
    media: g.media,
    maximo: g.maximo,
  }));
}

/** Tabela 5 — quantas permutacoes param em cada numero de passos. */
export function tabelaHistograma(n = 10) {
  const r = varrer(n);
  return r.histograma.map((quantas, passos) => ({
    passos,
    quantas,
    fracao: quantas / r.total,
  }));
}

/** Tabela 6 — n! conferido contra o total varrido, ordem por ordem. */
export function tabelaDominio(ate = 10) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    linhas.push({ n, varridas: r.total, fatorial: fatorial(n), bate: r.total === fatorial(n) });
  }
  return linhas;
}

/**
 * Tabela 7 — os tres primeiros degraus do histograma.
 *
 * Parar em 0, em 1 e em 2 passos acontece com exatamente (n-1)! baralhos cada,
 * os tres iguais. Em 3 passos a igualdade morre. Isto apareceu olhando o
 * histograma de n = 10, onde os tres primeiros degraus marcam 10,00% cravados.
 */
export function tabelaDegraus(ate = 11) {
  const linhas = [];
  for (let n = 3; n <= ate; n++) {
    const r = varrer(n);
    const anterior = fatorial(n - 1);
    linhas.push({
      n,
      anterior,
      em0: r.histograma[0],
      em1: r.histograma[1],
      em2: r.histograma[2],
      em3: r.histograma[3] ?? 0,
      tresIguais: r.histograma[0] === anterior && r.histograma[1] === anterior && r.histograma[2] === anterior,
      oQuartoTambem: (r.histograma[3] ?? 0) === anterior,
    });
  }
  return linhas;
}

/**
 * Tabela 8 — a carta mais alta na frente.
 *
 * A intuicao e que comecar com a carta mais alta da o maior trabalho, porque
 * inverte o baralho inteiro. E o contrario, e nao por pouco: a inversao poe a
 * carta n na posicao n, de onde ela nunca mais sai, e o que sobra e exatamente
 * o problema de n-1 cartas. A media e o maximo desse grupo sao os da ordem
 * anterior MAIS UM, cravados.
 */
export function tabelaCartaAlta(ate = 11) {
  const linhas = [];
  for (let n = 3; n <= ate; n++) {
    const anterior = varrer(n - 1);
    const grupo = porPrimeiraCarta(n)[n - 1];
    linhas.push({
      n,
      mediaAnterior: anterior.media,
      mediaDoGrupo: grupo.media,
      maximoAnterior: anterior.maximo,
      maximoDoGrupo: grupo.maximo,
      mediaBate: Math.abs(grupo.media - (anterior.media + 1)) < 1e-12,
      maximoBate: grupo.maximo === anterior.maximo + 1,
    });
  }
  return linhas;
}
