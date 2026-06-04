import { isTouch } from './constants';

/** Minimal gold cursor: a precise dot + a smooth trailing ring (desktop only). */
export function initCursor() {
  if (isTouch()) return;
  const cur = document.getElementById('cur'), curt = document.getElementById('curt');
  if (!cur || !curt) return;
  let mx = innerWidth / 2, my = innerHeight / 2, tx = mx, ty = my;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    const hot = !!(e.target as HTMLElement)?.closest?.('a,button,[data-go],[data-hub],[data-era],[data-copy-ca],[role="button"],.dimension-card,input');
    document.body.classList.toggle('cur-hot', hot);   // ring grows over anything clickable
  }, { passive: true });
  (function loop() {
    tx += (mx - tx) * .14; ty += (my - ty) * .14;     // the ring smoothly trails the dot
    curt.style.left = tx + 'px'; curt.style.top = ty + 'px';
    requestAnimationFrame(loop);
  })();
}
