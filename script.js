/* =========================================================
   AK COLLECTION — MOBILE FIRST STORE SCRIPT
   ========================================================= */

const WHATSAPP_NUMBER = "923709039540";
const DELIVERY_FEE = 250;

const products = [
  {
    id: 1,
    name: "Automatic Skelton",
    category: "Watches",
    type: "Luxury",
    price: 6800,
    badge: "FEATURED",
    image: "blue-leather.jpg",
    description: "A bold royal-blue timepiece with a premium leather look, designed for a confident and elegant style."
  },
  {
    id: 2,
    name: "Rolex Blue",
    category: "Watches",
    type: "Classic",
    price: 2999,
    badge: "NEW",
    image: "blue-dial.jpg",
    description: "A clean classic watch with a striking blue dial and timeless everyday styling."
  },
  {
    id: 3,
    name: "Hublot Skelton",
    category: "Watches",
    type: "Modern",
    price: 4000,
    badge: "POPULAR",
    image: "silver-chronograph.jpg",
    description: "A modern silver chronograph-inspired design that adds a sharp finish to any outfit."
  },
  {
    id: 4,
    name: "Rolex Set",
    category: "Watches",
    type: "Luxury Set",
    price: 7200,
    badge: "LIMITED",
    image: "silver-set.jpg",
    description: "A premium silver watch set created for a refined and sophisticated look."
  },
  {
    id: 5,
    name: "Patek Philippe",
    category: "Watches",
    type: "Luxury",
    price: 2800,
    badge: "NEW",
    image: "white-dial.jpg",
    description: "A clean white-dial design with an elegant appearance, perfect for everyday wear."
  }
];

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");
const bagButton = document.getElementById("bagButton");
const closeCart = document.getElementById("closeCart");
const checkoutButton = document.getElementById("checkoutButton");
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const whatsappContact = document.getElementById("whatsappContact");
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalAdd = document.getElementById("modalAdd");

let cart = JSON.parse(localStorage.getItem("akCollectionCart")) || [];
let currentModalProduct = null;
let activeCategory = "Watches";

function formatPrice(price) {
  return "PKR " + Number(price).toLocaleString("en-PK");
}

function saveCart() {
  localStorage.setItem("akCollectionCart", JSON.stringify(cart));
}

function setupBrandLogo() {
  const brand = document.querySelector(".brand");
  if (brand) {
    const oldMark = brand.querySelector(".brand-mark");
    if (oldMark) {
      oldMark.innerHTML = `<img class="ak-logo-img" src="ak-logo.png" alt="AK Collection logo">`;
    }
  }

  const footerBrand = document.querySelector(".footer-brand");
  if (footerBrand) {
    const old = footerBrand.querySelector(".footer-mark");
    if (old) {
      old.outerHTML = `<img class="footer-logo-img" src="ak-logo.png" alt="AK Collection logo">`;
    }
  }
}

function setupMobileMenu() {
  const menuButton = document.querySelector(".menu-button");
  if (!menuButton || document.querySelector(".ak-mobile-menu")) return;

  const menuOverlay = document.createElement("div");
  menuOverlay.className = "ak-menu-overlay";

  const menu = document.createElement("div");
  menu.className = "ak-mobile-menu";
  menu.innerHTML = `
    <div class="menu-title">AK COLLECTION</div>
    <a href="#home">Home</a>
    <a href="#collection">Collection</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  `;

  document.body.append(menuOverlay, menu);

  const close = () => {
    menu.classList.remove("open");
    menuOverlay.classList.remove("show");
    document.body.style.overflow = "";
  };

  menuButton.addEventListener("click", () => {
    menu.classList.add("open");
    menuOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  menuOverlay.addEventListener("click", close);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
}

function setupCategories() {
  const collection = document.getElementById("collection");
  const grid = document.getElementById("productsGrid");
  if (!collection || !grid || document.querySelector(".ak-mobile-categories")) return;

  const bar = document.createElement("div");
  bar.className = "ak-mobile-categories";
  bar.innerHTML = `
    <button class="ak-category-btn active" data-category="Watches"><span>⌚</span>Watches</button>
    <button class="ak-category-btn" data-category="Wallets"><span>👛</span>Wallets</button>
    <button class="ak-category-btn" data-category="Caps"><span>🧢</span>Caps</button>
    <button class="ak-category-btn" data-category="Bracelets"><span>💎</span>Bracelets</button>
  `;

  grid.parentNode.insertBefore(bar, grid);

  bar.addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (!button) return;

    bar.querySelectorAll(".ak-category-btn").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts();
  });
}

