// A iteracao de Topswops, atribuida a John Conway.
//
// Um baralho e uma permutacao de 1..n. Olhe a primeira carta, leia o numero k
// que esta nela, e inverta as k primeiras cartas. Repita ate a primeira carta
// ser o 1. A pergunta e quantos passos isso demora no pior caso, e ela nao tem
// formula conhecida: os valores de n = 1 a 19 sairam de varredura, e e isso que
// este repositorio refaz.
//
// Atencao ao que Topswops NAO e: nao e ordenar por panquecas. Ordenar por
// panquecas escolhe onde cortar; aqui quem escolhe e a propria carta de cima, e
// o fim nao e o baralho ordenado — e so o 1 chegar na frente. O baralho pode
// parar embaralhado.

/** O baralho inicial 1, 2, ..., n — o unico que ja esta parado. */
export function identidade(n) {
  const p = new Array(n);
  for (let i = 0; i < n; i++) p[i] = i + 1;
  return p;
}

/** Um baralho e valido se e uma permutacao de 1..n, sem repetir nem faltar. */
export function valido(baralho) {
  const n = baralho.length;
  const visto = new Array(n).fill(false);
  for (const c of baralho) {
    if (!Number.isInteger(c) || c < 1 || c > n || visto[c - 1]) return false;
    visto[c - 1] = true;
  }
  return true;
}

/** Parado quer dizer: a primeira carta e o 1. Nada mais. */
export function parado(baralho) {
  return baralho[0] === 1;
}

/**
 * Um passo. Devolve um baralho NOVO, ou null se ja estava parado.
 *
 * O detalhe que faz a iteracao terminar: depois da inversao, a carta k fica na
 * posicao k. Toda jogada acerta uma carta no lugar dela — e e sempre a maior
 * carta que se mexeu.
 */
export function passo(baralho) {
  const k = baralho[0];
  if (k === 1) return null;
  const novo = baralho.slice();
  for (let i = 0; i < k; i++) novo[i] = baralho[k - 1 - i];
  return novo;
}

/** Quantos passos ate parar. Trabalha numa copia; nao mexe no argumento. */
export function conta(baralho) {
  const p = baralho.slice();
  let n = 0;
  while (p[0] !== 1) {
    const k = p[0];
    for (let i = 0, j = k - 1; i < j; i++, j--) {
      const t = p[i];
      p[i] = p[j];
      p[j] = t;
    }
    n++;
  }
  return n;
}

/** O caminho inteiro, do baralho dado ate o parado, inclusive as duas pontas. */
export function trajetoria(baralho) {
  const caminho = [baralho.slice()];
  let atual = baralho;
  for (;;) {
    const proximo = passo(atual);
    if (proximo === null) return caminho;
    caminho.push(proximo);
    atual = proximo;
  }
}

/**
 * Todas as permutacoes de 1..n em ordem lexicografica.
 *
 * Devolve uma COPIA a cada vez, de proposito: um gerador que entrega o vetor de
 * trabalho funciona enquanto quem chama usa e joga fora, e mente na primeira vez
 * que alguem guarda a lista (sai tudo igual ao ultimo). A varredura, que e o
 * unico lugar onde o custo da copia aparece, tem o laco dela por dentro.
 */
export function* permutacoes(n) {
  const p = identidade(n);
  yield p.slice();
  for (;;) {
    let i = n - 2;
    while (i >= 0 && p[i] >= p[i + 1]) i--;
    if (i < 0) return;
    let j = n - 1;
    while (p[j] <= p[i]) j--;
    let t = p[i];
    p[i] = p[j];
    p[j] = t;
    for (let a = i + 1, b = n - 1; a < b; a++, b--) {
      t = p[a];
      p[a] = p[b];
      p[b] = t;
    }
    yield p.slice();
  }
}

/** n! — so para conferir o tamanho do dominio varrido. */
export function fatorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}
