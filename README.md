# FUP Prioridades — Disktrans

Dashboard básico de acompanhamento do FUP de prioridades (P4) das trocas de equipamentos, considerando **somente as CSS** (concessionárias — exclui matriz, CDs e filiais Disktrans).

## O que mostra

- **Posição atual** (KPIs): equipamentos, solicitações, concessionárias e % em atraso > 3 dias, com variação vs. o dia anterior.
- **Evolução do volume**: equipamentos e solicitações ao longo das datas.
- **Faixas de atraso por data**: atraso de 1 a 3 dias × mais de 3 dias.
- **Ranking de concessionárias** do dia mais recente.

## Estrutura

```
fup-prioridades/
├── index.html          Estrutura da página
├── css/
│   └── styles.css       Padrão visual Disktrans (mobile-first)
├── js/
│   ├── data.js          Série consolidada dos snapshots (dados agregados)
│   └── app.js           Renderização (ES module)
└── README.md
```

## Como rodar

Por usar ES modules, sirva por HTTP (não abra via `file://`):

```bash
# Python
python -m http.server 8000
# ou Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## Dados

A série em `js/data.js` é alimentada manualmente a partir dos exports `priorizacao_trocas`.
Datas atuais: 02/09, 04/09, 08/09 e 09/09. Para atualizar, some por concessionária os
equipamentos por faixa de `Dias_atraso` (1–3 e >3), filtrando `Prioridade = P4` e
concessionárias que **não** começam com "DISKTRANS", e acrescente uma nova entrada em `serie`.

Contém apenas dados agregados (nomes de concessionárias e contagens) — nenhum dado pessoal.
