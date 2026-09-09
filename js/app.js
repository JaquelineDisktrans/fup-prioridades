// Comportamento do dashboard FUP Prioridades.
// Renderiza KPIs, grafico de evolucao, faixas de atraso, ranking e comparativo diario.
// Dados estaticos e agregados (sem dado pessoal); uso de textContent/createElement.

import { serie, rankingAtual, comparativo } from './data.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const COR = { azul: '#004C96', laranja: '#F4941D', laranjaClaro: '#F9C58A', medio: '#0A7AC9', linha: '#E4E8EE', texto: '#64748B' };

function el(tag, classe, texto) {
  const node = document.createElement(tag);
  if (classe) { node.className = classe; }
  if (texto !== undefined) { node.textContent = texto; }
  return node;
}

function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
  return node;
}

function formatarDelta(valor, unidade) {
  const sinal = valor > 0 ? '+' : (valor < 0 ? '−' : '±');
  return `${sinal}${Math.abs(valor)}${unidade} vs dia anterior`;
}

// segmento de barra com rotulo de dado embutido
function segmento(classe, largPct, valor) {
  const seg = el('span', `seg ${classe}`);
  seg.style.width = `${largPct}%`;
  if (valor > 0) { seg.appendChild(el('span', 'seg__label', String(valor))); }
  return seg;
}

function montarKpis() {
  const lista = document.getElementById('kpis');
  const atual = serie[serie.length - 1];
  const anterior = serie[serie.length - 2];
  const pctM3 = atual.equip > 0 ? Math.round((atual.m3 / atual.equip) * 100) : 0;
  const pctM3Ant = anterior.equip > 0 ? Math.round((anterior.m3 / anterior.equip) * 100) : 0;

  const cards = [
    { rotulo: 'Equipamentos', valor: atual.equip, delta: atual.equip - anterior.equip, unidade: '', mod: '', baixaBoa: true },
    { rotulo: 'Solicitações', valor: atual.sol, delta: atual.sol - anterior.sol, unidade: '', mod: 'kpi--medio', baixaBoa: true },
    { rotulo: 'Concessionárias', valor: atual.conc, delta: atual.conc - anterior.conc, unidade: '', mod: 'kpi--medio', baixaBoa: true },
    { rotulo: '% em > 3 dias', valor: `${pctM3}%`, delta: pctM3 - pctM3Ant, unidade: 'pp', mod: 'kpi--laranja', baixaBoa: true }
  ];

  cards.forEach((c) => {
    const item = el('li', `kpi ${c.mod}`.trim());
    item.appendChild(el('span', 'kpi__valor', String(c.valor)));
    item.appendChild(el('span', 'kpi__rotulo', c.rotulo));
    const baixa = c.delta < 0;
    const classeDelta = baixa === c.baixaBoa ? 'kpi__delta--baixa' : 'kpi__delta--alta';
    item.appendChild(el('span', `kpi__delta ${classeDelta}`, formatarDelta(c.delta, c.unidade)));
    lista.appendChild(item);
  });
}

