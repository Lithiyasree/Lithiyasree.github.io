document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Scroll progress bar + navbar scrolled state */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = `${pct}%`;
    navbar?.classList.toggle('scrolled', scrollTop > 20);
    backToTop?.classList.toggle('visible', scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* Active nav link highlighting */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => sectionObserver.observe(s));

  /* Mobile hamburger menu */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinksList?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  /* Typing effect in hero */
  const typingText = document.getElementById('typingText');
  const roles = ['Full Stack Developer', 'React Developer', 'Django Developer', 'Python Developer', 'MERN Stack Enthusiast'];

  if (typingText && !reduceMotion) {
    let roleIndex = 0, charIndex = 0, deleting = false;
    function typeLoop() {
      const currentRole = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typingText.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typingText.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
    typeLoop();
  } else if (typingText) {
    typingText.textContent = roles[0];
  }

  /* Fade-up on scroll */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-up').forEach((el) => fadeObserver.observe(el));

  /* Animated counters */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter-num').forEach((c) => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }


  /* Skill Progress Animation */

const skillObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const bar = entry.target;

            bar.style.width = bar.dataset.progress + "%";

            skillObserver.unobserve(bar);

        }

    });

},{
    threshold:0.5
});

document.querySelectorAll(".progress-bar").forEach(bar=>{
    skillObserver.observe(bar);
});

  /* Certificate modal */
  const certModal = document.getElementById('certModal');
  const certModalBody = document.getElementById('certModalBody');
  const certModalClose = document.getElementById('certModalClose');

  document.querySelectorAll('.cert-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    function openCertModal() {
      if (!certModal || !certModalBody) return;
      const iconClass = card.querySelector('i')?.className || 'fa-solid fa-certificate';
      const title = card.querySelector('h3')?.textContent || '';
      const meta = card.querySelector('p')?.textContent || '';
      const imgSrc = card.dataset.certImage;

   
        certModalBody.innerHTML = imgSrc
    ? `
        <iframe
            src="${imgSrc}"
            width="100%"
            height="650"
            style="border:none; border-radius:12px;"
            allowfullscreen>
        </iframe>

        <h3>${title}</h3>
        <p>${meta}</p>
        `
    : `
        <i class="${iconClass}"></i>
        <h3>${title}</h3>
        <p>${meta}</p>
        `;

      certModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      certModalClose?.focus();
    }

    card.addEventListener('click', openCertModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCertModal(); }
    });
  });

  function closeCertModal() {
    certModal?.classList.remove('open');
    document.body.style.overflow = '';
  }
  certModalClose?.addEventListener('click', closeCertModal);
  certModal?.addEventListener('click', (e) => { if (e.target === certModal) closeCertModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCertModal(); });

  /* Contact form — Formspree integration */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmitBtn = contactForm?.querySelector('button[type="submit"]');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = 'Please fill in all fields.';
      formStatus.style.color = '#DC2626';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.style.color = '#DC2626';
      return;
    }

    const endpoint = contactForm.getAttribute('action');

    if (!endpoint) {
        formStatus.textContent = "Form action is missing.";
        formStatus.style.color = "#DC2626";
        return;
    }

    try {
      if (formSubmitBtn) { formSubmitBtn.disabled = true; formSubmitBtn.textContent = 'Sending...'; }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });
      if (response.ok) {
        formStatus.textContent = `Thanks, ${name}! Your message has been sent.`;
        formStatus.style.color = '';
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => null);
        formStatus.textContent = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        formStatus.style.color = '#DC2626';
      }
    } catch {
      formStatus.textContent = 'Network error — please try again.';
      formStatus.style.color = '#DC2626';
    } finally {
      if (formSubmitBtn) { formSubmitBtn.disabled = false; formSubmitBtn.textContent = 'Send Message'; }
    }
  });

  /* Resume button placeholder notice */
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn?.addEventListener('click', (e) => {
    if (resumeBtn.getAttribute('href') === '#') {
      e.preventDefault();
      if (formStatus) { formStatus.textContent = 'Add your resume file path to the Download Resume button in index.html.'; formStatus.style.color = ''; }
    }
  });

});
