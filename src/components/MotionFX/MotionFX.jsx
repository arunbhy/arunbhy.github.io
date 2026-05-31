import { useEffect } from 'react';
import './MotionFX.css';

const MotionFX = () => {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanup = [];

    // --- scroll progress bar ---
    const prog = document.getElementById('fx-prog');
    const onScroll = () => {
      const h = document.documentElement;
      const denom = h.scrollHeight - h.clientHeight || 1;
      const p = h.scrollTop / denom;
      if (prog) prog.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanup.push(() => window.removeEventListener('scroll', onScroll));

    // --- section-heading underline reveal ---
    const headObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          headObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.sec-head').forEach((el) => headObs.observe(el));
    cleanup.push(() => headObs.disconnect());

    // --- desktop-only: custom cursor, grid parallax, magnetic buttons ---
    const fine = window.matchMedia('(pointer:fine)').matches;
    if (fine && !reduce) {
      const cur = document.getElementById('fx-cur');
      const ring = document.getElementById('fx-ring');
      let rx = 0, ry = 0, tx = 0, ty = 0, raf;

      const onMove = (e) => {
        tx = e.clientX; ty = e.clientY;
        if (cur) cur.style.transform = `translate(${tx}px,${ty}px)`;
        document.body.style.backgroundPosition =
          `${(e.clientX / window.innerWidth - 0.5) * -18}px ${(e.clientY / window.innerHeight - 0.5) * -18}px`;
      };
      window.addEventListener('mousemove', onMove);
      cleanup.push(() => window.removeEventListener('mousemove', onMove));

      const follow = () => {
        rx += (tx - rx) * 0.16;
        ry += (ty - ry) * 0.16;
        if (ring) ring.style.transform = `translate(${rx}px,${ry}px)`;
        raf = requestAnimationFrame(follow);
      };
      follow();
      cleanup.push(() => cancelAnimationFrame(raf));

      const interactive = 'a,button,.btn,.tag,.monogram,input,textarea';
      const over = (e) => { if (e.target.closest?.(interactive)) ring?.classList.add('grow'); };
      const out = (e) => { if (e.target.closest?.(interactive)) ring?.classList.remove('grow'); };
      document.addEventListener('mouseover', over);
      document.addEventListener('mouseout', out);
      cleanup.push(() => document.removeEventListener('mouseover', over));
      cleanup.push(() => document.removeEventListener('mouseout', out));

      document.querySelectorAll('.mag').forEach((el) => {
        const mm = (ev) => {
          const r = el.getBoundingClientRect();
          const x = ev.clientX - r.left - r.width / 2;
          const y = ev.clientY - r.top - r.height / 2;
          el.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
        };
        const ml = () => { el.style.transform = ''; };
        el.addEventListener('mousemove', mm);
        el.addEventListener('mouseleave', ml);
        cleanup.push(() => {
          el.removeEventListener('mousemove', mm);
          el.removeEventListener('mouseleave', ml);
        });
      });
    }

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="fx-grain" aria-hidden="true"></div>
      <div className="fx-progress" id="fx-prog" aria-hidden="true"></div>
      <div className="fx-cur" id="fx-cur" aria-hidden="true"></div>
      <div className="fx-ring" id="fx-ring" aria-hidden="true"></div>
    </>
  );
};

export default MotionFX;
