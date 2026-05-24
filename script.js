/* ============================================================
   NAVEEN MANGO THAILAND — script.js
   Cart · Quantity Selector · WhatsApp Checkout · UPI
   ============================================================ */

const PRICE_PER_BOX = 1400;
const MANGOES_PER_BOX = 12;
const WA_NUMBER = '918123505794';
const UPI_ID = '8123505794@upi';
const UPI_NAME = 'Naveen Mango Thailand';

// ===== STATE =====
let cartQty = 0;
let productQty = 1;

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER =====
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

function toggleMenu(isOpen) {
  if (isOpen === undefined) isOpen = !navMenu.classList.contains('open');
  navMenu && navMenu.classList.toggle('open', isOpen);
  burger && burger.classList.toggle('open', isOpen);
  nav && nav.classList.toggle('menu-active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

burger && burger.addEventListener('click', () => toggleMenu());
navMenu && navMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);
document.addEventListener('click', e => {
  if (nav && !nav.contains(e.target)) toggleMenu(false);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    try {
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        toggleMenu(false);
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
    }
  });
});

// ===== REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const parent = en.target.closest('.bento-grid,.press-grid,.testi-row,.stats-bar,.masonry');
    const delay = parent ? Array.from(parent.children).indexOf(en.target) * 90 : 0;
    setTimeout(() => en.target.classList.add('visible'), delay);
    revealObs.unobserve(en.target);
  });
}, { threshold: 0.02, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== TICKER DUPLICATE =====
const ticker = document.getElementById('tickerTrack');
if (ticker) ticker.innerHTML += ticker.innerHTML;
const marquee = document.getElementById('marqueeTrack');
if (marquee) marquee.innerHTML += marquee.innerHTML;

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + cur) a.style.color = '#f7931e';
  });
}, { passive: true });

// ===== PRODUCT QUANTITY =====
const qtyVal = document.getElementById('qtyVal');
const qtyTotal = document.getElementById('qtyTotal');
const qtyPcs = document.getElementById('qtyPcs');

function updateProductQty(n) {
  productQty = Math.max(1, Math.min(99, n));
  if (qtyVal) qtyVal.textContent = productQty;
  const total = productQty * PRICE_PER_BOX;
  if (qtyTotal) qtyTotal.textContent = '₹' + total.toLocaleString('en-IN');
  if (qtyPcs) qtyPcs.textContent = '(' + (productQty * MANGOES_PER_BOX) + ' mangoes)';
}

document.getElementById('qtyMinus') && document.getElementById('qtyMinus').addEventListener('click', () => updateProductQty(productQty - 1));
document.getElementById('qtyPlus') && document.getElementById('qtyPlus').addEventListener('click', () => updateProductQty(productQty + 1));

document.getElementById('quickOrderBtn') && document.getElementById('quickOrderBtn').addEventListener('click', () => {
  const msg = buildWAMessage(productQty);
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
});

document.getElementById('addToCartBtn') && document.getElementById('addToCartBtn').addEventListener('click', () => {
  cartQty = productQty;
  updateCartUI();
  openCart();
  const btn = document.getElementById('addToCartBtn');
  if (btn) {
    btn.textContent = '✓ Added to Cart!';
    setTimeout(() => {
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Add to Cart';
    }, 1500);
  }
});

// ===== CART =====
function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartQtyDisplay = document.getElementById('cartQtyDisplay');
  const cartItemPrice = document.getElementById('cartItemPrice');
  const csSummaryBoxes = document.getElementById('csSummaryBoxes');
  const csTotalAmt = document.getElementById('csTotalAmt');
  const upiAmountDisplay = document.getElementById('upiAmountDisplay');

  if (badge) {
    badge.textContent = cartQty;
    if (cartQty > 0) badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 500);
  }

  if (cartQty === 0) {
    if (cartItems) cartItems.style.display = 'none';
    if (cartEmpty) cartEmpty.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    if (cartItems) cartItems.style.display = 'block';
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';
    const total = cartQty * PRICE_PER_BOX;
    if (cartQtyDisplay) cartQtyDisplay.textContent = cartQty;
    if (cartItemPrice) cartItemPrice.textContent = '₹' + (cartQty * PRICE_PER_BOX).toLocaleString('en-IN');
    if (csSummaryBoxes) csSummaryBoxes.textContent = cartQty + ' box' + (cartQty > 1 ? 'es' : '') + ' (' + (cartQty * MANGOES_PER_BOX) + ' mangoes)';
    if (csTotalAmt) csTotalAmt.textContent = '₹' + total.toLocaleString('en-IN');
    if (upiAmountDisplay) upiAmountDisplay.textContent = '₹' + total.toLocaleString('en-IN');
  }
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartNavBtn') && document.getElementById('cartNavBtn').addEventListener('click', openCart);
document.getElementById('cartClose') && document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay') && document.getElementById('cartOverlay').addEventListener('click', closeCart);
document.getElementById('cartShopBtn') && document.getElementById('cartShopBtn').addEventListener('click', closeCart);

document.getElementById('cartMinus') && document.getElementById('cartMinus').addEventListener('click', () => {
  if (cartQty > 1) { cartQty--; updateCartUI(); }
});
document.getElementById('cartPlus') && document.getElementById('cartPlus').addEventListener('click', () => {
  if (cartQty < 99) { cartQty++; updateCartUI(); }
});

