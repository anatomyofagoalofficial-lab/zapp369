// ⚡ZAPP referral — client-side, no backend required.
// First-touch attribution via ?ref=code (captured site-wide), plus a personal
// code/link generator with copy + share. Reward distribution is handled by the
// community pool (a leaderboard can be wired to a backend later).

const KEY_BY = 'zapp-ref-by';     // who referred THIS visitor (first touch)
const KEY_CODE = 'zapp-ref-code'; // this visitor's own code

const clean = (s: string) => (s || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 16);

/** Capture an incoming ?ref=… as first-touch attribution. Safe to call on every page. */
export function captureReferral() {
  try {
    const ref = clean(new URLSearchParams(location.search).get('ref') || '');
    if (ref && !localStorage.getItem(KEY_BY)) localStorage.setItem(KEY_BY, ref);
  } catch { /* private mode / SSR */ }
}

/** Wire up the referral section UI (only runs where #referral exists). */
export function initReferral() {
  const root = document.getElementById('referral');
  if (!root) return;
  captureReferral();

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;
  const handle = $<HTMLInputElement>('rf-handle');
  const linkEl = $<HTMLInputElement>('rf-link');
  const linkrow = $('rf-linkrow');
  const share = $('rf-share');
  const xEl = $<HTMLAnchorElement>('rf-x');
  const tgEl = $<HTMLAnchorElement>('rf-tg');
  const codeTile = $('rf-code');
  const byTile = $('rf-by');

  const SITE = (location.origin && !location.origin.startsWith('file')) ? location.origin : 'https://zappv3.vercel.app';

  let by = '';
  try { by = localStorage.getItem(KEY_BY) || ''; } catch { /* */ }
  if (byTile) byTile.textContent = by ? '@' + by : 'Direct';

  const setCode = (c: string) => { if (codeTile) codeTile.textContent = c ? '@' + c : '—'; };

  let saved = '';
  try { saved = localStorage.getItem(KEY_CODE) || ''; } catch { /* */ }
  if (saved && handle) handle.value = saved;
  setCode(saved);

  function build() {
    if (!handle || !linkEl || !linkrow || !share) return;
    let code = clean(handle.value);
    if (!code) { code = 'zap' + Math.random().toString(36).slice(2, 7); handle.value = code; }
    try { localStorage.setItem(KEY_CODE, code); } catch { /* */ }
    setCode(code);
    const link = `${SITE}/?ref=${code}`;
    linkEl.value = link;
    linkrow.hidden = false; share.hidden = false;
    const msg = "I'm holding ⚡ZAPP — Tesla's frequency, free energy on Solana. Join the signal:";
    if (xEl) xEl.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(link)}`;
    if (tgEl) tgEl.href = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(msg)}`;
  }

  $('rf-gen')?.addEventListener('click', build);
  handle?.addEventListener('keydown', e => { if ((e as KeyboardEvent).key === 'Enter') build(); });
  $('rf-copy')?.addEventListener('click', () => {
    if (!linkEl) return;
    navigator.clipboard.writeText(linkEl.value).then(() => {
      const c = $('rf-copy'); if (!c) return;
      const o = c.textContent; c.textContent = '✓ Copied'; setTimeout(() => { c.textContent = o; }, 2000);
    }).catch(() => { linkEl.select(); document.execCommand('copy'); });
  });

  if (saved) build();
}
