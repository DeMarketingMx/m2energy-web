// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const open = navMenu.classList.contains('open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(6px, 6px)' : '';
  navToggle.querySelectorAll('span')[1].style.opacity   = open ? '0' : '';
  navToggle.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(6px, -6px)' : '';
});

// Close mobile nav on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// FAQ accordion
function toggleFaq(btn) {
  const answer    = btn.nextElementSibling;
  const isOpen    = answer.classList.contains('open');
  const container = btn.closest('.why-us__faq, .faq-grid');

  // Close all open items in the same container
  if (container) {
    container.querySelectorAll('.faq-item__answer.open').forEach(a => {
      a.classList.remove('open');
      a.previousElementSibling.classList.remove('active');
    });
  }

  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}

// Back to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Contact form handler
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
  btn.style.background = '#5cb85c';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3500);
}

// Smooth active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar__nav a:not(.btn)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) a.style.color = 'var(--yellow)';
  });
}, { passive: true });
