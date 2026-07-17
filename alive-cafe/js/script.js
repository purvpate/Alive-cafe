// ALIVE CAFE — shared behavior

// Your business WhatsApp number (used by both the Contact form and the order popup)
const ALIVE_CAFE_WHATSAPP = "919016826748";

// Track which dish the order popup is currently open for
let currentOrderItem = { name: "", price: "" };

// Open the order popup for a specific dish (called by each "Order" button)
function openOrderModal(dishName, price) {
  currentOrderItem = { name: dishName, price: price };
  const modal = document.getElementById("order-modal");
  if (!modal) return;
  const label = document.getElementById("order-modal-item");
  if (label) label.textContent = `${dishName} — ${price}`;
  const qty = document.getElementById("order-qty");
  if (qty) qty.value = 1;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  const modal = document.getElementById("order-modal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function adjustOrderQty(delta) {
  const qty = document.getElementById("order-qty");
  if (!qty) return;
  const next = Math.max(1, (parseInt(qty.value, 10) || 1) + delta);
  qty.value = next;
}

document.addEventListener('DOMContentLoaded', () => {
  // Order popup wiring (present on pages with a #order-modal)
  const orderModal = document.getElementById("order-modal");
  if (orderModal) {
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal || e.target.closest(".order-modal-close")) closeOrderModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOrderModal();
    });

    const orderForm = document.getElementById("order-form");
    if (orderForm) {
      orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const phone = document.getElementById("order-phone").value.trim();
        const address = document.getElementById("order-address").value.trim();
        const qty = document.getElementById("order-qty").value || "1";

        const text =
          `Hello Alive Cafe, I'd like to order:%0A` +
          `${currentOrderItem.name} (${currentOrderItem.price}) x ${qty}%0A%0A` +
          `Delivery Address: ${address}%0A` +
          `My Phone: ${phone}`;

        const url = `https://wa.me/${ALIVE_CAFE_WHATSAPP}?text=${text}`;
        window.open(url, "_blank");

        closeOrderModal();
        orderForm.reset();
      });
    }
  }

  // Floating WhatsApp button — present on every page, always points at the
  // one shared number above so it only ever needs updating in one place.
  const waFloat = document.getElementById("whatsapp-float");
  if (waFloat) {
    const greeting = "Hello Alive Cafe, I have a question!";
    waFloat.href = `https://wa.me/${ALIVE_CAFE_WHATSAPP}?text=${encodeURIComponent(greeting)}`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Active link highlighting
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(0,0,0,0.25)' : 'none';
    });
  }

  // Contact form (static demo — no backend)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent — thank you';
      btn.disabled = true;
      form.querySelectorAll('input, textarea').forEach(f => f.disabled = true);
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.querySelectorAll('input, textarea').forEach(f => { f.disabled = false; f.value=''; });
      }, 3200);
    });
  }

  // Menu filter (menu.html)
  const filterBtns = document.querySelectorAll('.menu-filter [data-filter]');
  if (filterBtns.length) {
    const items = document.querySelectorAll('[data-cat]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        items.forEach(it => {
          const show = f === 'all' || it.getAttribute('data-cat') === f;
          it.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Gallery lightbox (gallery.html)
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lbContent = lightbox.querySelector('.lightbox-inner');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lbContent.innerHTML = item.querySelector('.art').innerHTML;
        const label = item.querySelector('.cap')?.textContent || '';
        lightbox.querySelector('.lightbox-label').textContent = label;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLb = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.lightbox-close')) closeLb();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
  }
});


window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("loaded");
    setTimeout(() => { loader.style.display = "none"; }, 500);
  }
});