// ===== UPI COPY =====
document.getElementById('upiCopyBtn') && document.getElementById('upiCopyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(UPI_ID).then(() => {
    const btn = document.getElementById('upiCopyBtn');
    btn.textContent = 'Copied ✓';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = UPI_ID;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    const btn = document.getElementById('upiCopyBtn');
    btn.textContent = 'Copied ✓';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
});

// ===== UPI OPEN APP =====
document.getElementById('upiOpenBtn') && document.getElementById('upiOpenBtn').addEventListener('click', () => {
  const total = cartQty * PRICE_PER_BOX;
  const note = encodeURIComponent('Thailand Mango ' + cartQty + ' box' + (cartQty > 1 ? 'es' : ''));
  const upiUrl = 'upi://pay?pa=' + UPI_ID + '&pn=' + encodeURIComponent(UPI_NAME) + '&am=' + total + '&tn=' + note + '&cu=INR';
  window.location.href = upiUrl;
  setTimeout(() => {
    alert('If UPI app did not open, please manually open GPay / PhonePe / Paytm and pay ₹' + total.toLocaleString('en-IN') + ' to UPI ID: ' + UPI_ID + '\n\nThen send payment screenshot to WhatsApp +91 8123505794 to confirm order.');
  }, 2000);
});

// ===== WHATSAPP CHECKOUT =====
function buildWAMessage(qty) {
  const total = qty * PRICE_PER_BOX;
  return '🥭 Order from Naveen Mango Thailand\n\n' +
    'Product: Thailand Mango Box\n' +
    'Quantity: ' + qty + ' box' + (qty > 1 ? 'es' : '') + ' (' + (qty * MANGOES_PER_BOX) + ' mangoes)\n' +
    'Price per box: ₹' + PRICE_PER_BOX.toLocaleString('en-IN') + '\n' +
    'Total Amount: ₹' + total.toLocaleString('en-IN') + '\n\n' +
    'UPI ID: ' + UPI_ID + '\n\n' +
    'Please confirm my order and share delivery details.\n' +
    'Farm: NH-50, Vijayapura 586127, Karnataka';
}

document.getElementById('checkoutWABtn') && document.getElementById('checkoutWABtn').addEventListener('click', () => {
  if (cartQty === 0) return;
  const msg = buildWAMessage(cartQty);
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
});

// ===== INQUIRY FORM =====
const form = document.getElementById('inquiryForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = (document.getElementById('fname') || {}).value || '';
    const phone = (document.getElementById('fphone') || {}).value || '';
    const type = (document.getElementById('ftype') || {}).value || '';
    const qty = (document.getElementById('fqty') || {}).value || '';
    const msg = (document.getElementById('fmsg') || {}).value || '';
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your name and phone number.');
      return;
    }
    const labels = {
      retail: 'Retail (Home/Personal)', wholesale: 'Wholesale / Bulk',
      hotel: 'Hotel / Restaurant', export: 'Export Inquiry'
    };
    const waMsg = 'Hello Naveen Mango Thailand! 🥭\n\n' +
      'Name: ' + name.trim() + '\n' +
      'Phone: ' + phone.trim() + '\n' +
      'Order Type: ' + (labels[type] || type) + '\n' +
      'Quantity: ' + (qty || 'Not specified') + '\n' +
      'Message: ' + (msg.trim() || 'No additional message') + '\n\n' +
      'I found you on your website and would like to place an order.';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(waMsg), '_blank');
  });
}

// ===== GALLERY LIGHTBOX =====
document.querySelectorAll('.m-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.94);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:1.5rem;';
    const big = document.createElement('img');
    big.src = img.src;
    big.style.cssText = 'max-width:92vw;max-height:90vh;object-fit:contain;border-radius:12px;';
    const cl = document.createElement('button');
    cl.innerHTML = '✕';
    cl.style.cssText = 'position:absolute;top:1.5rem;right:2rem;background:rgba(255,255,255,.12);border:none;border-radius:50%;width:40px;height:40px;color:#fff;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;';
    cl.addEventListener('click', e => { e.stopPropagation(); ov.remove(); });
    ov.appendChild(big);
    ov.appendChild(cl);
    ov.addEventListener('click', () => ov.remove());
    document.body.appendChild(ov);
  });
});

// ===== VIDEO PLAYER =====
function tryPlayVideo(src, title) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.96);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:1.5rem;';
  const vid = document.createElement('video');
  vid.src = src;
  vid.controls = true;
  vid.autoplay = true;
  vid.style.cssText = 'max-width:90vw;max-height:80vh;border-radius:12px;';
  const cl = document.createElement('button');
  cl.innerHTML = '✕  Close';
  cl.style.cssText = 'margin-top:1.2rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;padding:.5rem 1.4rem;border-radius:50px;cursor:pointer;font-size:.9rem;';
  cl.addEventListener('click', () => modal.remove());
  modal.appendChild(vid);
  modal.appendChild(cl);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  vid.onerror = () => {
    vid.remove();
    const msg = document.createElement('p');
    msg.style.cssText = 'color:rgba(255,255,255,.6);text-align:center;font-size:.9rem;';
    msg.textContent = title + ' video not yet uploaded. Share via WhatsApp to +91 8123505794.';
    modal.insertBefore(msg, cl);
  };
}

// ===== INIT =====
updateProductQty(1);
updateCartUI();

