// Dados consolidados do FUP Prioridades (P4 - somente CSS).
// Fonte: exports "priorizacao_trocas" tratados manualmente.
// Faixas de atraso derivadas de Dias_atraso: 1 a 3 dias e mais de 3 dias.
// Nenhum dado pessoal - apenas nomes de concessionarias e contagens agregadas.

export const serie = [
  { data: '02/09', rotulo: '02/09', conc: 14, sol: 106, equip: 353, b13: 156, m3: 197 },
  { data: '04/09', rotulo: '04/09', conc: 14, sol: 99,  equip: 327, b13: 145, m3: 182 },
  { data: '08/09', rotulo: '08/09', conc: 13, sol: 88,  equip: 280, b13: 0,   m3: 280 },
  { data: '09/09', rotulo: '09/09', conc: 15, sol: 73,  equip: 241, b13: 62,  m3: 179 }
];

export const rankingAtual = [
  { nome: 'NIGRO',            b13: 24, m3: 58, equip: 82, sol: 32 },
  { nome: 'KARIRI EMP.',      b13: 10, m3: 50, equip: 60, sol: 10 },
  { nome: 'FORKMAX',          b13: 16, m3: 43, equip: 59, sol: 10 },
  { nome: 'EMPILHASERV',      b13: 6,  m3: 6,  equip: 12, sol: 3 },
  { nome: 'EMPILHAPARA',      b13: 4,  m3: 2,  equip: 6,  sol: 3 },
  { nome: 'EMPILOG CASCAVEL', b13: 0,  m3: 6,  equip: 6,  sol: 3 },
  { nome: 'JR HIDRAULICOS',   b13: 0,  m3: 4,  equip: 4,  sol: 3 },
  { nome: 'BAIANA EQUIP.',    b13: 0,  m3: 3,  equip: 3,  sol: 2 },
  { nome: 'BHM',              b13: 0,  m3: 2,  equip: 2,  sol: 1 },
  { nome: 'NIGRO MANAUS',     b13: 0,  m3: 2,  equip: 2,  sol: 1 },
  { nome: 'AGRS',             b13: 1,  m3: 0,  equip: 1,  sol: 1 },
  { nome: 'BAIANA VDC',       b13: 0,  m3: 1,  equip: 1,  sol: 1 },
  { nome: 'EMPILOG CHAPECO',  b13: 0,  m3: 1,  equip: 1,  sol: 1 },
  { nome: 'PIAUI EMP',        b13: 1,  m3: 0,  equip: 1,  sol: 1 },
  { nome: 'STAMM',            b13: 0,  m3: 1,  equip: 1,  sol: 1 }
];

