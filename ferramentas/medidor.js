// O medidor: roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js          todas
//   node ferramentas/medidor.js cota     so uma
//
// Nenhum numero do README e digitado a mao: sai daqui.

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

const num = (x) => (typeof x === 'number' ? x.toLocaleString('pt-BR') : String(x));
const dec = (x, c = 4) => x.toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
const pct = (x) => dec(x * 100, 2) + '%';

function imprimir(titulo, colunas, linhas) {
  console.log('\n### ' + titulo);
  const larguras = colunas.map((c, i) =>
    Math.max(c.length, ...linhas.map((l) => String(l[i]).length))
  );
  const linha = (cs) => '| ' + cs.map((c, i) => String(c).padStart(larguras[i])).join(' | ') + ' |';
  console.log(linha(colunas));
  console.log('|' + larguras.map((w) => '-'.repeat(w + 2)).join('|') + '|');
  for (const l of linhas) console.log(linha(l));
}

const tabelas = {
  varredura() {
    imprimir(
      'A varredura por ordem',
      ['n', 'permutacoes', 'maximo', 'conhecido', 'recordes', 'media', 'ja paradas', 'o recordista'],
      tabelaVarredura(11).map((l) => [
        l.n, num(l.permutacoes), l.maximo, l.conhecido ?? '-',
        num(l.recordes), dec(l.media), num(l.imediatas), l.recordista,
      ])
    );
  },

  cota() {
    imprimir(
      'A cota da prova contra o maximo medido',
      ['n', 'potencial max', 'cota da prova', 'cota apertada', 'maximo real', 'folga', 'folga apertada'],
      tabelaDaCota(11).map((l) => [
        l.n, num(l.potencialMaximo), num(l.cota), num(l.cotaApertada),
        l.maximo, dec(l.folga, 1) + 'x', dec(l.folgaApertada, 1) + 'x',
      ])
    );
  },

  potencial() {
    imprimir(
      'O crescimento do potencial, passo a passo, no dominio inteiro',
      ['n', 'permutacoes', 'passos', 'menor ganho', 'passos no minimo', 'fracao'],
      tabelaDoPotencial(10).map((l) => [
        l.n, num(l.permutacoes), num(l.passos), l.menorGanho, num(l.noMinimo), pct(l.fracaoNoMinimo),
      ])
    );
  },

  primeira() {
    imprimir(
      'Os passos pela carta que comeca na frente (n = 11)',
      ['carta', 'permutacoes', 'media', 'maximo'],
      tabelaPrimeiraCarta(11).map((l) => [l.carta, num(l.quantas), dec(l.media), l.maximo])
    );
  },

  cartaAlta() {
    imprimir(
      'A carta mais alta na frente contra o problema de n-1 cartas',
      ['n', 'media em n-1', 'media do grupo', 'maximo em n-1', 'maximo do grupo', 'media = +1', 'maximo = +1'],
      tabelaCartaAlta(11).map((l) => [
        l.n, dec(l.mediaAnterior), dec(l.mediaDoGrupo), l.maximoAnterior, l.maximoDoGrupo,
        l.mediaBate ? 'sim' : 'NAO', l.maximoBate ? 'sim' : 'NAO',
      ])
    );
  },

  histograma() {
    imprimir(
      'Quantas permutacoes param em cada numero de passos (n = 10)',
      ['passos', 'permutacoes', 'fracao'],
      tabelaHistograma(10).map((l) => [l.passos, num(l.quantas), pct(l.fracao)])
    );
  },

  degraus() {
    imprimir(
      'Os tres primeiros degraus do histograma contra (n-1)!',
      ['n', '(n-1)!', 'em 0 passos', 'em 1 passo', 'em 2 passos', 'em 3 passos', 'os tres batem', 'o quarto tambem'],
      tabelaDegraus(11).map((l) => [
        l.n, num(l.anterior), num(l.em0), num(l.em1), num(l.em2), num(l.em3),
        l.tresIguais ? 'sim' : 'NAO', l.oQuartoTambem ? 'sim' : 'nao',
      ])
    );
  },

  dominio() {
    imprimir(
      'O dominio varrido contra n!',
      ['n', 'varridas', 'n!', 'bate'],
      tabelaDominio(10).map((l) => [l.n, num(l.varridas), num(l.fatorial), l.bate ? 'sim' : 'NAO'])
    );
  },
};

const pedido = process.argv[2];
if (pedido && !tabelas[pedido]) {
  console.error('tabela desconhecida: ' + pedido);
  console.error('disponiveis: ' + Object.keys(tabelas).join(', '));
  process.exit(1);
}
for (const [nome, fn] of Object.entries(tabelas)) {
  if (!pedido || pedido === nome) fn();
}
console.log();
