const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Theme toggle (persistent) ----
const btn = document.getElementById('themeBtn');
const KEY = 'sg-theme-editorial';
const saved = localStorage.getItem(KEY);
if (saved) root.setAttribute('data-theme', saved);
const sync = () => { btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☾' : '☀'; };
sync();
btn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem(KEY, next);
  sync();
});

// ---- Scroll progress ----
const prog = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
}, { passive: true });

// ---- Hero line mask reveal on load ----
addEventListener('load', () => {
  document.querySelectorAll('#heroName .ln > span').forEach((s, i) => {
    if (reduced) return;
    s.style.transform = 'translateY(110%)';
    s.style.transition = 'transform 1.1s cubic-bezier(0.16,1,0.3,1)';
    s.style.transitionDelay = (0.12 + i * 0.12) + 's';
    requestAnimationFrame(() => requestAnimationFrame(() => { s.style.transform = 'translateY(0)'; }));
  });
});

// ---- Scroll reveal with stagger ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const sibs = [...e.target.parentElement.querySelectorAll('.reveal')];
      e.target.style.transitionDelay = (Math.min(sibs.indexOf(e.target), 6) * 80) + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Count-up stats ----
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
    let n = 0; const step = Math.max(1, Math.round(target / 24));
    const t = setInterval(() => { n += step; if (n >= target) { n = target; clearInterval(t); } el.textContent = n + suffix; }, 40);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

// ---- Scroll-velocity marquee ----
const track = document.getElementById('marquee');
let mx = 0, base = 0.4, vel = 0, lastY = scrollY;
addEventListener('scroll', () => { vel = (scrollY - lastY); lastY = scrollY; }, { passive: true });
function marquee() {
  const half = track.scrollWidth / 2;
  const speed = base + Math.min(Math.abs(vel) * 0.3, 10);
  mx -= speed;
  if (mx <= -half) mx += half;
  track.style.transform = `translateX(${mx}px)`;
  vel *= 0.9;
  requestAnimationFrame(marquee);
}
if (!reduced) marquee();

// ---- Custom cursor + magnetic buttons (fine pointer only) ----
if (matchMedia('(pointer: fine)').matches && !reduced) {
  const cur = document.getElementById('cur'), curR = document.getElementById('curR');
  let cx = innerWidth/2, cy = innerHeight/2, rx = cx, ry = cy;
  addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; cur.style.left = cx+'px'; cur.style.top = cy+'px'; });
  (function ring(){ rx += (cx-rx)*0.18; ry += (cy-ry)*0.18; curR.style.left = rx+'px'; curR.style.top = ry+'px'; requestAnimationFrame(ring); })();
  document.querySelectorAll('a, button, .skill-cell, .exp-item').forEach(el => {
    el.addEventListener('mouseenter', () => curR.classList.add('big'));
    el.addEventListener('mouseleave', () => curR.classList.remove('big'));
  });
  // magnetic
  document.querySelectorAll('[data-mag]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${dx*0.25}px, ${dy*0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}
