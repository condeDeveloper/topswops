# Topswops

A iteração de John Conway varrida inteira: todas as permutações de até **doze
cartas**, 479.001.600 baralhos, com a prova de terminação conferida passo a
passo em cada trajetória. Node puro, sem dependência nenhuma.

Olhe a primeira carta do baralho, leia o número `k` que está nela, e inverta as
`k` primeiras cartas. Repita até a primeira carta ser o `1`. A pergunta é quantos
passos isso demora no pior caso — e ela não tem fórmula conhecida. Só varredura.

> **Topswops não é ordenação por panquecas.** Ordenar por panquecas escolhe onde
> cortar; aqui quem escolhe é a própria carta de cima. E o fim não é o baralho
> ordenado: é só o `1` chegar na frente. O baralho pode parar embaralhado, e
> quase sempre para.

## Os quatro achados

1. **Com doze cartas o máximo é 65 passos, e o recordista é único.** A partir de
   oito cartas existe **um só** baralho que alcança o máximo, em todas as cinco
   ordens que a varredura cobre (8, 9, 10, 11 e 12). Abaixo disso há empate: com
   seis cartas são cinco recordistas.
2. **Começar com a carta mais alta é o começo mais barato, não o mais caro.** A
   inversão põe a carta `n` na posição `n`, de onde ela nunca mais sai — e o que
   sobra é *exatamente* o problema de `n-1` cartas. A média e o máximo desse
   grupo são os da ordem anterior **mais um**, cravados em nove ordens seguidas.
   O recordista de doze cartas começa com o **2**.
3. **A prova de terminação se contenta com crescimento 2; o crescimento real
   nunca é menor que 4.** E a cota de passos que ela entrega fica **63 vezes**
   acima do máximo medido em doze cartas: 4.095 contra 65.
4. **Parar em 0, em 1 e em 2 passos acontece com exatamente `(n-1)!` baralhos
   cada.** Três degraus idênticos — 10,00% cravados em dez cartas — e no quarto
   degrau a igualdade morre, em todas as nove ordens conferidas.

## Por que a iteração para

A prova é de uma linha. Chame de **potencial** a soma de `2^i` sobre as posições
`i` (contadas de 1) que já estão com a carta certa. Cada passo aumenta o
potencial:

- se a primeira carta é `k`, depois da inversão a posição `k` fica com a carta
  `k`, e ela não estava certa antes — a carta `k` estava na frente. Isso ganha
  `2^k`;
- o que se pode perder são posições menores que `k`, e todas juntas valem no
  máximo `2^1 + ... + 2^(k-1) = 2^k - 2`.

Saldo: pelo menos 2. Como o potencial nunca passa de `2^(n+1) - 2`, isso já
limita os passos a `2^n - 1`.

O limite é horroroso, e medi-lo contra o máximo de verdade é metade da graça
daqui. A outra metade é que **o saldo 2 nunca acontece**: ele exigiria que todas
as posições `1..k-1` estivessem certas antes do passo, e a posição 1 nunca está —
é dela que saiu o `k` que acabou de ser lido. O mínimo real é 4, em toda ordem
varrida, e com ele a cota cai pela metade. Continua horrorosa.

O juiz (`src/juiz.js`) confere isso passo a passo, com um `passo` escrito do jeito
lento e obvio, que não compartilha uma linha com o do núcleo.

## As medidas

Tudo abaixo sai de `node ferramentas/medidor.js`. Nenhum número foi digitado à
mão.

### A varredura por ordem

