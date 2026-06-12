/* ============================================================
   NAVEEN MANGO THAILAND — script.js
   Cart · Quantity Selector · WhatsApp Checkout · UPI
   ============================================================ */

let PRICE_PER_BOX = 1400;
const MANGOES_PER_BOX = 12;
const WA_NUMBER = '919538234899';
const UPI_ID = '9538234899@ybl';
const UPI_NAME = 'Naveen Mango Thailand';

// ===== STATE =====
let cartQty = 0;
let productQty = 1;
let stockLimit = 99;

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
  const maxQty = Math.max(1, stockLimit);
  productQty = Math.max(1, Math.min(maxQty, n));
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
    updateDynamicQRCode(total);
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
  if (cartQty < stockLimit) { cartQty++; updateCartUI(); }
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

// ===== DYNAMIC UPI FUNCTIONS =====
function updateDynamicQRCode(amount) {
  const qrImage = document.getElementById('upiQrCodeImage');
  if (!qrImage) return;
  const note = 'Thailand Mangoes ' + cartQty + ' Box' + (cartQty > 1 ? 'es' : '');
  const upiUrl = 'upi://pay?pa=' + UPI_ID + '&pn=' + encodeURIComponent(UPI_NAME) + '&am=' + amount + '&tn=' + encodeURIComponent(note) + '&cu=INR';
  // Generates a clean QR code using a high-performance open QR API
  qrImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=' + encodeURIComponent(upiUrl);
}

function initUPITabs() {
  const tabBtnQr = document.getElementById('tabBtnQr');
  const tabBtnApps = document.getElementById('tabBtnApps');
  const tabContentQr = document.getElementById('tabContentQr');
  const tabContentApps = document.getElementById('tabContentApps');
  
  if (!tabBtnQr || !tabBtnApps || !tabContentQr || !tabContentApps) return;
  
  tabBtnQr.addEventListener('click', () => {
    tabBtnQr.classList.add('active');
    tabBtnApps.classList.remove('active');
    tabContentQr.classList.add('active');
    tabContentApps.classList.remove('active');
  });
  
  tabBtnApps.addEventListener('click', () => {
    tabBtnApps.classList.add('active');
    tabBtnQr.classList.remove('active');
    tabContentApps.classList.add('active');
    tabContentQr.classList.remove('active');
  });
}

function initUPIAppLaunchers() {
  const btnPhonePe = document.getElementById('btnPayPhonePe');
  const btnGPay = document.getElementById('btnPayGPay');
  const btnPaytm = document.getElementById('btnPayPaytm');
  const btnGeneric = document.getElementById('btnPayGenericUPI');
  
  const getUpiUrl = (scheme) => {
    const total = cartQty * PRICE_PER_BOX;
    const note = 'Thailand Mangoes ' + cartQty + ' Box' + (cartQty > 1 ? 'es' : '');
    return scheme + '://pay?pa=' + UPI_ID + '&pn=' + encodeURIComponent(UPI_NAME) + '&am=' + total + '&tn=' + encodeURIComponent(note) + '&cu=INR';
  };
  
  const launchUpiUrl = (url, fallbackName) => {
    window.location.href = url;
    setTimeout(() => {
      const total = cartQty * PRICE_PER_BOX;
      alert('If ' + fallbackName + ' did not open automatically, please verify it is installed on your device or manually pay using the QR code / UPI ID:\n\nUPI ID: ' + UPI_ID + '\nAmount: ₹' + total.toLocaleString('en-IN') + '\n\nSend payment screenshot to WhatsApp +91 9538234899 to confirm order.');
    }, 2000);
  };
  
  btnPhonePe && btnPhonePe.addEventListener('click', () => {
    launchUpiUrl(getUpiUrl('phonepe'), 'PhonePe');
  });
  
  btnGPay && btnGPay.addEventListener('click', () => {
    launchUpiUrl(getUpiUrl('tez'), 'Google Pay');
  });
  
  btnPaytm && btnPaytm.addEventListener('click', () => {
    launchUpiUrl(getUpiUrl('paytmmp'), 'Paytm');
  });
  
  btnGeneric && btnGeneric.addEventListener('click', () => {
    launchUpiUrl(getUpiUrl('upi'), 'your UPI App');
  });
}

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

// ===== GALLERY LIGHTBOX (Dynamically handled in loadGallery) =====

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
    msg.textContent = title + ' video not yet uploaded. Share via WhatsApp to +91 9538234899.';
    modal.insertBefore(msg, cl);
  };
}