function renderProducts(list = products) {
  if (!productsGrid) return;

  const visible = list.filter(p => p.category === activeCategory);

  if (!visible.length) {
    productsGrid.innerHTML = `
      <div style="grid-column:1/-1;padding:55px 20px;text-align:center;color:#777">
        <div style="font-size:28px;margin-bottom:10px">${activeCategory === "Wallets" ? "👛" : activeCategory === "Caps" ? "🧢" : "💎"}</div>
        <h3 style="margin-bottom:7px;font-family:Georgia,serif">Coming Soon</h3>
        <p>${activeCategory} collection will be added soon.</p>
      </div>`;
    return;
  }

  productsGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name} watch" loading="lazy">
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.type}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-actions">
          <button class="product-view" data-view="${product.id}">VIEW</button>
          <button class="product-add" data-add="${product.id}">ADD TO CART</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, quantity: 1 });

  saveCart();
  updateCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCart();
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getCartSubtotal();

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(subtotal);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your bag is empty.</p>
        <button class="btn btn-dark" id="continueShoppingNew">Continue Shopping</button>
      </div>`;
    document.getElementById("continueShoppingNew")?.addEventListener("click", closeCartDrawer);
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${formatPrice(p.price)} each</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:7px">
            <button data-minus="${p.id}" style="width:28px;height:28px;border:1px solid #ddd;background:#fff;border-radius:6px">−</button>
            <b>${item.quantity}</b>
            <button data-plus="${p.id}" style="width:28px;height:28px;border:1px solid #ddd;background:#fff;border-radius:6px">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${p.id}" aria-label="Remove">×</button>
      </div>`;
  }).join("");
}

function openCartDrawer() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentModalProduct = product;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalCategory.textContent = `${product.category} • ${product.type}`;
  modalName.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  modalDescription.textContent = product.description;

  productModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  productModal.classList.remove("show");
  document.body.style.overflow = "";
  currentModalProduct = null;
}

function createCheckout() {
  if (document.querySelector(".ak-checkout-modal")) return;

  const modal = document.createElement("div");
  modal.className = "ak-checkout-modal";
  modal.id = "akCheckout";
  modal.innerHTML = `
    <div class="ak-checkout-box">
      <div class="ak-checkout-head">
        <div>
          <div style="font-size:9px;letter-spacing:3px;color:#c89a53">AK COLLECTION</div>
          <h3>Complete Your Order</h3>
        </div>
        <button class="ak-checkout-close" aria-label="Close">×</button>
      </div>
      <div class="ak-checkout-body">
        <div class="ak-order-summary" id="akOrderSummary"></div>
        <form class="ak-checkout-form" id="akCheckoutForm">
          <label for="akName">Full Name</label>
          <input id="akName" required placeholder="Your name">

          <label for="akPhone">Phone Number</label>
          <input id="akPhone" required inputmode="tel" placeholder="03XX XXXXXXX">

          <label for="akCity">City</label>
          <input id="akCity" required placeholder="Your city">

          <label for="akAddress">Complete Address</label>
          <textarea id="akAddress" required placeholder="House / street / area"></textarea>

          <div class="ak-checkout-note">
            Delivery / advance: <b>${formatPrice(DELIVERY_FEE)}</b>.
            Your order request will be sent to AK Collection for confirmation.
          </div>

          <button class="ak-confirm-order" type="submit">Confirm Order</button>
          <button class="ak-whatsapp-order" type="button" id="akWhatsappOrder">Order on WhatsApp</button>
        </form>
      </div>
    </div>`;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  };

  modal.querySelector(".ak-checkout-close").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });

  modal.querySelector("#akCheckoutForm").addEventListener("submit", e => {
    e.preventDefault();
    sendCustomerOrder();
  });

  modal.querySelector("#akWhatsappOrder").addEventListener("click", sendCustomerOrder);
}

function refreshCheckoutSummary() {
  const box = document.getElementById("akOrderSummary");
  if (!box) return;

  const subtotal = getCartSubtotal();
  const grandTotal = subtotal + DELIVERY_FEE;

  box.innerHTML = `
    ${cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return p ? `<div class="ak-order-row"><span>${p.name} × ${item.quantity}</span><b>${formatPrice(p.price * item.quantity)}</b></div>` : "";
    }).join("")}
    <div class="ak-order-row"><span>Delivery / advance</span><b>${formatPrice(DELIVERY_FEE)}</b></div>
    <div class="ak-order-row total"><span>Order Total</span><b>${formatPrice(grandTotal)}</b></div>`;
}

