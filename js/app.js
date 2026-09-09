// Comportamento do dashboard FUP Prioridades.
// Renderiza KPIs, grafico de evolucao, faixas de atraso e ranking.
// Dados estaticos e agregados (sem dado pessoal); uso de textContent/createElement.

import { serie, rankingAtual } from './data.js';

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

  // grades horizontais
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

  // rotulos de data
  serie.forEach((ponto, i) => {
    const t = svgEl('text', { x: pontoX(i), y: altura - 12, 'text-anchor': 'middle', 'font-size': 11, fill: COR.texto });
    t.textContent = ponto.rotulo;
    svg.appendChild(t);
  });

  // legenda
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
    const largB13 = (d.b13 / maxTotal) * 100;
    const largM3 = (d.m3 / maxTotal) * 100;
    if (d.b13 > 0) {
      const seg = el('span', 'aging__seg aging__seg--b13');
      seg.style.width = `${largB13}%`;
      barra.appendChild(seg);
    }
    if (d.m3 > 0) {
      const seg = el('span', 'aging__seg aging__seg--m3');
      seg.style.width = `${largM3}%`;
      barra.appendChild(seg);
    }
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
}

document.addEventListener('DOMContentLoaded', iniciar);