// ===== VIDEO HOVER PREVIEW LOGIC =====
function initVideoHoverPreviews() {
  const cards = document.querySelectorAll('.v-card');
  cards.forEach(card => {
    const video = card.querySelector('.v-preview');
    if (!video) return;
    
    card.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Playback failed or was interrupted (safely ignored)
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}
document.addEventListener('DOMContentLoaded', initVideoHoverPreviews);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initVideoHoverPreviews();
}

// ===== B2B WHOLESALE CALCULATOR =====
const calcSlider = document.getElementById('calcSlider');
const calcQtyVal = document.getElementById('calcQtyVal');
const calcTotalMangoes = document.getElementById('calcTotalMangoes');
const calcBasePrice = document.getElementById('calcBasePrice');
const calcDiscount = document.getElementById('calcDiscount');
const calcTotalAmt = document.getElementById('calcTotalAmt');
const calcWABtn = document.getElementById('calcWABtn');

function updateWholesaleCalc() {
  if (!calcSlider) return;
  const qty = parseInt(calcSlider.value, 10);
  const totalMangoes = qty * MANGOES_PER_BOX;
  const basePrice = qty * PRICE_PER_BOX;
  
  let discountPct = 0;
  if (qty >= 50) {
    discountPct = 20;
  } else if (qty >= 25) {
    discountPct = 15;
  } else if (qty >= 10) {
    discountPct = 10;
  } else if (qty >= 5) {
    discountPct = 5;
  }
  
  const discountAmt = Math.round(basePrice * (discountPct / 100));
  const finalPrice = basePrice - discountAmt;
  
  if (calcQtyVal) calcQtyVal.textContent = qty + ' Box' + (qty > 1 ? 'es' : '');
  if (calcTotalMangoes) calcTotalMangoes.textContent = totalMangoes.toLocaleString('en-IN') + ' Mangoes';
  if (calcBasePrice) calcBasePrice.textContent = '₹' + basePrice.toLocaleString('en-IN');
  if (calcDiscount) calcDiscount.textContent = '₹' + discountAmt.toLocaleString('en-IN') + ' (' + discountPct + '%)';
  if (calcTotalAmt) calcTotalAmt.textContent = '₹' + finalPrice.toLocaleString('en-IN');
}

if (calcSlider) {
  calcSlider.addEventListener('input', updateWholesaleCalc);
}

if (calcWABtn) {
  calcWABtn.addEventListener('click', () => {
    if (!calcSlider) return;
    const qty = parseInt(calcSlider.value, 10);
    const total = qty * PRICE_PER_BOX;
    
    let discountPct = 0;
    if (qty >= 50) discountPct = 20;
    else if (qty >= 25) discountPct = 15;
    else if (qty >= 10) discountPct = 10;
    else if (qty >= 5) discountPct = 5;
    
    const discountAmt = Math.round(total * (discountPct / 100));
    const finalPrice = total - discountAmt;
    
    const waMsg = 'Hello Naveen Mango Thailand! 🥭\n\n' +
      'I would like to inquire about a Wholesale/B2B order:\n' +
      'Quantity: ' + qty + ' box' + (qty > 1 ? 'es' : '') + ' (' + (qty * MANGOES_PER_BOX) + ' mangoes)\n' +
      'Estimated Wholesale Price: ₹' + finalPrice.toLocaleString('en-IN') + ' (after ' + discountPct + '% bulk discount)\n\n' +
      'Please let me know about delivery timeline and logistics to my location.\n' +
      'Website Calculator Inquiry.';
      
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(waMsg), '_blank');
  });
}

// ===== CDN / JSON CONFIG PATHS =====
const STOCK_CDN_URL = '/stock.json';
const GALLERY_CDN_URL = '/gallery.json';

