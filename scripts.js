
(function(){
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  navToggle && navToggle.addEventListener('click', () => {
    if (!nav) return;
    nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.background = 'rgba(255,255,255,0.95)';
    nav.style.padding = '0.75rem';
    nav.style.borderRadius = '10px';
  });
})();

(function(){
  const numbers = document.querySelectorAll('.stat-number');
  const progressBars = document.querySelectorAll('.progress span');
  const yearEl = document.getElementById('year');

  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.25 };

  function animateNumber(el, target) {
    const isLarge = target > 1000;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(progress * (target - start) + start);
      el.textContent = isLarge ? formatNumber(Math.floor(val)) : String(val);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isLarge ? formatNumber(target) : String(target);
    }
    requestAnimationFrame(step);
  }

  function formatNumber(n){ 
    if(n >= 1000) return (n/1000).toFixed(n%1000 === 0 ? 0 : 1) + 'k';
    return String(n);
  }

  function onIntersect(entries, obs) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        numbers.forEach(n => {
          if (!n.dataset.animated) {
            const target = parseInt(n.getAttribute('data-target'), 10) || 0;
            animateNumber(n, target);
            n.dataset.animated = 'true';
          }
        });
        progressBars.forEach(span => {
          const parent = span.closest('.progress');
          const pct = parseInt(parent?.getAttribute('data-progress') || 0, 10);
          span.style.width = Math.min(Math.max(pct, 0), 100) + '%';
        });
        obs.disconnect();
      }
    });
  }

  const observer = new IntersectionObserver(onIntersect, observerOptions);
  const target = document.querySelector('#impact');
  if (target) observer.observe(target);

  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('formSubmit');
  if (form && submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();
      if (!name || !email || !message) {
        if (msg) msg.textContent = 'Please complete all fields.';
        return;
      }
      if (msg) {
        msg.textContent = 'Thanks! Your message has been noted — we will follow up soon.';
        form.reset();
      }
    });
  }
})();