function getCustomerDetails() {
  return {
    name: document.getElementById("akName")?.value.trim(),
    phone: document.getElementById("akPhone")?.value.trim(),
    city: document.getElementById("akCity")?.value.trim(),
    address: document.getElementById("akAddress")?.value.trim()
  };
}

function sendCustomerOrder() {
  if (!cart.length) {
    alert("Your bag is empty. Please add a product first.");
    return;
  }

  const data = getCustomerDetails();
  if (!data.name || !data.phone || !data.city || !data.address) {
    alert("Please fill in your name, phone, city and complete address.");
    return;
  }

  const subtotal = getCartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  let message = `Assalam-o-Alaikum AK Collection,%0A%0A`;
  message += `*New Order Request*%0A%0A`;

  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (p) message += `• ${p.name} × ${item.quantity} — ${formatPrice(p.price * item.quantity)}%0A`;
  });

  message += `%0A*Products Total:* ${formatPrice(subtotal)}%0A`;
  message += `*Delivery / Advance:* ${formatPrice(DELIVERY_FEE)}%0A`;
  message += `*Order Total:* ${formatPrice(total)}%0A%0A`;
  message += `*Customer Details*%0A`;
  message += `Name: ${encodeURIComponent(data.name)}%0A`;
  message += `Phone: ${encodeURIComponent(data.phone)}%0A`;
  message += `City: ${encodeURIComponent(data.city)}%0A`;
  message += `Address: ${encodeURIComponent(data.address)}%0A%0A`;
  message += `Please confirm my order.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank");

  const modal = document.getElementById("akCheckout");
  if (modal) {
    modal.querySelector(".ak-checkout-body").innerHTML = `
      <div class="ak-order-success">
        <div class="tick">✓</div>
        <h3 style="font-family:Georgia,serif;margin-bottom:8px">Order Request Sent</h3>
        <p style="color:#666;line-height:1.6">Your order details have been prepared for WhatsApp. AK Collection can now confirm the order and delivery details with you.</p>
        <button class="ak-confirm-order" style="margin-top:18px" id="akCloseSuccess">Done</button>
      </div>`;
    document.getElementById("akCloseSuccess").addEventListener("click", () => {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }
}

productsGrid?.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const view = e.target.closest("[data-view]");
  if (add) {
    addToCart(Number(add.dataset.add));
    add.textContent = "ADDED ✓";
    setTimeout(() => add.textContent = "ADD TO CART", 900);
  }
  if (view) openProductModal(Number(view.dataset.view));
});

cartItems?.addEventListener("click", e => {
  const remove = e.target.closest("[data-remove]");
  const plus = e.target.closest("[data-plus]");
  const minus = e.target.closest("[data-minus]");
  if (remove) removeFromCart(Number(remove.dataset.remove));
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
});

bagButton?.addEventListener("click", openCartDrawer);
closeCart?.addEventListener("click", closeCartDrawer);
overlay?.addEventListener("click", closeCartDrawer);

searchToggle?.addEventListener("click", () => {
  searchBox.classList.toggle("show");
  if (searchBox.classList.contains("show")) searchInput.focus();
  else { searchInput.value = ""; renderProducts(); }
});

searchInput?.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return renderProducts();

  const filtered = products.filter(p =>
    `${p.name} ${p.category} ${p.type}`.toLowerCase().includes(q)
  );
  renderProducts(filtered);
});

closeModal?.addEventListener("click", closeProductModal);
productModal?.addEventListener("click", e => {
  if (e.target === productModal) closeProductModal();
});

modalAdd?.addEventListener("click", () => {
  if (!currentModalProduct) return;
  addToCart(currentModalProduct.id);
  modalAdd.textContent = "ADDED TO BAG ✓";
  setTimeout(() => modalAdd.textContent = "ADD TO BAG", 1000);
});

checkoutButton?.addEventListener("click", () => {
  if (!cart.length) {
    alert("Your bag is empty. Please add a product first.");
    return;
  }
  createCheckout();
  refreshCheckoutSummary();
  document.getElementById("akCheckout").classList.add("show");
  document.body.style.overflow = "hidden";
});

whatsappContact?.addEventListener("click", () => {
  const message = encodeURIComponent("Assalam-o-Alaikum AK Collection, I would like to know more about your watches.");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeCartDrawer();
    closeProductModal();
    document.getElementById("akCheckout")?.classList.remove("show");
    document.body.style.overflow = "";
  }
});

setupBrandLogo();
setupMobileMenu();
setupCategories();
renderProducts();
updateCart();
