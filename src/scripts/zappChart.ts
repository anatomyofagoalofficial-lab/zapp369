// ⚡ZAPP custom live chart — the pump.fun pool's real price history, drawn in our
// own brand colors on a canvas (gold on espresso). Data: GeckoTerminal public API.
// If the feed is unreachable, the branded DexScreener iframe fallback stays visible.
import { CA } from './constants';

export function initZappChart() {
  const cv = document.getElementById('zchart') as HTMLCanvasElement | null;
  const fb = document.getElementById('zchart-fb') as HTMLElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d')!;

  async function load() {
    try {
      const pr = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/tokens/${CA}/pools?page=1`);
      const pj = await pr.json();
      const pool = pj?.data?.[0]?.attributes?.address;
      if (!pool) throw 0;
      const or = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/pools/${pool}/ohlcv/hour?aggregate=1&limit=96&currency=usd`);
      const oj = await or.json();
      const rows: number[][] = oj?.data?.attributes?.ohlcv_list;
      if (!rows || rows.length < 3) throw 0;
      rows.sort((a, b) => a[0] - b[0]);
      draw(rows);
      fb?.remove();                      // our chart took over — drop the fallback embed
      cv.style.display = 'block';
    } catch { /* keep the fallback iframe */ }
  }

  function draw(rows: number[][]) {
    const DPR = Math.min(devicePixelRatio || 1, 2);
    const W = cv.offsetWidth || 900, H = cv.offsetHeight || 420;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const closes = rows.map(r => r[4]);
    const lo = Math.min(...closes), hi = Math.max(...closes), span = (hi - lo) || hi * 0.1 || 1;
    const PL = 14, PR2 = 86, PT = 26, PB = 30;
    const x = (i: number) => PL + (i / (closes.length - 1)) * (W - PL - PR2);
    const y = (v: number) => PT + (1 - (v - lo) / span) * (H - PT - PB);

    ctx.fillStyle = '#04160E'; ctx.fillRect(0, 0, W, H);
    // 3 horizontal gridlines with price labels (3·6·9 of the frame)
    ctx.strokeStyle = 'rgba(94,155,130,.1)'; ctx.fillStyle = 'rgba(166,240,200,.6)';
    ctx.font = '10px JetBrains Mono, monospace'; ctx.textAlign = 'left';
    [0.25, 0.5, 0.75].forEach(f => {
      const vy = PT + f * (H - PT - PB);
      ctx.beginPath(); ctx.moveTo(PL, vy); ctx.lineTo(W - PR2, vy); ctx.stroke();
      const pv = hi - f * span;
      ctx.fillText('$' + (pv < 0.001 ? pv.toFixed(8) : pv.toFixed(5)), W - PR2 + 8, vy + 3);
    });
    // golden area fill under the line
    const g = ctx.createLinearGradient(0, PT, 0, H - PB);
    g.addColorStop(0, 'rgba(94,155,130,.32)'); g.addColorStop(1, 'rgba(94,155,130,0)');
    ctx.beginPath(); ctx.moveTo(x(0), y(closes[0]));
    closes.forEach((v, i) => ctx.lineTo(x(i), y(v)));
    ctx.lineTo(x(closes.length - 1), H - PB); ctx.lineTo(x(0), H - PB); ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    // the frequency line itself
    ctx.beginPath(); ctx.moveTo(x(0), y(closes[0]));
    closes.forEach((v, i) => ctx.lineTo(x(i), y(v)));
    ctx.strokeStyle = '#5E9B82'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
    // live tip: pulsing gold node + last price
    const lx = x(closes.length - 1), ly = y(closes[closes.length - 1]);
    ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fillStyle = '#A7CBB6'; ctx.fill();
    const last = closes[closes.length - 1], first = closes[0];
    const chg = ((last - first) / first) * 100;
    ctx.font = '700 13px JetBrains Mono, monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = '#A7CBB6';
    ctx.fillText('$' + (last < 0.001 ? last.toFixed(8) : last.toFixed(5)), PL + 2, PT - 8);
    ctx.fillStyle = chg >= 0 ? '#5E9B82' : '#D98A3A';
    ctx.fillText((chg >= 0 ? '+' : '') + chg.toFixed(1) + '% · 4d', PL + 124, PT - 8);
  }

  load();
  setInterval(load, 120000);   // refresh every 2 minutes
  addEventListener('resize', () => load(), { passive: true });
}