// ===== LOAD DYNAMIC STOCK =====
async function loadStock() {
  let data = null;
  try {
    const res = await fetch(STOCK_CDN_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error('CDN fetch failed');
    data = await res.json();
  } catch (e) {
    console.warn('Could not load stock from CDN, falling back to local path:', e);
    try {
      const res = await fetch('./stock.json?t=' + Date.now());
      data = await res.json();
    } catch (localErr) {
      console.error('Failed to load local stock.json:', localErr);
    }
  }

  if (data && data.products && data.products.length > 0) {
    const product = data.products.find(p => p.id === 'thailand-mango-box') || data.products[0];
    
    if (product.price) {
      PRICE_PER_BOX = product.price;
    }

    if (product.stock !== undefined && product.stock !== null) {
      stockLimit = parseInt(product.stock, 10);
    } else if (product.status === 'out_of_stock') {
      stockLimit = 0;
    } else {
      stockLimit = 99;
    }

    if (cartQty > stockLimit) {
      cartQty = stockLimit;
    }

    const priceFormatted = '₹' + PRICE_PER_BOX.toLocaleString('en-IN');
    
    const productPriceEl = document.getElementById('productPrice');
    if (productPriceEl) productPriceEl.textContent = priceFormatted;

    const bentoPriceEl = document.getElementById('bentoPrice');
    if (bentoPriceEl) bentoPriceEl.textContent = priceFormatted;

    const heroOrderPriceText = document.getElementById('heroOrderBtnText');
    if (heroOrderPriceText) heroOrderPriceText.textContent = 'Order Now — ' + priceFormatted + '/box';

    document.querySelectorAll('.dynamic-price').forEach(el => {
      el.textContent = priceFormatted;
    });

    const badge = document.getElementById('stockBadge');
    const cartBtn = document.getElementById('addToCartBtn');
    const orderBtn = document.getElementById('quickOrderBtn');
    
    if (badge) {
      badge.className = 'stock-badge';
      if (product.status === 'out_of_stock' || product.stock === 0) {
        badge.textContent = 'Out of Stock';
        badge.classList.add('out-of-stock');
        
        if (cartBtn) {
          cartBtn.classList.add('disabled');
          cartBtn.innerHTML = 'Sold Out';
        }
        if (orderBtn) {
          orderBtn.classList.add('disabled');
          orderBtn.innerHTML = 'Out of Stock';
        }
      } else if (product.status === 'low_stock' || (product.stock && product.stock <= 5)) {
        const count = product.stock ? ' (Only ' + product.stock + ' left!)' : ' (Low Stock)';
        badge.textContent = 'Low Stock' + count;
        badge.classList.add('low-stock');
        
        if (cartBtn) {
          cartBtn.classList.remove('disabled');
          cartBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Add to Cart';
        }
        if (orderBtn) {
          orderBtn.classList.remove('disabled');
          orderBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Quick WhatsApp Order';
        }
      } else {
        badge.textContent = 'In Stock';
        badge.classList.add('in-stock');
        
        if (cartBtn) {
          cartBtn.classList.remove('disabled');
          cartBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Add to Cart';
        }
        if (orderBtn) {
          orderBtn.classList.remove('disabled');
          orderBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Quick WhatsApp Order';
        }
      }
    }

    updateProductQty(productQty);
    updateCartUI();
    if (typeof updateWholesaleCalc === 'function') {
      updateWholesaleCalc();
    }
  }
}

// ===== IMAGE LIGHTBOX ZOOM =====
function zoomImage(src, captionText = '') {
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.94);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:zoom-out;padding:1.5rem;';
  
  const big = document.createElement('img');
  big.src = src;
  big.style.cssText = 'max-width:92vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.8);transition:transform 0.3s ease;';
  
  const cl = document.createElement('button');
  cl.innerHTML = '✕';
  cl.style.cssText = 'position:absolute;top:1.5rem;right:2rem;background:rgba(255,255,255,.12);border:none;border-radius:50%;width:40px;height:40px;color:#fff;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;';
  cl.addEventListener('click', e => { e.stopPropagation(); ov.remove(); });
  
  ov.appendChild(big);
  ov.appendChild(cl);
  
  if (captionText) {
    const cap = document.createElement('p');
    cap.textContent = captionText;
    cap.style.cssText = 'color:rgba(255,255,255,0.95);margin-top:1.2rem;font-size:0.95rem;font-weight:600;text-align:center;max-width:650px;text-shadow:0 2px 5px rgba(0,0,0,0.6);line-height:1.4;font-family:sans-serif;';
    ov.appendChild(cap);
  }
  
  ov.addEventListener('click', () => ov.remove());
  document.body.appendChild(ov);
}

// ===== LOAD DYNAMIC GALLERY (GOOGLE DRIVE + LOCAL) =====
async function loadGallery() {
  let data = null;
  try {
    const res = await fetch(GALLERY_CDN_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error('CDN fetch failed');
    data = await res.json();
  } catch (e) {
    console.warn('Could not load gallery from CDN, falling back to local path:', e);
    try {
      const res = await fetch('./gallery.json?t=' + Date.now());
      data = await res.json();
    } catch (localErr) {
      console.error('Failed to load local gallery.json:', localErr);
    }
  }

  if (data && data.images) {
    const grid = document.getElementById('galleryMasonry');
    if (grid) {
      grid.innerHTML = '';
      data.images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'm-item';
        if (img.aspect === 'tall') item.classList.add('m-tall');
        if (img.aspect === 'wide') item.classList.add('m-wide');

        const imageEl = document.createElement('img');
        
        let srcUrl = img.src;
        if (img.type === 'drive' || (!img.src && img.id)) {
          srcUrl = 'https://drive.google.com/thumbnail?id=' + img.id + '&sz=w1200';
        }
        
        imageEl.src = srcUrl;
        imageEl.alt = img.alt || 'Thailand Mango Farm';
        imageEl.loading = 'lazy';
        imageEl.onerror = () => {
          imageEl.src = 'Images/mango.png';
        };

        const caption = document.createElement('div');
        caption.className = 'm-caption';
        caption.textContent = img.caption || '';

        item.appendChild(imageEl);
        item.appendChild(caption);

        item.addEventListener('click', () => {
          zoomImage(imageEl.src, img.caption);
        });

        grid.appendChild(item);
      });
    }
  }
}

// ===== INIT =====
updateProductQty(1);
updateCartUI();
if (calcSlider) {
  updateWholesaleCalc();
}
loadStock();
loadGallery();
initUPITabs();
initUPIAppLaunchers();

// ===== FAQ ACCORDION TOGGLE =====
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const qBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (qBtn && answer) {
      qBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items first
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            if (otherIcon) otherIcon.textContent = '+';
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current FAQ item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          if (icon) icon.textContent = '+';
          qBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) icon.textContent = '−';
          qBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', initFAQAccordion);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initFAQAccordion();
}