| n | permutações | máximo | conhecido | recordistas | média | já paradas | o recordista |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 1 | 0,0000 | 1 | 1 |
| 2 | 2 | 1 | 1 | 1 | 0,5000 | 1 | 2 1 |
| 3 | 6 | 2 | 2 | 2 | 1,0000 | 2 | 2 3 1 |
| 4 | 24 | 4 | 4 | 2 | 1,5833 | 6 | 2 4 1 3 |
| 5 | 120 | 7 | 7 | 1 | 2,2083 | 24 | 3 1 4 5 2 |
| 6 | 720 | 10 | 10 | 5 | 2,9375 | 120 | 3 6 5 1 4 2 |
| 7 | 5.040 | 16 | 16 | 2 | 3,6722 | 720 | 3 1 4 6 7 5 2 |
| 8 | 40.320 | 22 | 22 | 1 | 4,4707 | 5.040 | 6 1 5 7 8 3 2 4 |
| 9 | 362.880 | 30 | 30 | 1 | 5,2676 | 40.320 | 6 1 5 9 7 2 8 3 4 |
| 10 | 3.628.800 | 38 | 38 | 1 | 6,1093 | 362.880 | 5 9 1 8 6 2 10 4 7 3 |
| 11 | 39.916.800 | 51 | — | 1 | 6,9628 | 3.628.800 | 4 9 11 6 10 7 8 2 1 3 5 |
| 12 | 479.001.600 | 65 | — | 1 | 7,8474 | 39.916.800 | 2 6 1 10 11 8 12 3 4 7 9 5 |

A coluna **conhecido** é o gabarito de fora (os dez primeiros termos de
A000375), e não é calculada aqui: é contra ela que a varredura é medida. Os dez
batem. As linhas 11 e 12 saem num teste pesado, e a 12 leva 45 segundos.

O máximo cresce bem devagar: 38, 51, 65. O que a prova prometia era `2^n`.

### A cota da prova contra o máximo medido

| n | potencial máximo | cota da prova | cota apertada | máximo real | folga | folga apertada |
|---|---|---|---|---|---|---|
| 5 | 62 | 31 | 15 | 7 | 4,4x | 2,1x |
| 6 | 126 | 63 | 31 | 10 | 6,3x | 3,1x |
| 7 | 254 | 127 | 63 | 16 | 7,9x | 3,9x |
| 8 | 510 | 255 | 127 | 22 | 11,6x | 5,8x |
| 9 | 1.022 | 511 | 255 | 30 | 17,0x | 8,5x |
| 10 | 2.046 | 1.023 | 511 | 38 | 26,9x | 13,4x |
| 11 | 4.094 | 2.047 | 1.023 | 51 | 40,1x | 20,1x |

A **cota apertada** é a mesma prova com a observação de que o ganho mínimo é 4 e
não 2. Corta tudo pela metade e a folga continua crescendo com `n`: a prova não
está só folgada, está piorando.

### O crescimento do potencial, no domínio inteiro

| n | permutações | passos | menor ganho | passos no mínimo | fração |
|---|---|---|---|---|---|
| 4 | 24 | 38 | 4 | 7 | 18,42% |
| 5 | 120 | 265 | 4 | 54 | 20,38% |
| 6 | 720 | 2.115 | 4 | 391 | 18,49% |
| 7 | 5.040 | 18.508 | 4 | 3.191 | 17,24% |
| 8 | 40.320 | 180.260 | 4 | 27.606 | 15,31% |
| 9 | 362.880 | 1.911.505 | 4 | 265.132 | 13,87% |
| 10 | 3.628.800 | 22.169.434 | 4 | 2.763.932 | 12,47% |

Vinte e dois milhões de passos conferidos um por um em dez cartas, e o potencial
cresce em todos. O ganho 4 é comum: **um passo em oito**.

### Os passos pela carta que começa na frente (n = 11)

| carta | permutações | média | máximo |
|---|---|---|---|
| 2 | 3.628.800 | 7,8627 | 50 |
| 3 | 3.628.800 | 7,8316 | 50 |
| 4 | 3.628.800 | 7,7926 | **51** |
| 5 | 3.628.800 | 7,7770 | 45 |
| 6 | 3.628.800 | 7,7333 | 50 |
| 7 | 3.628.800 | 7,7173 | 50 |
| 8 | 3.628.800 | 7,6599 | 49 |
| 9 | 3.628.800 | 7,6031 | 46 |
| 10 | 3.628.800 | 7,5036 | 44 |
| 11 | 3.628.800 | 7,1093 | 39 |

A média cai de ponta a ponta, sem uma inversão: quanto mais alta a carta da
frente, mais barato o baralho. O recorde de 51 está no grupo da carta **4**.

