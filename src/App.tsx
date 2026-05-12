import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import {
  Copy,
  Download,
  Sun,
  Moon,
  Check,
  AlertCircle,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Github,
  FileDown,
  Link2,
} from 'lucide-react';

const SAMPLE =
  'M 854 506 C 854 694.3 700.3 848 512 848 C 323.7 848 170 694.3 170 506 C 170 317.7 323.7 164 512 164 C 700.3 164 854 317.7 854 506 Z M 512 320 C 406.7 320 322 404.7 322 510 C 322 615.3 406.7 700 512 700 C 617.3 700 702 615.3 702 510 C 702 404.7 617.3 320 512 320 Z';

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
.app{height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--tx);transition:background .2s,color .2s}
.dark{--bg:#0c0c0c;--sf:#151515;--sf2:#1d1d1d;--bd:rgba(255,255,255,0.07);--bd2:rgba(255,255,255,0.13);--tx:#e4e4e9;--tx2:#8e8e93;--tx3:#3a3a3c;--ac:#2563eb;--ach:#3b73f5;--acg:rgba(37,99,235,0.18);--er:#ff453a;--ok:#32d74b;--cmd:#ff9f0a;--num:#5ac8fa}
.light{--bg:#f2f2f7;--sf:#fff;--sf2:#e5e5ea;--bd:rgba(0,0,0,0.08);--bd2:rgba(0,0,0,0.14);--tx:#1c1c1e;--tx2:#636366;--tx3:#c7c7cc;--ac:#0071e3;--ach:#0077ed;--acg:rgba(0,113,227,0.13);--er:#ff3b30;--ok:#1a9e3a;--cmd:#c93c20;--num:#0070c9}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:44px;background:var(--sf);border-bottom:1px solid var(--bd);flex-shrink:0}
.logo{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;letter-spacing:-.3px;color:var(--tx)}
.badge{font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;background:var(--ac);color:#fff;letter-spacing:.8px;text-transform:uppercase}
.split{flex:1;display:flex;overflow:hidden;min-height:0}
.pl{width:43%;min-width:270px;display:flex;flex-direction:column;border-right:1px solid var(--bd)}
.pr{flex:1;display:flex;flex-direction:column;min-width:0}
.ph{display:flex;align-items:center;justify-content:space-between;padding:0 12px;height:33px;background:var(--sf);border-bottom:1px solid var(--bd);flex-shrink:0}
.ptl{font-size:10px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--tx2)}
.ew{flex:1;position:relative;overflow:hidden}
.mir{position:absolute;inset:0;padding:11px 12px;font-family:'SF Mono','Fira Code',Consolas,monospace;font-size:12px;line-height:1.75;white-space:pre-wrap;word-break:break-all;overflow:hidden;pointer-events:none;color:var(--tx)}
.mir .cmd{color:var(--cmd);font-weight:600}
.mir .num{color:var(--num)}
.ta{position:absolute;inset:0;padding:11px 12px;font-family:'SF Mono','Fira Code',Consolas,monospace;font-size:12px;line-height:1.75;background:transparent;color:transparent;caret-color:var(--tx);border:none;outline:none;resize:none;white-space:pre-wrap;word-break:break-all;overflow:auto}
.ph0{position:absolute;inset:0;padding:11px 12px;font-family:'SF Mono',monospace;font-size:12px;line-height:1.75;color:var(--tx3);pointer-events:none}
.eb{display:flex;align-items:center;gap:5px;padding:5px 12px;background:rgba(255,59,48,.08);border-top:1px solid rgba(255,59,48,.2);font-size:11px;color:var(--er);flex-shrink:0}
.stats{display:flex;background:var(--sf);border-top:1px solid var(--bd);flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.stats::-webkit-scrollbar{display:none}
.si{display:flex;flex-direction:column;gap:1px;padding:6px 11px;border-right:1px solid var(--bd)}
.sl{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--tx3);white-space:nowrap}
.sv{font-size:12px;font-weight:600;color:var(--tx);font-variant-numeric:tabular-nums;white-space:nowrap}
.sv.ok{color:var(--ok)}
.bar{display:flex;align-items:center;gap:5px;padding:8px 12px;background:var(--sf);border-top:1px solid var(--bd);flex-shrink:0;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:3px;padding:4px 9px;border-radius:6px;border:1px solid var(--bd2);background:var(--sf2);color:var(--tx);font-size:11px;font-weight:500;cursor:pointer;transition:background .1s,border-color .1s,color .1s;white-space:nowrap;font-family:inherit;line-height:1.2}
.btn:hover:not(:disabled){background:var(--bd2)}
.btn:disabled{opacity:.35;cursor:default}
.btn.pri{background:var(--ac);border-color:var(--ac);color:#fff}
.btn.pri:hover:not(:disabled){background:var(--ach);border-color:var(--ach)}
.btn.ico{padding:4px}
.btn.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
.btn.ghost{border-color:transparent;background:transparent;color:var(--tx2)}
.btn.ghost:hover:not(:disabled){background:var(--bd);color:var(--tx)}
.tbr{display:flex;align-items:center;gap:5px;padding:7px 12px;background:var(--sf);border-bottom:1px solid var(--bd);flex-shrink:0;flex-wrap:wrap}
.tg{display:flex;align-items:center;gap:1px;padding:2px;background:var(--sf2);border:1px solid var(--bd);border-radius:7px}
.tg .btn{border:none;background:transparent;border-radius:5px;padding:3px 8px;font-size:10.5px}
.tg .btn.on{background:var(--ac);color:#fff}
.dvd{width:1px;height:14px;background:var(--bd2);margin:0 1px;flex-shrink:0}
.cw{flex:1;position:relative;overflow:hidden;cursor:grab;user-select:none}
.cw:active{cursor:grabbing}
.vbc{display:flex;align-items:center;gap:5px;padding:7px 12px;background:var(--sf);border-top:1px solid var(--bd);flex-shrink:0;flex-wrap:wrap}
.vbl{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--tx3);white-space:nowrap}
.vbi{width:56px;padding:2px 6px;border-radius:4px;border:1px solid var(--bd2);background:var(--sf2);color:var(--tx);font-size:10.5px;font-family:'SF Mono',monospace;font-variant-numeric:tabular-nums;outline:none;text-align:right}
.vbi:focus{border-color:var(--ac)}
.vbi:disabled{opacity:.35}
.ftr{display:flex;align-items:center;justify-content:center;gap:6px;height:30px;background:var(--sf);border-top:1px solid var(--bd);font-size:10px;color:var(--tx2);flex-shrink:0}
.ftr a{display:flex;align-items:center;gap:3px;color:var(--ac);text-decoration:none;font-weight:500}
.ftr a:hover{text-decoration:underline}
.csw{width:14px;height:14px;border-radius:3px;border:1px solid var(--bd2);position:relative;overflow:hidden;flex-shrink:0;cursor:pointer}
.csw input[type=color]{position:absolute;inset:-5px;width:28px;height:28px;border:none;cursor:pointer;opacity:0}
.emp{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;pointer-events:none}
.emp svg{opacity:.12}
.emp p{font-size:11px;color:var(--tx3);text-align:center;line-height:1.6}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:2px}
input[type=range]{accent-color:var(--ac);cursor:pointer}
`;

// ── Utils ───────────────────────────────────────────────────────────────────
const sanitize = (d, dec) =>
  !d?.trim()
    ? ''
    : d
        .replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi, (n) => {
          const v = parseFloat(n);
          return isNaN(v) ? n : +v.toFixed(dec) + '';
        })
        .replace(/\s*([MmLlHhVvCcSsQqTtAaZz])\s*/g, ' $1 ')
        .replace(/\s+/g, ' ')
        .trim();

const byteSize = (s) => new TextEncoder().encode(s).length;
const cmdCount = (d) => (d?.match(/[MmLlHhVvCcSsQqTtAaZz]/g) || []).length;
const NS = 'http://www.w3.org/2000/svg';

const getPathMeta = (d) => {
  if (!d?.trim()) return null;
  try {
    const svg = document.createElementNS(NS, 'svg'),
      path = document.createElementNS(NS, 'path');
    Object.assign(svg.style, {
      position: 'fixed',
      top: '-9999px',
      left: '-9999px',
      width: '1px',
      height: '1px',
      visibility: 'hidden',
    });
    path.setAttribute('d', d);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const bb = path.getBBox(),
      len = path.getTotalLength();
    document.body.removeChild(svg);
    return isFinite(bb.width)
      ? {
          x: bb.x,
          y: bb.y,
          w: Math.max(bb.width, 0.1),
          h: Math.max(bb.height, 0.1),
          len,
        }
      : null;
  } catch {
    return null;
  }
};

const parseAnchors = (d) => {
  if (!d?.trim()) return [];
  const pts = [],
    re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let m,
    cx = 0,
    cy = 0;
  const p = (x, y, t) => pts.push({ x, y, t });
  while ((m = re.exec(d))) {
    const cmd = m[1],
      a = m[2]
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);
    switch (cmd) {
      case 'M':
        for (let i = 0; i < a.length; i += 2) {
          cx = a[i];
          cy = a[i + 1];
          p(cx, cy, 'mv');
        }
        break;
      case 'm':
        for (let i = 0; i < a.length; i += 2) {
          cx += a[i];
          cy += a[i + 1];
          p(cx, cy, 'mv');
        }
        break;
      case 'L':
        for (let i = 0; i < a.length; i += 2) {
          cx = a[i];
          cy = a[i + 1];
          p(cx, cy, 'an');
        }
        break;
      case 'l':
        for (let i = 0; i < a.length; i += 2) {
          cx += a[i];
          cy += a[i + 1];
          p(cx, cy, 'an');
        }
        break;
      case 'H':
        cx = a[0];
        p(cx, cy, 'an');
        break;
      case 'h':
        cx += a[0];
        p(cx, cy, 'an');
        break;
      case 'V':
        cy = a[0];
        p(cx, cy, 'an');
        break;
      case 'v':
        cy += a[0];
        p(cx, cy, 'an');
        break;
      case 'C':
        for (let i = 0; i < a.length; i += 6) {
          p(a[i], a[i + 1], 'ct');
          p(a[i + 2], a[i + 3], 'ct');
          cx = a[i + 4];
          cy = a[i + 5];
          p(cx, cy, 'cu');
        }
        break;
      case 'c':
        for (let i = 0; i < a.length; i += 6) {
          p(cx + a[i], cy + a[i + 1], 'ct');
          p(cx + a[i + 2], cy + a[i + 3], 'ct');
          cx += a[i + 4];
          cy += a[i + 5];
          p(cx, cy, 'cu');
        }
        break;
      case 'Q':
        for (let i = 0; i < a.length; i += 4) {
          p(a[i], a[i + 1], 'ct');
          cx = a[i + 2];
          cy = a[i + 3];
          p(cx, cy, 'cu');
        }
        break;
      case 'q':
        for (let i = 0; i < a.length; i += 4) {
          p(cx + a[i], cy + a[i + 1], 'ct');
          cx += a[i + 2];
          cy += a[i + 3];
          p(cx, cy, 'cu');
        }
        break;
      case 'S':
        for (let i = 0; i < a.length; i += 4) {
          p(a[i], a[i + 1], 'ct');
          cx = a[i + 2];
          cy = a[i + 3];
          p(cx, cy, 'cu');
        }
        break;
      case 's':
        for (let i = 0; i < a.length; i += 4) {
          p(cx + a[i], cy + a[i + 1], 'ct');
          cx += a[i + 2];
          cy += a[i + 3];
          p(cx, cy, 'cu');
        }
        break;
    }
  }
  return pts;
};

const hlStr = (d) =>
  !d
    ? ''
    : d
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/([MmLlHhVvCcSsQqTtAaZz])/g, '<span class="cmd">$1</span>')
        .replace(/(-?\d*\.?\d+(?:e[+-]?\d+)?)/g, '<span class="num">$1</span>');

const extractD = (raw) => {
  if (!raw) return '';
  const m = raw.match(/\bd=["']([^"']+)["']/);
  return m ? m[1] : raw.trim();
};

// ── PathCanvas ──────────────────────────────────────────────────────────────
const PathCanvas = memo(function PathCanvas({
  d,
  color,
  mode,
  showAnchors,
  showArrows,
  animProg,
  meta,
  dark,
  vb,
  onVbChange,
}) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const drag = useRef(null);
  const vbRef = useRef(vb);
  const [arrows, setArrows] = useState([]);
  const [hov, setHov] = useState(null);
  const anchors = useMemo(() => parseAnchors(d), [d]);

  useEffect(() => {
    vbRef.current = vb;
  }, [vb]);

  useEffect(() => {
    if (!pathRef.current || !meta || !showArrows || !d) {
      setArrows([]);
      return;
    }
    const len = meta.len;
    if (len < 1) {
      setArrows([]);
      return;
    }
    const n = Math.max(3, Math.min(12, Math.floor(len / 20)));
    const pts = [];
    for (let i = 1; i <= n; i++) {
      const t = (i / (n + 1)) * len;
      const p0 = pathRef.current.getPointAtLength(Math.max(0, t - 0.8));
      const p1 = pathRef.current.getPointAtLength(Math.min(len, t + 0.8));
      const pm = pathRef.current.getPointAtLength(t);
      pts.push({
        x: pm.x,
        y: pm.y,
        angle: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI,
      });
    }
    setArrows(pts);
  }, [d, meta, showArrows]);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    drag.current = { sx: e.clientX, sy: e.clientY, vb: { ...vbRef.current } };
  };

  useEffect(() => {
    const mm = (e) => {
      if (!drag.current) return;
      const dr = drag.current,
        rect = svgRef.current?.getBoundingClientRect();
      if (!rect || !dr.vb) return;
      onVbChange({
        ...dr.vb,
        x: dr.vb.x - (e.clientX - dr.sx) * (dr.vb.w / rect.width),
        y: dr.vb.y - (e.clientY - dr.sy) * (dr.vb.h / rect.height),
      });
    };
    const mu = () => {
      drag.current = null;
    };
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', mu);
    return () => {
      document.removeEventListener('mousemove', mm);
      document.removeEventListener('mouseup', mu);
    };
  }, [onVbChange]);

  const onWheel = useCallback(
    (e) => {
      e.preventDefault();
      const cur = vbRef.current;
      if (!cur || !svgRef.current) return;
      const f = e.deltaY > 0 ? 1.1 : 0.9;
      const rect = svgRef.current.getBoundingClientRect();
      const mx = cur.x + ((e.clientX - rect.left) / rect.width) * cur.w;
      const my = cur.y + ((e.clientY - rect.top) / rect.height) * cur.h;
      onVbChange({
        x: mx + (cur.x - mx) * f,
        y: my + (cur.y - my) * f,
        w: cur.w * f,
        h: cur.h * f,
      });
    },
    [onVbChange]
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  if (!vb)
    return (
      <div className="cw" style={{ cursor: 'default' }}>
        <div className="emp">
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <p>
            Paste an SVG path to get started
            <br />
            or load the sample
          </p>
        </div>
      </div>
    );

  const fill = mode === 'stroke' ? 'none' : color;
  const stroke = mode === 'fill' ? 'none' : color;
  const sw = vb.w / 320;
  const sz = Math.max(vb.w, vb.h);
  const gs = Math.pow(10, Math.floor(Math.log10(sz)) - 1) || 0.1;
  const gm = gs * 10;
  const as = vb.w / 65;

  return (
    <div className="cw" onMouseDown={onMouseDown}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        style={{ display: 'block', userSelect: 'none' }}
      >
        <defs>
          <pattern id="gn" width={gs} height={gs} patternUnits="userSpaceOnUse">
            <path
              d={`M ${gs} 0 L 0 0 0 ${gs}`}
              fill="none"
              stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
              strokeWidth={sw * 0.5}
            />
          </pattern>
          <pattern id="gM" width={gm} height={gm} patternUnits="userSpaceOnUse">
            <rect width={gm} height={gm} fill="url(#gn)" />
            <path
              d={`M ${gm} 0 L 0 0 0 ${gm}`}
              fill="none"
              stroke={dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)'}
              strokeWidth={sw * 0.7}
            />
          </pattern>
        </defs>
        <rect
          x={vb.x - gm * 2}
          y={vb.y - gm * 2}
          width={vb.w + gm * 4}
          height={vb.h + gm * 4}
          fill="url(#gM)"
        />
        <line
          x1={vb.x - vb.w}
          y1="0"
          x2={vb.x + vb.w * 2}
          y2="0"
          stroke={dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
          strokeWidth={sw * 0.6}
          strokeDasharray={`${sw * 2} ${sw * 3}`}
        />
        <line
          x1="0"
          y1={vb.y - vb.h}
          x2="0"
          y2={vb.y + vb.h * 2}
          stroke={dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
          strokeWidth={sw * 0.6}
          strokeDasharray={`${sw * 2} ${sw * 3}`}
        />

        {d && (
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="none"
            pointerEvents="none"
          />
        )}
        {d && (
          <path
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={animProg >= 1 ? 1 : 0.08}
          />
        )}
        {d && meta?.len && animProg < 1 && (
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={sw * 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={meta.len}
            strokeDashoffset={meta.len * (1 - animProg)}
          />
        )}

        {showArrows &&
          animProg >= 1 &&
          arrows.map((a, i) => (
            <g
              key={i}
              transform={`translate(${a.x},${a.y}) rotate(${a.angle})`}
            >
              <polygon
                points={`${-as} ${-as * 0.55} ${as} 0 ${-as} ${as * 0.55}`}
                fill={color}
                opacity="0.6"
              />
            </g>
          ))}

        {showAnchors &&
          animProg >= 1 &&
          anchors.map((pt, i) => {
            const r = as * (pt.t === 'ct' ? 0.42 : 0.58);
            const isH = hov === i;
            return (
              <g key={i}>
                {pt.t === 'ct' ? (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={sw * 0.5}
                    opacity="0.4"
                  />
                ) : (
                  <g
                    style={{ cursor: 'crosshair' }}
                    onMouseEnter={() => setHov(i)}
                    onMouseLeave={() => setHov(null)}
                  >
                    <rect
                      x={pt.x - r}
                      y={pt.y - r}
                      width={r * 2}
                      height={r * 2}
                      rx={pt.t === 'mv' ? r * 0.25 : r * 0.85}
                      fill={isH ? color : dark ? '#1c1c1e' : '#fff'}
                      stroke={color}
                      strokeWidth={sw * 0.65}
                    />
                  </g>
                )}
                {isH && (
                  <g>
                    <rect
                      x={pt.x + r * 1.5}
                      y={pt.y - as * 1.5}
                      width={as * 5}
                      height={as * 1.6}
                      rx={as * 0.3}
                      fill={dark ? '#1c1c1e' : '#fff'}
                      stroke={color}
                      strokeWidth={sw * 0.5}
                    />
                    <text
                      x={pt.x + r * 1.9}
                      y={pt.y - as * 0.35}
                      fontSize={as * 0.9}
                      fill={color}
                      style={{
                        fontFamily: 'SF Mono,monospace',
                        pointerEvents: 'none',
                      }}
                    >
                      {pt.x.toFixed(1)},{pt.y.toFixed(1)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
});

// ── Main App ────────────────────────────────────────────────────────────────
export default function SVGPathLab() {
  const [dark, setDark] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [raw, setRaw] = useState('');
  const [decimals, setDecimals] = useState(2);
  const [mode, setMode] = useState('both');
  const [color, setColor] = useState('#3b82f6');
  const [showAnchors, setShowAnchors] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animProg, setAnimProg] = useState(1);
  const [copied, setCopied] = useState(null);
  const [vb, setVb] = useState(null);
  const [fitVb, setFitVb] = useState(null);
  const animRef = useRef(null);
  const mirRef = useRef(null);
  const taRef = useRef(null);

  const d = useMemo(() => extractD(raw), [raw]);
  const san = useMemo(() => sanitize(d, decimals), [d, decimals]);
  const meta = useMemo(() => getPathMeta(d), [d]);
  const err = useMemo(
    () => (d && !meta ? 'Invalid SVG path — check your d="…" string' : null),
    [d, meta]
  );
  const origB = useMemo(() => byteSize(d), [d]);
  const sanB = useMemo(() => byteSize(san), [san]);
  const sav = origB > 0 ? (((origB - sanB) / origB) * 100).toFixed(1) : '0.0';
  const cmds = useMemo(() => cmdCount(d), [d]);
  const hlContent = useMemo(() => hlStr(raw), [raw]);
  const bboxStr = meta
    ? `${meta.x.toFixed(2)} ${meta.y.toFixed(2)} ${meta.w.toFixed(
        2
      )} ${meta.h.toFixed(2)}`
    : '0 0 100 100';

  useEffect(() => {
    if (!meta) {
      setVb(null);
      setFitVb(null);
      return;
    }
    const pad = Math.max(meta.w, meta.h) * 0.2 + 5;
    const nv = {
      x: meta.x - pad,
      y: meta.y - pad,
      w: meta.w + pad * 2,
      h: meta.h + pad * 2,
    };
    setVb(nv);
    setFitVb(nv);
  }, [meta?.x, meta?.y, meta?.w, meta?.h]);

  const resetFit = useCallback(() => {
    if (!meta) return;
    const pad = Math.max(meta.w, meta.h) * 0.2 + 5;
    const nv = {
      x: meta.x - pad,
      y: meta.y - pad,
      w: meta.w + pad * 2,
      h: meta.h + pad * 2,
    };
    setVb(nv);
    setFitVb(nv);
  }, [meta]);

  const syncScroll = () => {
    if (mirRef.current && taRef.current)
      mirRef.current.scrollTop = taRef.current.scrollTop;
  };

  const playAnim = () => {
    if (!meta) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const dur = Math.min(4000, Math.max(1200, meta.len * 3.5));
    const start = performance.now();
    setIsPlaying(true);
    setAnimProg(0);
    const step = (ts) => {
      const p = Math.min((ts - start) / dur, 1);
      setAnimProg(p);
      if (p < 1) animRef.current = requestAnimationFrame(step);
      else {
        setIsPlaying(false);
        setAnimProg(1);
      }
    };
    animRef.current = requestAnimationFrame(step);
  };

  const stopAnim = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsPlaying(false);
    setAnimProg(1);
  };

  const zoomPct = vb && fitVb ? Math.round((fitVb.w / vb.w) * 100) : 100;

  const applyZoom = useCallback(
    (z) => {
      setVb((prev) => {
        if (!prev) return prev;
        const cx = prev.x + prev.w / 2,
          cy = prev.y + prev.h / 2;
        const r = prev.h / prev.w;
        const nw = (fitVb?.w ?? prev.w) * (100 / z);
        return { x: cx - nw / 2, y: cy - (nw * r) / 2, w: nw, h: nw * r };
      });
    },
    [fitVb]
  );

  const doExport = async (type) => {
    const f = mode === 'stroke' ? 'none' : color,
      s = mode === 'fill' ? 'none' : color;
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bboxStr}"><path d="${san}" fill="${f}" stroke="${s}" stroke-width="2"/></svg>`;
    let text =
      type === 'code'
        ? san
        : type === 'full'
        ? svgStr
        : `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgStr))
          )}`;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadSVG = () => {
    const f = mode === 'stroke' ? 'none' : color,
      s = mode === 'fill' ? 'none' : color;
    const str = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bboxStr}"><path d="${san}" fill="${f}" stroke="${s}" stroke-width="2"/></svg>`;
    const url = URL.createObjectURL(new Blob([str], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'path-optimized.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className={`app ${dark ? 'dark' : 'light'}`}>
      <style>{CSS}</style>

      <div className="hdr">
        <div className="logo">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          SVG Path Lab
          <span className="badge">Pro</span>
        </div>
        <button
          className="btn ghost ico"
          onClick={() => setDark((v) => !v)}
          title="Toggle theme"
        >
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>

      <div className="split">
        {/* ── Left ── */}
        <div className="pl">
          <div className="ph">
            <span className="ptl">Path Input</span>
            <button
              className="btn ghost"
              style={{ fontSize: 10, padding: '2px 7px' }}
              onClick={() => setRaw(SAMPLE)}
            >
              Load Sample
            </button>
          </div>

          <div className="ew">
            <div
              ref={mirRef}
              className="mir"
              dangerouslySetInnerHTML={{ __html: hlContent + '\n' }}
            />
            {!raw && <div className="ph0">M 10 10 C 20 20, 40 20, 50 10 …</div>}
            <textarea
              ref={taRef}
              className="ta"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onScroll={syncScroll}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {err && (
            <div className="eb">
              <AlertCircle size={11} />
              {err}
            </div>
          )}

          <div className="stats">
            <div className="si">
              <span className="sl">Original</span>
              <span className="sv">{origB}B</span>
            </div>
            <div className="si">
              <span className="sl">Optimized</span>
              <span className="sv">{sanB}B</span>
            </div>
            <div className="si">
              <span className="sl">Savings</span>
              <span className={`sv ${parseFloat(sav) > 0 ? 'ok' : ''}`}>
                {sav}%
              </span>
            </div>
            <div className="si">
              <span className="sl">Commands</span>
              <span className="sv">{cmds}</span>
            </div>
            <div className="si">
              <span className="sl">Size</span>
              <span className="sv" style={{ fontSize: 9.5 }}>
                {meta ? `${meta.w.toFixed(0)}×${meta.h.toFixed(0)}` : '—'}
              </span>
            </div>
          </div>

          <div className="bar">
            <span className="vbl" style={{ color: 'var(--tx2)' }}>
              Dec
            </span>
            <input
              type="range"
              min={0}
              max={4}
              value={decimals}
              onChange={(e) => setDecimals(+e.target.value)}
              style={{ width: 52 }}
            />
            <span
              style={{
                fontSize: 11,
                fontFamily: 'SF Mono,monospace',
                minWidth: 10,
                color: 'var(--tx)',
              }}
            >
              {decimals}
            </span>
            <div className="dvd" />
            <button
              className="btn pri"
              onClick={() => setRaw(san)}
              disabled={!d}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Sanitize
            </button>
            <div className="dvd" />
            <div
              style={{
                display: 'flex',
                gap: 3,
                marginLeft: 'auto',
                alignItems: 'center',
              }}
            >
              <motion.button
                className={`btn ${copied === 'code' ? 'on' : ''}`}
                onClick={() => doExport('code')}
                disabled={!san}
                whileTap={{ scale: 0.92 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied === 'code' ? (
                    <motion.span
                      key="ok"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 3 }}
                    >
                      <Check size={10} />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cp"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 3 }}
                    >
                      <Copy size={10} />
                      Copy d=
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <button
                className="btn ico"
                onClick={() => doExport('full')}
                title="Copy full <svg>"
                disabled={!san}
              >
                {copied === 'full' ? (
                  <Check size={11} />
                ) : (
                  <FileDown size={11} />
                )}
              </button>
              <button
                className="btn ico"
                onClick={() => doExport('uri')}
                title="Copy Data URI"
                disabled={!san}
              >
                {copied === 'uri' ? <Check size={11} /> : <Link2 size={11} />}
              </button>
              <button
                className="btn ico"
                onClick={downloadSVG}
                title="Download .svg"
                disabled={!san}
              >
                <Download size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="pr">
          <div className="ph">
            <span className="ptl">Preview</span>
            {meta && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'SF Mono,monospace',
                  color: 'var(--tx3)',
                }}
              >
                {meta.w.toFixed(1)} × {meta.h.toFixed(1)}
              </span>
            )}
          </div>

          <div className="tbr">
            <div className="tg">
              {['fill', 'stroke', 'both'].map((m) => (
                <button
                  key={m}
                  className={`btn ${mode === m ? 'on' : ''}`}
                  onClick={() => setMode(m)}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div className="csw" style={{ background: color }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'SF Mono,monospace',
                  color: 'var(--tx2)',
                }}
              >
                {color}
              </span>
            </div>
            <div className="dvd" />
            <button
              className={`btn ico ${showAnchors ? 'on' : ''}`}
              onClick={() => setShowAnchors((v) => !v)}
              title="Toggle anchors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </button>
            <button
              className={`btn ico ${showArrows ? 'on' : ''}`}
              onClick={() => setShowArrows((v) => !v)}
              title="Toggle direction"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <div className="dvd" />
            <button
              className={`btn ${isPlaying ? 'on' : ''}`}
              onClick={isPlaying ? stopAnim : playAnim}
              disabled={!meta}
            >
              {isPlaying ? (
                <>
                  <Pause size={10} />
                  Stop
                </>
              ) : (
                <>
                  <Play size={10} />
                  Play
                </>
              )}
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                marginLeft: 'auto',
              }}
            >
              <button
                className="btn ico ghost"
                onClick={() => applyZoom(Math.min(zoomPct * 1.25, 1600))}
                disabled={!vb}
              >
                <ZoomIn size={12} />
              </button>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'SF Mono,monospace',
                  color: 'var(--tx2)',
                  minWidth: 34,
                  textAlign: 'center',
                }}
              >
                {zoomPct}%
              </span>
              <button
                className="btn ico ghost"
                onClick={() => applyZoom(Math.max(zoomPct * 0.8, 5))}
                disabled={!vb}
              >
                <ZoomOut size={12} />
              </button>
              <button
                className="btn ico ghost"
                onClick={resetFit}
                disabled={!meta}
                title="Fit to view"
              >
                <Maximize2 size={12} />
              </button>
            </div>
          </div>

          <PathCanvas
            d={d}
            color={color}
            mode={mode}
            showAnchors={showAnchors}
            showArrows={showArrows}
            animProg={animProg}
            meta={meta}
            dark={dark}
            vb={vb}
            onVbChange={setVb}
          />

          <div className="vbc">
            <span className="vbl">ViewBox</span>
            {vb &&
              ['x', 'y', 'w', 'h'].map((k) => (
                <div
                  key={k}
                  style={{ display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <span className="vbl" style={{ color: 'var(--tx3)' }}>
                    {k}
                  </span>
                  <input
                    className="vbi"
                    type="number"
                    value={+vb[k].toFixed(2)}
                    onChange={(e) =>
                      setVb((v) => ({
                        ...v,
                        [k]: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              ))}
            {!vb && (
              <span style={{ fontSize: 10, color: 'var(--tx3)' }}>—</span>
            )}
            <div className="dvd" />
            <input
              type="range"
              min={5}
              max={800}
              value={Math.min(zoomPct, 800)}
              onChange={(e) => applyZoom(+e.target.value)}
              disabled={!vb}
              style={{ width: 76 }}
            />
            <span
              style={{
                fontSize: 10,
                fontFamily: 'SF Mono,monospace',
                color: 'var(--tx2)',
                minWidth: 28,
              }}
            >
              {zoomPct}%
            </span>
          </div>
        </div>
      </div>

      <div className="ftr">
        <span>Made with ♥</span>
        <a
          href="https://github.com/afonsobranco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={10} />
          github.com/afonsobranco
        </a>
      </div>
      <Analytics />
    </div>
  );
}
