// O juiz. Nao compartilha uma linha com `topswops.js`: aqui o passo e escrito
// do jeito lento e obvio, e a terminacao e conferida pela PROVA, nao pela
// simulacao.
//
// A prova de que Topswops sempre para e de uma linha so, e e essa:
//
//   Chame de potencial a soma de 2^i sobre as posicoes i (contadas de 1) que ja
//   estao com a carta certa. Cada passo aumenta o potencial.
//
// Por que aumenta: se a primeira carta e k, depois da inversao a posicao k fica
// com a carta k, e ela NAO estava certa antes (a carta k estava na frente). Isso
// ganha 2^k. O que se pode perder sao posicoes menores que k, e todas elas
// juntas valem no maximo 2^1 + ... + 2^(k-1) = 2^k - 2. Entao o saldo de um
// passo e pelo menos 2, nunca zero, nunca negativo.
//
// Como o potencial nunca passa de 2^(n+1) - 2, isso ja da um limite de passos.
// O limite e horroroso, e medi-lo contra o maximo de verdade e metade da graca
// deste repositorio.

/** O passo escrito do jeito obvio: fatiar, inverter, colar. */
export function passoIngenuo(baralho) {
  const k = baralho[0];
  if (k === 1) return null;
  return baralho.slice(0, k).reverse().concat(baralho.slice(k));
}

/** O potencial da prova: soma de 2^i sobre as posicoes ja certas. */
export function potencial(baralho) {
  let soma = 0;
  for (let i = 0; i < baralho.length; i++) {
    if (baralho[i] === i + 1) soma += 2 ** (i + 1);
  }
  return soma;
}

/** O maior potencial possivel com n cartas: o baralho ja ordenado. */
export function potencialMaximo(n) {
  return 2 ** (n + 1) - 2;
}

/**
 * O limite de passos que a prova entrega: o potencial comeca em pelo menos 0,
 * termina em no maximo 2^(n+1) - 2, e cresce pelo menos 2 por passo.
 */
export function cotaDaProva(n) {
  return 2 ** n - 1;
}

/**
 * Roda a trajetoria de um baralho conferindo a prova passo a passo, pelo
 * caminho lento. Devolve os passos e o MENOR crescimento de potencial visto —
 * a prova so precisa que esse minimo seja positivo, e saber quanto ele e de
 * verdade e uma pergunta que a prova nao responde.
 */
export function conferirProva(baralho) {
  let atual = baralho.slice();
  let anterior = potencial(atual);
  let passos = 0;
  let menorGanho = Infinity;
  for (;;) {
    const proximo = passoIngenuo(atual);
    if (proximo === null) {
      return { passos, menorGanho: passos === 0 ? null : menorGanho, potencialFinal: anterior };
    }
    const agora = potencial(proximo);
    const ganho = agora - anterior;
    if (ganho <= 0) {
      throw new Error('o potencial nao cresceu em ' + atual.join(',') + ': ' + anterior + ' -> ' + agora);
    }
    if (ganho < menorGanho) menorGanho = ganho;
    anterior = agora;
    atual = proximo;
    passos++;
  }
}

/**
 * Os valores conhecidos do maximo de passos, de n = 1 a 10 (OEIS A000375).
 * Nao sao calculados aqui: sao o gabarito contra o qual a varredura e medida.
 */
export const MAXIMOS_CONHECIDOS = [0, 1, 2, 4, 7, 10, 16, 22, 30, 38];
