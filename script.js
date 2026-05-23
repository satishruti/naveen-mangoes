// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) navLinks.classList.remove('open');
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ===== REVEAL ON SCROLL (Intersection Observer) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Stagger siblings in grids
      const parent = entry.target.closest('.why-grid, .products-grid, .testi-grid, .stats-bar, .media-grid, .upload-grid');
      const delay = parent
        ? Array.from(parent.children).indexOf(entry.target) * 110
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== WHATSAPP FORM SUBMIT =====
const form = document.getElementById('inquiryForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('fname').value.trim();
    const phone   = document.getElementById('fphone').value.trim();
    const type    = document.getElementById('ftype').value;
    const msg     = document.getElementById('fmsg').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    const typeLabels = {
      'retail-thailand':    'Retail – Thailand Mango',
      'wholesale-thailand': 'Wholesale – Thailand Mango',
      'retail-japan':       'Retail – Japan Mango',
      'wholesale-japan':    'Wholesale – Japan Mango',
      'export':             'Export Inquiry',
      'general':            'General Inquiry'
    };

    const waMessage =
`Hello Naveen Mangoes! 🥭

Name: ${name}
Phone: ${phone}
Order Type: ${typeLabels[type] || type}
Message: ${msg || 'No additional message'}

I found you on your website and would like to place an order.`;

    window.open(`https://wa.me/918123505794?text=${encodeURIComponent(waMessage)}`, '_blank');
  });
}

// ===== GALLERY IMAGE LIGHTBOX =====
document.querySelectorAll('.real-gallery-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.94);z-index:9999;' +
      'display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:1.5rem;';
    const big = document.createElement('img');
    big.src = img.src;
    big.style.cssText = 'max-width:95vw;max-height:92vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);';
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText =
      'position:absolute;top:1.5rem;right:2rem;background:none;border:none;color:#fff;' +
      'font-size:2rem;cursor:pointer;line-height:1;opacity:.8;';
    closeBtn.addEventListener('click', () => overlay.remove());
    overlay.appendChild(big);
    overlay.appendChild(closeBtn);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) a.style.color = '#f7931e';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });

// ===== FUTURE: PHOTO / VIDEO UPLOAD HANDLER =====
// When you share new photos via WhatsApp, add them like this:
// 1. Save your photo to the same folder as index.html (e.g. farm1.jpg, harvest.jpg)
// 2. In index.html find the gallery section and replace upload-placeholder divs with:
//    <div class="gallery-item"><img src="yourphoto.jpg" alt="description" /></div>
// Videos: add <video controls width="100%" src="yourvideo.mp4"></video> in the gallery section
JSEOF