function montarGraficoLinha() {
  const largura = 720;
  const altura = 260;
  const margem = { top: 20, right: 20, bottom: 34, left: 40 };
  const areaW = largura - margem.left - margem.right;
  const areaH = altura - margem.top - margem.bottom;
  const maxV = Math.max(...serie.map((d) => d.equip));
  const passoX = areaW / (serie.length - 1);

  const svg = svgEl('svg', { viewBox: `0 0 ${largura} ${altura}`, role: 'img' });
  svg.appendChild(svgEl('title', {})).textContent = 'Evolução de equipamentos e solicitações';

  for (let i = 0; i <= 4; i += 1) {
    const y = margem.top + (areaH / 4) * i;
    svg.appendChild(svgEl('line', { x1: margem.left, y1: y, x2: largura - margem.right, y2: y, stroke: COR.linha, 'stroke-width': 1 }));
    const rotulo = svgEl('text', { x: margem.left - 6, y: y + 4, 'text-anchor': 'end', 'font-size': 10, fill: COR.texto });
    rotulo.textContent = String(Math.round(maxV - (maxV / 4) * i));
    svg.appendChild(rotulo);
  }

  const pontoX = (i) => margem.left + passoX * i;
  const pontoY = (v) => margem.top + areaH - (v / maxV) * areaH;

  const desenharSerie = (chave, cor) => {
    let d = '';
    serie.forEach((ponto, i) => {
      const x = pontoX(i);
      const y = pontoY(ponto[chave]);
      d += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });
    svg.appendChild(svgEl('path', { d: d.trim(), fill: 'none', stroke: cor, 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    serie.forEach((ponto, i) => {
      svg.appendChild(svgEl('circle', { cx: pontoX(i), cy: pontoY(ponto[chave]), r: 4, fill: cor }));
      const t = svgEl('text', { x: pontoX(i), y: pontoY(ponto[chave]) - 9, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: cor });
      t.textContent = String(ponto[chave]);
      svg.appendChild(t);
    });
  };

  desenharSerie('equip', COR.azul);
  desenharSerie('sol', COR.laranja);

  serie.forEach((ponto, i) => {
    const t = svgEl('text', { x: pontoX(i), y: altura - 12, 'text-anchor': 'middle', 'font-size': 11, fill: COR.texto });
    t.textContent = ponto.rotulo;
    svg.appendChild(t);
  });

  const leg = [{ txt: 'Equipamentos', cor: COR.azul, x: margem.left }, { txt: 'Solicitações', cor: COR.laranja, x: margem.left + 130 }];
  leg.forEach((l) => {
    svg.appendChild(svgEl('rect', { x: l.x, y: 4, width: 12, height: 12, rx: 2, fill: l.cor }));
    const t = svgEl('text', { x: l.x + 17, y: 14, 'font-size': 11, fill: COR.texto });
    t.textContent = l.txt;
    svg.appendChild(t);
  });

  document.getElementById('grafico-linha').appendChild(svg);
}

function montarAging() {
  const container = document.getElementById('aging');
  const maxTotal = Math.max(...serie.map((d) => d.equip));

  serie.forEach((d) => {
    const linha = el('div', 'aging__linha');
    linha.appendChild(el('span', 'aging__data', d.rotulo));

    const barra = el('div', 'aging__barra');
    barra.setAttribute('role', 'img');
    barra.setAttribute('aria-label', `${d.rotulo}: ${d.b13} em 1 a 3 dias, ${d.m3} em mais de 3 dias`);
    if (d.b13 > 0) { barra.appendChild(segmento('seg--b13', (d.b13 / maxTotal) * 100, d.b13)); }
    if (d.m3 > 0) { barra.appendChild(segmento('seg--m3', (d.m3 / maxTotal) * 100, d.m3)); }
    linha.appendChild(barra);
    linha.appendChild(el('span', 'aging__total', String(d.equip)));
    container.appendChild(linha);
  });
}

function montarRanking() {
  const corpo = document.querySelector('#ranking tbody');
  rankingAtual.forEach((r, i) => {
    const tr = el('tr');
    tr.appendChild(el('td', 'tabela__pos', String(i + 1)));
    tr.appendChild(el('td', null, r.nome));
    tr.appendChild(el('td', 'tabela__num', String(r.b13)));
    tr.appendChild(el('td', 'tabela__num', String(r.m3)));
    tr.appendChild(el('td', 'tabela__num tabela__equip', String(r.equip)));
    tr.appendChild(el('td', 'tabela__num', String(r.sol)));
    corpo.appendChild(tr);
  });
}

function deltaTexto(ontem, hoje) {
  if (ontem === null || ontem === undefined) { return { txt: 'NOVO', cls: 'delta--alta' }; }
  if (hoje === null || hoje === undefined) { return { txt: 'ZERADO', cls: 'delta--baixa' }; }
  const d = hoje - ontem;
  if (d < 0) { return { txt: `−${Math.abs(d)}`, cls: 'delta--baixa' }; }
  if (d > 0) { return { txt: `+${d}`, cls: 'delta--alta' }; }
  return { txt: '=', cls: 'delta--igual' };
}

function montarComparativo() {
  const c = comparativo;
  const t = c.totais;

  // KPIs do comparativo
  const kp = document.getElementById('cmp-kpis');
  const cards = [
    { rotulo: 'Total equip.', ontem: t.equipOntem, hoje: t.equipHoje, mod: '', baixaBoa: true },
    { rotulo: 'Atraso 1 a 3 dias', ontem: t.b13Ontem, hoje: t.b13Hoje, mod: 'kpi--claro', baixaBoa: true },
    { rotulo: 'Atraso > 3 dias', ontem: t.m3Ontem, hoje: t.m3Hoje, mod: 'kpi--laranja', baixaBoa: true },
    { rotulo: 'Solicitações', ontem: t.solOntem, hoje: t.solHoje, mod: 'kpi--medio', baixaBoa: true }
  ];
  cards.forEach((k) => {
    const d = k.hoje - k.ontem;
    const baixa = d < 0;
    const classeDelta = d === 0 ? 'kpi__delta--igual' : (baixa === k.baixaBoa ? 'kpi__delta--baixa' : 'kpi__delta--alta');
    const item = el('li', `kpi ${k.mod}`.trim());
    item.appendChild(el('span', 'kpi__valor', String(k.hoje)));
    item.appendChild(el('span', 'kpi__rotulo', k.rotulo));
    const sd = (d > 0 ? '+' : (d < 0 ? '−' : '±')) + Math.abs(d);
    item.appendChild(el('span', `kpi__delta ${classeDelta}`, `${sd} · ontem: ${k.ontem}`));
    kp.appendChild(item);
  });

  // linhas com duas barras (H hoje / O ontem)
  const corpo = document.getElementById('cmp-linhas');
  const cab = el('div', 'cmp__row cmp__head');
  cab.appendChild(el('span', 'cmp__pos', ''));
  cab.appendChild(el('span', 'cmp__nome', 'Concessionária'));
  cab.appendChild(el('span', 'cmp__barras', 'Equip. por faixa'));
  cab.appendChild(el('span', 'cmp__val', 'Ontem'));
  cab.appendChild(el('span', 'cmp__val', 'Hoje'));
  cab.appendChild(el('span', 'cmp__delta', 'Δ'));
  corpo.appendChild(cab);
  const maxV = Math.max(...c.linhas.map((l) => Math.max(l.ontem || 0, l.hoje || 0)));
  c.linhas.forEach((l, i) => {
    const row = el('div', 'cmp__row');
    row.appendChild(el('span', 'cmp__pos', String(i + 1).padStart(2, '0')));
    row.appendChild(el('span', 'cmp__nome', l.nome));

    const barras = el('div', 'cmp__barras');
    // hoje
    const bH = el('div', 'cmp__barra');
    bH.appendChild(el('span', 'cmp__tag', 'H'));
    const trilhoH = el('div', 'cmp__trilho');
    if (l.hb13 > 0) { trilhoH.appendChild(segmento('seg--b13', (l.hb13 / maxV) * 100, l.hb13)); }
    if (l.hm3 > 0) { trilhoH.appendChild(segmento('seg--m3', (l.hm3 / maxV) * 100, l.hm3)); }
    bH.appendChild(trilhoH);
    barras.appendChild(bH);
    // ontem
    const bO = el('div', 'cmp__barra cmp__barra--ontem');
    bO.appendChild(el('span', 'cmp__tag cmp__tag--ontem', 'O'));
    const trilhoO = el('div', 'cmp__trilho');
    if (l.ob13 > 0) { trilhoO.appendChild(segmento('seg--b13c', (l.ob13 / maxV) * 100, l.ob13)); }
    if (l.om3 > 0) { trilhoO.appendChild(segmento('seg--m3c', (l.om3 / maxV) * 100, l.om3)); }
    bO.appendChild(trilhoO);
    barras.appendChild(bO);
    row.appendChild(barras);

    row.appendChild(el('span', 'cmp__val cmp__val--ontem', l.ontem === null ? '—' : String(l.ontem)));
    row.appendChild(el('span', 'cmp__val cmp__val--hoje', l.hoje === null ? '—' : String(l.hoje)));
    const dt = deltaTexto(l.ontem, l.hoje);
    row.appendChild(el('span', `cmp__delta ${dt.cls}`, dt.txt));
    corpo.appendChild(row);
  });
}

function montarTextos() {
  const primeira = serie[0].rotulo;
  const ultima = serie[serie.length - 1].rotulo;
  document.getElementById('periodo').textContent = `Período: ${primeira} a ${ultima}`;
  document.getElementById('atualizado').textContent = `Atualizado em ${ultima}`;
}

function iniciar() {
  montarTextos();
  montarKpis();
  montarGraficoLinha();
  montarAging();
  montarRanking();
  montarComparativo();
}

document.addEventListener('DOMContentLoaded', iniciar);
