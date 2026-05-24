/* ============================================
   NAVEEN MANGOES — COMPLETE JS 2026
   Nav · Reveal · Cart · UPI · Form · Gallery
   ============================================ */

const PRICE_PER_BOX = 1400;
const UPI_ID = '8123505794@ybl';
const UPI_NAME = 'NaveenMangoes';
const WA_NUMBER = '918123505794';

/* ---- STATE ---- */
let cart = { qty: 0 };
let shopQty = 1;

/* ---- NAV ---- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
});

burger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMenu.classList.remove('open'));
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target)) navMenu.classList.remove('open');
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- REVEAL ON SCROLL ---- */
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement?.children;
      const idx = siblings ? [...siblings].indexOf(entry.target) : 0;
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      ro.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => ro.observe(el));

/* ---- ACTIVE NAV HIGHLIGHT ---- */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 130) cur = s.id; });
  navMenu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--mg)' : '';
  });
});

/* ---- SHOP QTY ---- */
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyVal = document.getElementById('qtyVal');
const shopTotal = document.getElementById('shopTotal');

function updateShopTotal() {
  if (qtyVal) qtyVal.textContent = shopQty;
  if (shopTotal) shopTotal.textContent = '₹' + (shopQty * PRICE_PER_BOX).toLocaleString('en-IN');
}

qtyMinus?.addEventListener('click', () => { if (shopQty > 1) { shopQty--; updateShopTotal(); } });
qtyPlus?.addEventListener('click', () => { if (shopQty < 20) { shopQty++; updateShopTotal(); } });

/* ---- ADD TO CART ---- */
const addToCartBtn = document.getElementById('addToCart');
addToCartBtn?.addEventListener('click', () => {
  cart.qty = shopQty;
  updateCartUI();
  openCart();

  // Animate button
  addToCartBtn.textContent = '✓ Added to Cart!';
  addToCartBtn.classList.add('added');
  setTimeout(() => {
    addToCartBtn.textContent = '🛒 Add to Cart';
    addToCartBtn.classList.remove('added');
  }, 2000);
});

/* ---- CART LOGIC ---- */
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartNavBtn = document.getElementById('cartNavBtn');
const cartCount = document.getElementById('cartCount');
const cartEmpty = document.getElementById('cartEmpty');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartQty = document.getElementById('cartQty');
const cartMinus = document.getElementById('cartMinus');
const cartPlus = document.getElementById('cartPlus');
const cartItemPrice = document.getElementById('cartItemPrice');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartGrandTotal = document.getElementById('cartGrandTotal');
const cartPayAmt = document.getElementById('cartPayAmt');
const cartBoxCount = document.getElementById('cartBoxCount');
const cartPayBtn = document.getElementById('cartPayBtn');
const cartWaBtn = document.getElementById('cartWaBtn');

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

function updateCartUI() {
  const total = cart.qty * PRICE_PER_BOX;
  // Nav badge
  if (cartCount) {
    cartCount.textContent = cart.qty;
    cartCount.style.display = cart.qty > 0 ? 'flex' : 'none';
  }
  // Empty/items toggle
  if (cart.qty === 0) {
    cartEmpty?.style && (cartEmpty.style.display = 'block');
    cartItems?.style && (cartItems.style.display = 'none');
    cartFooter?.style && (cartFooter.style.display = 'none');
  } else {
    cartEmpty?.style && (cartEmpty.style.display = 'none');
    cartItems?.style && (cartItems.style.display = 'block');
    cartFooter?.style && (cartFooter.style.display = 'flex');
    if (cartQty) cartQty.textContent = cart.qty;
    if (cartItemPrice) cartItemPrice.textContent = fmt(total);
    if (cartSubtotal) cartSubtotal.textContent = fmt(total);
    if (cartGrandTotal) cartGrandTotal.textContent = fmt(total);
    if (cartPayAmt) cartPayAmt.textContent = total.toLocaleString('en-IN');
    if (cartBoxCount) cartBoxCount.textContent = cart.qty;
    // WhatsApp link
    const waMsg = encodeURIComponent(
      `Hello Naveen Mangoes! 🥭\n\nI want to order:\n✅ Thailand Mango Box × ${cart.qty}\n💰 Total: ₹${total.toLocaleString('en-IN')}\n\nI have made the UPI payment. Sending screenshot now.\n\nPlease confirm my order and delivery details.`
    );
    if (cartWaBtn) cartWaBtn.href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
  }
}