### A carta mais alta na frente contra o problema de n-1 cartas

| n | média em n-1 | média do grupo | máximo em n-1 | máximo do grupo |
|---|---|---|---|---|
| 3 | 0,5000 | 1,5000 | 1 | 2 |
| 4 | 1,0000 | 2,0000 | 2 | 3 |
| 5 | 1,5833 | 2,5833 | 4 | 5 |
| 6 | 2,2083 | 3,2083 | 7 | 8 |
| 7 | 2,9375 | 3,9375 | 10 | 11 |
| 8 | 3,6722 | 4,6722 | 16 | 17 |
| 9 | 4,4707 | 5,4707 | 22 | 23 |
| 10 | 5,2676 | 6,2676 | 30 | 31 |
| 11 | 6,1093 | 7,1093 | 38 | 39 |

Nove ordens, dois números cada, e os dezoito são a conta anterior mais um. Não é
aproximação: é igualdade exata, e o teste a prende.

### Os três primeiros degraus do histograma contra (n-1)!

| n | (n-1)! | em 0 passos | em 1 passo | em 2 passos | em 3 passos |
|---|---|---|---|---|---|
| 5 | 24 | 24 | 24 | 24 | 20 |
| 6 | 120 | 120 | 120 | 120 | 104 |
| 7 | 720 | 720 | 720 | 720 | 648 |
| 8 | 5.040 | 5.040 | 5.040 | 5.040 | 4.608 |
| 9 | 40.320 | 40.320 | 40.320 | 40.320 | 37.440 |
| 10 | 362.880 | 362.880 | 362.880 | 362.880 | 339.840 |
| 11 | 3.628.800 | 3.628.800 | 3.628.800 | 3.628.800 | 3.427.200 |
| 12 | 39.916.800 | 39.916.800 | 39.916.800 | 39.916.800 | 37.900.800 |

### A cauda do histograma (n = 10)

| passos | permutações | fração |
|---|---|---|
| 0 | 362.880 | 10,00% |
| 1 | 362.880 | 10,00% |
| 2 | 362.880 | 10,00% |
| 3 | 339.840 | 9,37% |
| … | … | … |
| 34 | 51 | 0,00% |
| 35 | 22 | 0,00% |
| 36 | 8 | 0,00% |
| 37 | 3 | 0,00% |
| 38 | 1 | 0,00% |

Trinta por cento dos baralhos de dez cartas acabam em dois passos ou menos; um
único baralho gasta 38.

## O que as medidas me corrigiram

- **Eu apostei que o recordista começaria com a carta mais alta.** A lógica
  parecia óbvia: carta alta na frente, inversão grande, mais trabalho. É o
  contrário, e por um motivo que a tabela deixou à vista — a inversão grande
  *resolve* a carta alta de uma vez. O recordista de doze cartas começa com o 2,
  e o grupo da carta 12 tem o menor máximo de todos.
- **Escrevi 37.721.856 de cabeça** para o quarto degrau de doze cartas, copiando
  o padrão dos degraus menores. O certo é **37.900.800**. O número estava num
  arquivo que existe justamente para impedir chute, e foi a varredura que pegou.
- **Esperava encontrar ganho de potencial igual a 2 em algum lugar**, já que é
  isso que a prova usa. Varri 22 milhões de passos em dez cartas e o mínimo é 4,
  sempre. Só depois achei a razão: a posição 1 nunca está entre as perdas.
- **Achei que o máximo cresceria como a cota, perto de `2^n`.** De dez para doze
  cartas ele vai de 38 para 65, enquanto a cota vai de 1.023 para 4.095.

## Rodar

```bash
node --test testes/*.test.js     # os 37 testes (o pesado leva ~45 s)
node ferramentas/medidor.js      # todas as tabelas
node ferramentas/medidor.js cota # uma tabela só
```

São **37 testes**: 19 de comportamento, 15 prendendo os números das tabelas e 3
na varredura de doze cartas. Sem `npm install`: não há dependência nenhuma.
Node 20 ou mais novo.

## Licença

MIT.
