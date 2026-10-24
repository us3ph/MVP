import { fmtAmount, fmtMonth, parseISO } from '../lib/format';
import { estimatedCost } from '../lib/costing';

// Sparkline path from the mockup (1000x110 box).
const SPARK =
  'M0,98.0 L8,98.0 L16,98.0 L24,98.0 L32,98.0 L40,98.0 L48,98.0 L56,98.0 L64,98.0 L72,98.0 L80,98.0 L88,97.9 L96,97.7 L104,97.3 L112,96.5 L120,95.1 L128,92.7 L136,89.0 L144,83.8 L152,77.3 L160,69.8 L168,62.2 L176,55.8 L184,51.7 L192,50.6 L200,52.5 L208,56.7 L216,61.9 L224,66.6 L232,69.2 L240,68.6 L248,64.4 L256,56.9 L264,46.9 L272,35.8 L280,25.2 L288,17.0 L296,12.5 L304,12.6 L312,17.2 L320,25.7 L328,36.8 L336,49.0 L344,60.9 L352,71.4 L360,80.0 L368,86.4 L376,91.0 L384,94.0 L392,95.8 L400,96.9 L408,97.5 L416,97.7 L424,97.9 L432,98.0 L440,98.0 L448,98.0 L456,98.0 L464,98.0 L472,98.0 L480,98.0 L488,97.9 L496,97.8 L504,97.7 L512,97.4 L520,96.9 L528,96.2 L536,95.2 L544,93.7 L552,91.7 L560,89.2 L568,86.1 L576,82.7 L584,79.1 L592,75.6 L600,72.6 L608,70.3 L616,69.2 L624,69.2 L632,70.3 L640,72.6 L648,75.6 L656,79.1 L664,82.7 L672,86.1 L680,89.2 L688,91.7 L696,93.7 L704,95.2 L712,96.2 L720,96.9 L728,97.4 L736,97.7 L744,97.8 L752,97.9 L760,97.9 L768,97.9 L776,97.8 L784,97.7 L792,97.3 L800,96.7 L808,95.7 L816,94.0 L824,91.6 L832,88.4 L840,84.4 L848,79.9 L856,75.4 L864,71.6 L872,68.9 L880,68.0 L888,68.9 L896,71.6 L904,75.4 L912,79.9 L920,84.4 L928,88.4 L936,91.6 L944,94.0 L952,95.7 L960,96.7 L968,97.3 L976,97.7 L984,97.9 L992,97.9 L1000,98.0';

export default function CostCard({ missions, referentials }) {
  const total = referentials ? missions.reduce((sum, m) => sum + estimatedCost(m, referentials), 0) : 0;
  const enCours = missions.filter((m) => m.status === 'pending').length;
  const dates = missions.flatMap((m) => [parseISO(m.startDate), parseISO(m.endDate)]).filter(Boolean);
  const first = dates.length ? new Date(Math.min(...dates)) : new Date();
  const last = dates.length ? new Date(Math.max(...dates)) : new Date();

  return (
    <section className="c cost">
      <div className="lab">COÛT GLOBAL ESTIMÉ</div>
      <div className="cost-row">
        <span className="cost-big">
          {fmtAmount(total)}
          <span className="cost-cur">DH</span>
        </span>
        <span className="cost-trend">▲ {enCours} en cours</span>
      </div>
      <div className="cost-sub">
        sur {missions.length} ordres de mission · {fmtMonth(first)} – {fmtMonth(last)}
      </div>
      <svg className="spark" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6A60F0" stopOpacity=".4" />
            <stop offset="1" stopColor="#6A60F0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${SPARK} L1000,110 L0,110 Z`} fill="url(#ar)" />
        <path d={SPARK} fill="none" stroke="#5B52EE" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="cost-foot">Total estimé sur tous les ordres</div>
    </section>
  );
}
