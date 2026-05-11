// Typing animation
const roles = [
  'AI/ML Systems',
  'Quant Finance Tools',
  'Agentic AI Pipelines',
  'Full Stack Apps',
  'Deep Learning Models',
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');
function type() {
  const current = roles[roleIndex];
  typedEl.textContent = isDeleting
    ? current.slice(0, charIndex - 1)
    : current.slice(0, charIndex + 1);
  isDeleting ? charIndex-- : charIndex++;
  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; type(); }, 2000); return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, isDeleting ? 45 : 75);
}
type();

// Scroll progress bar
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}, { passive: true });

// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
    );
  }),
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinksEl.classList.toggle('open'));
navLinksEl.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinksEl.classList.remove('open'))
);

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// Animated number counters
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const isDecimal = el.hasAttribute('data-decimal');
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = isDecimal ? (value / 10).toFixed(1) : value;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Scroll reveal + trigger counters once visible
const revealEls = document.querySelectorAll(
  '.project-card, .timeline-card, .edu-card, .stat-card, .skill-group, .about-text, .contact-card, .award-banner'
);
revealEls.forEach(el => el.classList.add('fade-in'));

const counterEls = document.querySelectorAll('.stat-num[data-target]');
const countersTriggered = new Set();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revealObserver.unobserve(e.target);
    // trigger counters when about section becomes visible
    counterEls.forEach(cel => {
      if (!countersTriggered.has(cel)) {
        const rect = cel.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          countersTriggered.add(cel);
          animateCounter(cel);
        }
      }
    });
  });
}, { rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