function openCart() {
  cartDrawer?.classList.add('open');
  cartOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer?.classList.remove('open');
  cartOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

cartNavBtn?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

cartMinus?.addEventListener('click', () => {
  if (cart.qty > 1) { cart.qty--; updateCartUI(); }
});
cartPlus?.addEventListener('click', () => {
  if (cart.qty < 20) { cart.qty++; updateCartUI(); }
});

/* ---- UPI PAYMENT MODAL ---- */
const upiModal = document.createElement('div');
upiModal.className = 'upi-modal';
upiModal.id = 'upiModal';
upiModal.innerHTML = `
  <div class="upi-modal-overlay" id="upiModalOverlay"></div>
  <div class="upi-modal-box">
    <button class="upi-modal-close" id="upiModalClose">✕</button>
    <div style="font-size:1.8rem;margin-bottom:.5rem;">📱</div>
    <h3>Pay via UPI</h3>
    <p>Scan QR or use UPI ID to pay</p>
    <div class="upi-modal-amt" id="upiModalAmt">₹1,400</div>
    <div class="upi-modal-qr">
      <img id="upiModalQR" src="" alt="UPI QR" width="200" height="200" style="border-radius:8px;" />
    </div>
    <div class="upi-modal-id">
      <span>UPI ID:</span>
      <strong>${UPI_ID}</strong>
      <button class="copy-btn" id="modalCopyUpi">📋 Copy</button>
    </div>
    <p class="upi-modal-note">After payment, send screenshot to WhatsApp for confirmation</p>
    <a id="upiModalWa" href="#" target="_blank" rel="noopener" class="after-wa-btn" style="width:100%;justify-content:center;margin-bottom:.6rem;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Send Payment Screenshot on WhatsApp
    </a>
    <button class="upi-modal-close" id="upiModalClosBtn" style="position:static;width:100%;border-radius:50px;background:var(--g4);color:var(--tm);font-size:.88rem;padding:.6rem;border:none;cursor:pointer;font-family:var(--fb);">Done / Close</button>
  </div>
`;
document.body.appendChild(upiModal);

function openUpiModal(totalAmt) {
  closeCart();
  const qrData = encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${totalAmt}&cu=INR&tn=ThailandMangoBox`);
  document.getElementById('upiModalQR').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
  document.getElementById('upiModalAmt').textContent = '₹' + Number(totalAmt).toLocaleString('en-IN');
  const waMsg = encodeURIComponent(`Hello Naveen Mangoes! 🥭\n\nI made UPI payment of ₹${Number(totalAmt).toLocaleString('en-IN')} for ${cart.qty} box(es).\nSending screenshot now. Please confirm my order.`);
  document.getElementById('upiModalWa').href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
  upiModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeUpiModal() {
  upiModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('upiModalOverlay').addEventListener('click', closeUpiModal);
document.getElementById('upiModalClose').addEventListener('click', closeUpiModal);
document.getElementById('upiModalClosBtn').addEventListener('click', closeUpiModal);

cartPayBtn?.addEventListener('click', () => {
  const total = cart.qty * PRICE_PER_BOX;
  openUpiModal(total);
});

// Modal copy UPI
document.getElementById('modalCopyUpi').addEventListener('click', function() {
  navigator.clipboard?.writeText(UPI_ID).then(() => {
    this.textContent = '✓ Copied!';
    this.classList.add('copied');
    setTimeout(() => { this.textContent = '📋 Copy'; this.classList.remove('copied'); }, 2000);
  });
});

/* ---- COPY UPI (page-level) ---- */
const copyUpiBtn = document.getElementById('copyUpi');
copyUpiBtn?.addEventListener('click', function () {
  navigator.clipboard?.writeText(UPI_ID).then(() => {
    this.textContent = '✓ Copied!';
    this.classList.add('copied');
    setTimeout(() => { this.textContent = '📋 Copy'; this.classList.remove('copied'); }, 2000);
  });
});

/* ---- GALLERY LIGHTBOX ---- */
document.querySelectorAll('.m-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.m-caption')?.textContent || '';
    if (!img) return;
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:2000;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:zoom-out;padding:1.5rem;';
    const i = document.createElement('img');
    i.src = img.src;
    i.style.cssText = 'max-width:92vw;max-height:82vh;object-fit:contain;border-radius:12px;';
    const cap = document.createElement('p');
    cap.textContent = caption;
    cap.style.cssText = 'color:rgba(255,255,255,.7);margin-top:1rem;font-size:.9rem;';
    ov.appendChild(i);
    ov.appendChild(cap);
    ov.addEventListener('click', () => ov.remove());
    document.body.appendChild(ov);
  });
});

/* ---- NEWS VIDEO EMBED (add your YouTube ID here) ---- */
// To embed your news video: set YOUR_YOUTUBE_VIDEO_ID below
// e.g. if your YouTube link is https://www.youtube.com/watch?v=abc123
// set: const NEWS_VIDEO_ID = 'abc123';
const NEWS_VIDEO_ID = ''; // ← PASTE YOUR YOUTUBE VIDEO ID HERE

const newsPlaceholder = document.getElementById('newsVideoPlaceholder');
const newsFrame = document.getElementById('newsVideoFrame');

if (NEWS_VIDEO_ID && newsFrame && newsPlaceholder) {
  // Auto-embed
  newsFrame.src = `https://www.youtube.com/embed/${NEWS_VIDEO_ID}?rel=0&modestbranding=1`;
  newsFrame.style.display = 'block';
  newsPlaceholder.style.cursor = 'default';
  const vepInner = newsPlaceholder.querySelector('.vep-inner');
  if (vepInner) vepInner.style.display = 'none';
} else if (newsPlaceholder) {
  // Click to prompt for video link
  newsPlaceholder.addEventListener('click', () => {
    const url = prompt('Enter your YouTube video URL or ID (e.g. https://youtu.be/abc123):');
    if (url) {
      const match = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
      const vid = match ? match[1] : url.trim();
      if (vid && newsFrame) {
        newsFrame.src = `https://www.youtube.com/embed/${vid}?rel=0&autoplay=1`;
        newsFrame.style.display = 'block';
        const vepInner = newsPlaceholder.querySelector('.vep-inner');
        if (vepInner) vepInner.style.display = 'none';
      }
    }
  });
}

/* ---- CONTACT FORM → WHATSAPP ---- */
const form = document.getElementById('inquiryForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fname')?.value.trim();
  const phone = document.getElementById('fphone')?.value.trim();
  const type = document.getElementById('ftype')?.value;
  const qty = document.getElementById('fqty')?.value.trim();
  const msg = document.getElementById('fmsg')?.value.trim();
  if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
  const labels = { retail:'Retail Order', wholesale:'Wholesale/Bulk', hotel:'Hotel/Restaurant', export:'Export' };
  const waMsg = `Hello Naveen Mangoes! 🥭\n\nName: ${name}\nPhone: ${phone}\nType: ${labels[type]||type}${qty ? '\nQty: '+qty : ''}${msg ? '\nMessage: '+msg : ''}\n\nI found you on your website.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`, '_blank');
});

/* ---- TICKER DUPLICATE FOR INFINITE LOOP ---- */
const ticker = document.querySelector('.ticker-inner');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}
const marquee = document.querySelector('.marquee-track');
if (marquee) {
  marquee.innerHTML += marquee.innerHTML;
}

/* ---- INIT ---- */
updateCartUI();
updateShopTotal();
