import type { Candle } from "@/lib/chart";

/**
 * A bespoke ⚡ZAPP candlestick chart, rendered as pure SVG — no third-party
 * widget, no charting library. Gold up-candles, signal-blue down-candles, on
 * the cosmic-navy panel. Server component; the container sets the aspect ratio
 * so the SVG scales without distortion.
 */
const W = 1000;
const H = 420;
const PAD = { top: 24, right: 16, bottom: 16, left: 16 };
const UP = "#FFD700"; // ⚡ZAPP gold
const DOWN = "#3B82F6"; // signal blue

export function BrandChart({ candles }: { candles: Candle[] }) {
  const highs = candles.map((c) => c.h);
  const lows = candles.map((c) => c.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = candles.length;
  const slot = innerW / n;
  const bodyW = Math.max(1.5, slot * 0.6);

  const x = (i: number) => PAD.left + slot * i + slot / 2;
  const y = (price: number) => PAD.top + ((max - price) / range) * innerH;

  const last = candles[n - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="⚡ZAPP price candlestick chart"
    >
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + f * innerH}
          y2={PAD.top + f * innerH}
          stroke="#FFFFFF"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      ))}

      {/* candles */}
      {candles.map((c, i) => {
        const cx = x(i);
        const isUp = c.c >= c.o;
        const color = isUp ? UP : DOWN;
        const yOpen = y(c.o);
        const yClose = y(c.c);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(1, Math.abs(yClose - yOpen));
        return (
          <g key={i}>
            <line
              x1={cx}
              x2={cx}
              y1={y(c.h)}
              y2={y(c.l)}
              stroke={color}
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            <rect
              x={cx - bodyW / 2}
              y={top}
              width={bodyW}
              height={bodyH}
              fill={color}
              fillOpacity={isUp ? 0.95 : 0.75}
            />
          </g>
        );
      })}

      {/* last-price guide line */}
      {last ? (
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={y(last.c)}
          y2={y(last.c)}
          stroke={UP}
          strokeOpacity="0.5"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
      ) : null}
    </svg>
  );
}
