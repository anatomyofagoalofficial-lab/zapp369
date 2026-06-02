// Ambient Tesla-coil hum — synthesised with the Web Audio API (no audio file).
// A low 3·6·9-flavoured drone: 36.9 Hz fundamental + 369 Hz shimmer + slow AM.
// Muted by default; the #snd button toggles it. Audio context only starts on
// first user gesture (browser autoplay policy).
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let on = false;

function build() {
  ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Sub-root drone (99 Hz = 396 / 4)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 99;
  const g1 = ctx.createGain(); g1.gain.value = 0.05;

  // Root chakra · 396 Hz
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 396;
  const g2 = ctx.createGain(); g2.gain.value = 0.03;

  // Heart chakra · 639 Hz
  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = 639;
  const g3 = ctx.createGain(); g3.gain.value = 0.022;

  // Crown chakra · 963 Hz
  const osc4 = ctx.createOscillator();
  osc4.type = 'sine';
  osc4.frequency.value = 963;
  const g4 = ctx.createGain(); g4.gain.value = 0.013;

  // Gentle low-pass so the chord stays soft, not piercing
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 1200; lp.Q.value = 0.5;

  // Slow amplitude modulation (electric "breathing")
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.18;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.5;
  const amDepth = ctx.createGain(); amDepth.gain.value = 0.5;
  lfo.connect(lfoGain); lfoGain.connect(amDepth.gain);

  osc1.connect(g1); osc2.connect(g2); osc3.connect(g3); osc4.connect(g4);
  g1.connect(lp); g2.connect(lp); g3.connect(lp); g4.connect(lp);
  lp.connect(amDepth); amDepth.connect(master);

  [osc1, osc2, osc3, osc4, lfo].forEach(o => o.start());
}

export function initSound() {
  const btn = document.getElementById('snd');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!ctx) build();
    if (ctx!.state === 'suspended') ctx!.resume();
    on = !on;
    btn.classList.toggle('muted', !on);
    const now = ctx!.currentTime;
    master!.gain.cancelScheduledValues(now);
    master!.gain.linearRampToValueAtTime(on ? 0.85 : 0, now + (on ? 1.2 : 0.4));
  });
}
