// A varredura: todas as n! permutacoes, uma por uma, sem amostra.
//
// O laco das permutacoes esta aqui dentro e nao usa o gerador de `topswops.js`,
// porque aqui a copia por permutacao e o custo dominante. O gerador publico
// continua devolvendo copia; este laco reusa o mesmo vetor e so o le.

import { identidade, fatorial } from './topswops.js';

/**
 * Varre todas as permutacoes de 1..n e devolve o censo dos passos.
 *
 * - total:      n!, para conferir que o dominio foi varrido inteiro
 * - maximo:     o maior numero de passos
 * - recordes:   quantas permutacoes alcancam esse maximo
 * - exemplos:   ate `guardar` baralhos que alcancam o maximo
 * - soma:       soma dos passos (para a media)
 * - histograma: quantas permutacoes param em cada numero de passos
 * - imediatas:  quantas ja comecam paradas (primeira carta = 1)
 */
export function varrer(n, guardar = 4) {
  const p = identidade(n);
  const trabalho = new Array(n);
  const histograma = [];
  let maximo = -1;
  let recordes = 0;
  let exemplos = [];
  let soma = 0;
  let total = 0;
  let imediatas = 0;

  for (;;) {
    for (let i = 0; i < n; i++) trabalho[i] = p[i];
    let passos = 0;
    while (trabalho[0] !== 1) {
      const k = trabalho[0];
      for (let i = 0, j = k - 1; i < j; i++, j--) {
        const t = trabalho[i];
        trabalho[i] = trabalho[j];
        trabalho[j] = t;
      }
      passos++;
    }

    total++;
    soma += passos;
    if (passos === 0) imediatas++;
    histograma[passos] = (histograma[passos] || 0) + 1;
    if (passos > maximo) {
      maximo = passos;
      recordes = 1;
      exemplos = [p.slice()];
    } else if (passos === maximo) {
      recordes++;
      if (exemplos.length < guardar) exemplos.push(p.slice());
    }

    // proxima permutacao em ordem lexicografica
    let i = n - 2;
    while (i >= 0 && p[i] >= p[i + 1]) i--;
    if (i < 0) break;
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
  }

  for (let i = 0; i <= maximo; i++) if (histograma[i] === undefined) histograma[i] = 0;
  return {
    n,
    total,
    esperado: fatorial(n),
    maximo,
    recordes,
    exemplos,
    soma,
    media: soma / total,
    histograma,
    imediatas,
  };
}

/**
 * Varre todas as permutacoes de 1..n conferindo a prova de terminacao em cada
 * passo de cada trajetoria: o potencial tem de crescer sempre.
 *
 * Devolve o menor crescimento visto no dominio inteiro e quantos passos ficaram
 * nesse minimo. A prova so garante crescimento positivo; este numero diz se ela
 * e apertada ou folgada.
 */
export function conferirProvaNoDominio(n) {
  const p = identidade(n);
  const trabalho = new Array(n);
  let menorGanho = Infinity;
  let noMinimo = 0;
  let passosTotais = 0;
  let permutacoes = 0;

  for (;;) {
    for (let i = 0; i < n; i++) trabalho[i] = p[i];
    let anterior = 0;
    for (let i = 0; i < n; i++) if (trabalho[i] === i + 1) anterior += 2 ** (i + 1);

    while (trabalho[0] !== 1) {
      const k = trabalho[0];
      for (let i = 0, j = k - 1; i < j; i++, j--) {
        const t = trabalho[i];
        trabalho[i] = trabalho[j];
        trabalho[j] = t;
      }
      let agora = 0;
      for (let i = 0; i < n; i++) if (trabalho[i] === i + 1) agora += 2 ** (i + 1);
      const ganho = agora - anterior;
      if (ganho <= 0) {
        throw new Error('o potencial nao cresceu em n=' + n + ': ganho ' + ganho);
      }
      if (ganho < menorGanho) {
        menorGanho = ganho;
        noMinimo = 1;
      } else if (ganho === menorGanho) {
        noMinimo++;
      }
      anterior = agora;
      passosTotais++;
    }
    permutacoes++;

    let i = n - 2;
    while (i >= 0 && p[i] >= p[i + 1]) i--;
    if (i < 0) break;
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
  }

  return { n, permutacoes, passosTotais, menorGanho, noMinimo };
}

/**
 * Quantas permutacoes com n cartas tem cada carta na frente, e quantos passos
 * cada grupo gasta. A primeira carta e a unica coisa que a iteracao olha para
 * decidir o primeiro lance, e por isso e o primeiro lugar onde se procura
 * explicacao para o recorde.
 */
export function porPrimeiraCarta(n) {
  const p = identidade(n);
  const trabalho = new Array(n);
  const grupos = [];
  for (let k = 0; k <= n; k++) grupos[k] = { carta: k, quantas: 0, soma: 0, maximo: 0 };

  for (;;) {
    for (let i = 0; i < n; i++) trabalho[i] = p[i];
    const primeira = p[0];
    let passos = 0;
    while (trabalho[0] !== 1) {
      const k = trabalho[0];
      for (let i = 0, j = k - 1; i < j; i++, j--) {
        const t = trabalho[i];
        trabalho[i] = trabalho[j];
        trabalho[j] = t;
      }
      passos++;
    }
    const g = grupos[primeira];
    g.quantas++;
    g.soma += passos;
    if (passos > g.maximo) g.maximo = passos;

    let i = n - 2;
    while (i >= 0 && p[i] >= p[i + 1]) i--;
    if (i < 0) break;
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
  }

  return grupos.slice(1).map((g) => ({ ...g, media: g.quantas ? g.soma / g.quantas : 0 }));
}