// Comparativo diario: ontem (08/09) x hoje (09/09). Duas barras por concessionaria.
// hb13/hm3 = faixas de hoje; om3 = faixa >3 de ontem (ontem nao teve 1-3 dias).
export const comparativo = {
  ontem: '08/09',
  hoje: '09/09',
  totais: {
    equipOntem: 280, equipHoje: 241,
    b13Ontem: 0,   b13Hoje: 62,
    m3Ontem: 280,  m3Hoje: 179,
    solOntem: 88,  solHoje: 73
  },
  linhas: [
    { nome: 'NIGRO',            hb13: 24, hm3: 58, ob13: 0, om3: 116, ontem: 116, hoje: 82 },
    { nome: 'KARIRI EMP.',      hb13: 10, hm3: 50, ob13: 0, om3: 50,  ontem: 50,  hoje: 60 },
    { nome: 'FORKMAX',          hb13: 16, hm3: 43, ob13: 0, om3: 43,  ontem: 43,  hoje: 59 },
    { nome: 'EMPILHASERV',      hb13: 6,  hm3: 6,  ob13: 0, om3: 6,   ontem: 6,   hoje: 12 },
    { nome: 'EMPILOG CASCAVEL', hb13: 0,  hm3: 6,  ob13: 0, om3: 6,   ontem: 6,   hoje: 6 },
    { nome: 'EMPILHAPARA',      hb13: 4,  hm3: 2,  ob13: 0, om3: 2,   ontem: 2,   hoje: 6 },
    { nome: 'JR HIDRAULICOS',   hb13: 0,  hm3: 4,  ob13: 0, om3: 4,   ontem: 4,   hoje: 4 },
    { nome: 'BAIANA EQUIP.',    hb13: 0,  hm3: 3,  ob13: 0, om3: 23,  ontem: 23,  hoje: 3 },
    { nome: 'BHM',              hb13: 0,  hm3: 2,  ob13: 0, om3: 18,  ontem: 18,  hoje: 2 },
    { nome: 'NIGRO MANAUS',     hb13: 0,  hm3: 2,  ob13: 0, om3: 2,   ontem: 2,   hoje: 2 },
    { nome: 'EMPILOG CHAPECO',  hb13: 0,  hm3: 1,  ob13: 0, om3: 2,   ontem: 2,   hoje: 1 },
    { nome: 'BAIANA VDC',       hb13: 0,  hm3: 1,  ob13: 0, om3: 5,   ontem: 5,   hoje: 1 },
    { nome: 'AGRS',             hb13: 1,  hm3: 0,  ob13: 0, om3: 0,   ontem: null, hoje: 1 },
    { nome: 'STAMM',            hb13: 0,  hm3: 1,  ob13: 0, om3: 3,   ontem: 3,   hoje: 1 },
    { nome: 'PIAUI EMP',        hb13: 1,  hm3: 0,  ob13: 0, om3: 0,   ontem: null, hoje: 1 }
  ]
};
// Dados consolidados do FUP Prioridades (P4 - somente CSS).
// Fonte: exports "priorizacao_trocas" tratados manualmente.
// Faixas de atraso derivadas de Dias_atraso: 1 a 3 dias e mais de 3 dias.
// Nenhum dado pessoal - apenas nomes de concessionarias e contagens agregadas.

export const serie = [
  { data: '02/09', rotulo: '02/09', conc: 14, sol: 106, equip: 353, b13: 156, m3: 197 },
  { data: '04/09', rotulo: '04/09', conc: 14, sol: 99,  equip: 327, b13: 145, m3: 182 },
  { data: '08/09', rotulo: '08/09', conc: 13, sol: 88,  equip: 280, b13: 0,   m3: 280 },
  { data: '09/09', rotulo: '09/09', conc: 15, sol: 73,  equip: 241, b13: 62,  m3: 179 }
];

export const rankingAtual = [
  { nome: 'NIGRO',            b13: 24, m3: 58, equip: 82, sol: 32 },
  { nome: 'KARIRI EMP.',      b13: 10, m3: 50, equip: 60, sol: 10 },
  { nome: 'FORKMAX',          b13: 16, m3: 43, equip: 59, sol: 10 },
  { nome: 'EMPILHASERV',      b13: 6,  m3: 6,  equip: 12, sol: 3 },
  { nome: 'EMPILHAPARA',      b13: 4,  m3: 2,  equip: 6,  sol: 3 },
  { nome: 'EMPILOG CASCAVEL', b13: 0,  m3: 6,  equip: 6,  sol: 3 },
  { nome: 'JR HIDRAULICOS',   b13: 0,  m3: 4,  equip: 4,  sol: 3 },
  { nome: 'BAIANA EQUIP.',    b13: 0,  m3: 3,  equip: 3,  sol: 2 },
  { nome: 'BHM',              b13: 0,  m3: 2,  equip: 2,  sol: 1 },
  { nome: 'NIGRO MANAUS',     b13: 0,  m3: 2,  equip: 2,  sol: 1 },
  { nome: 'AGRS',             b13: 1,  m3: 0,  equip: 1,  sol: 1 },
  { nome: 'BAIANA VDC',       b13: 0,  m3: 1,  equip: 1,  sol: 1 },
  { nome: 'EMPILOG CHAPECO',  b13: 0,  m3: 1,  equip: 1,  sol: 1 },
  { nome: 'PIAUI EMP',        b13: 1,  m3: 0,  equip: 1,  sol: 1 },
  { nome: 'STAMM',            b13: 0,  m3: 1,  equip: 1,  sol: 1 }
];
