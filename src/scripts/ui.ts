import { isTouch } from './constants';

/** Torch / flashlight cursor (desktop only). */
export function initCursor() {
  if (isTouch()) return;
  const cur = document.getElementById('cur'), curt = document.getElementById('curt');
  if (!cur || !curt) return;
  let mx = innerWidth / 2, my = innerHeight / 2, tx = mx, ty = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }, { passive: true });
  (function loop() { tx += (mx - tx) * .08; ty += (my - ty) * .08; curt.style.left = (tx - 40) + 'px'; curt.style.top = (ty - 40) + 'px'; requestAnimationFrame(loop); })();
}
