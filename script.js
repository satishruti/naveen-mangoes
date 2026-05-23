// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });


// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));

    if (target) {
      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});


// ===== REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


// ===== WHATSAPP FORM =====
const form = document.getElementById('inquiryForm');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('fname').value.trim();
    const phone = document.getElementById('fphone').value.trim();
    const type = document.getElementById('ftype').value;
    const qty = document.getElementById('fqty').value.trim();
    const msg = document.getElementById('fmsg').value.trim();

    if (!name || !phone) {
      alert('Please enter name and phone number');
      return;
    }

    const message =
`Hello Naveen Mangoes 🥭

Name: ${name}
Phone: ${phone}
Order Type: ${type}
Quantity: ${qty}

Message:
${msg}`;

    const url =
`https://wa.me/918123505794?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  });
}
