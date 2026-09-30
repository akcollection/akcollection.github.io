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

/* =========================================================
   ELEMENTS
   ========================================================= */

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartGrandTotal = document.getElementById("cartGrandTotal");
const overlay = document.getElementById("overlay");

const bagButton = document.getElementById("bagButton");
const closeCart = document.getElementById("closeCart");
const checkoutButton = document.getElementById("checkoutButton");

const whatsappOrderButton =
  document.getElementById("whatsappOrderButton");

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

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutWhatsapp = document.getElementById("checkoutWhatsapp");

let cart = JSON.parse(localStorage.getItem("akCollectionCart")) || [];
let currentModalProduct = null;
let activeCategory = "Watches";

/* =========================================================
   HELPERS
   ========================================================= */

function formatPrice(price) {
  return "PKR " + Number(price).toLocaleString("en-PK");
}

function saveCart() {
  localStorage.setItem("akCollectionCart", JSON.stringify(cart));
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);

    if (!product) return sum;

    return sum + product.price * item.quantity;
  }, 0);
}

function getCartGrandTotal() {
  return getCartSubtotal() + DELIVERY_FEE;
}

/* =========================================================
   BRAND LOGO
   ========================================================= */

function setupBrandLogo() {
  const brand = document.querySelector(".brand");

  if (brand) {
    const oldMark = brand.querySelector(".brand-mark");

    if (oldMark) {
      oldMark.innerHTML = `
        <img
          class="ak-logo-img"
          src="ak-logo.png"
          alt="AK Collection logo"
        >
      `;
    }
  }

  const footerBrand = document.querySelector(".footer-brand");

  if (footerBrand) {
    const old = footerBrand.querySelector(".footer-mark");

    if (old) {
      old.outerHTML = `
        <img
          class="footer-logo-img"
          src="ak-logo.png"
          alt="AK Collection logo"
        >
      `;
    }
  }
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
  const menuButton = document.querySelector(".menu-button");

  if (!menuButton || document.querySelector(".ak-mobile-menu")) {
    return;
  }

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

  function closeMenu() {
    menu.classList.remove("open");
    menuOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  menuButton.addEventListener("click", () => {
    menu.classList.add("open");
    menuOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  menuOverlay.addEventListener("click", closeMenu);

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategories() {
  const collection = document.getElementById("collection");
  const grid = document.getElementById("productsGrid");

  if (
    !collection ||
    !grid ||
    document.querySelector(".ak-mobile-categories")
  ) {
    return;
  }

  const bar = document.createElement("div");

  bar.className = "ak-mobile-categories";

  bar.innerHTML = `
    <button
      class="ak-category-btn active"
      data-category="Watches"
    >
      <span>⌚</span>
      Watches
    </button>

    <button
      class="ak-category-btn"
      data-category="Wallets"
    >
      <span>👛</span>
      Wallets
    </button>

    <button
      class="ak-category-btn"
      data-category="Caps"
    >
      <span>🧢</span>
      Caps
    </button>

    <button
      class="ak-category-btn"
      data-category="Bracelets"
    >
      <span>💎</span>
      Bracelets
    </button>
  `;

  grid.parentNode.insertBefore(bar, grid);

  bar.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    bar.querySelectorAll(".ak-category-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    activeCategory = button.dataset.category;

    renderProducts();
  });
}

/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProducts(list = products) {
  if (!productsGrid) return;

  const visibleProducts = list.filter(
    product => product.category === activeCategory
  );

  if (!visibleProducts.length) {
    let icon = "💎";

    if (activeCategory === "Wallets") {
      icon = "👛";
    }

    if (activeCategory === "Caps") {
      icon = "🧢";
    }

    productsGrid.innerHTML = `
      <div
        style="
          grid-column:1/-1;
          padding:55px 20px;
          text-align:center;
          color:#777;
        "
      >
        <div style="font-size:28px;margin-bottom:10px">
          ${icon}
        </div>

        <h3
          style="
            margin-bottom:7px;
            font-family:Georgia,serif;
          "
        >
          Coming Soon
        </h3>

        <p>
          ${activeCategory} collection will be added soon.
        </p>
      </div>
    `;

    return;
  }

  productsGrid.innerHTML = visibleProducts
    .map(product => {
      return `
        <article class="product-card">

          <div class="product-image">
            <img
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            >

            <span class="product-badge">
              ${product.badge}
            </span>
          </div>

          <div class="product-info">

            <span class="product-category">
              ${product.type}
            </span>

            <h3 class="product-name">
              ${product.name}
            </h3>

            <div class="product-price">
              ${formatPrice(product.price)}
            </div>

            <div class="product-actions">

              <button
                class="product-view"
                data-view="${product.id}"
              >
                VIEW
              </button>

              <button
                class="product-add"
                data-add="${product.id}"
              >
                ADD TO CART
              </button>

            </div>

          </div>

        </article>
      `;
    })
    .join("");
}

/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  updateCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find(i => i.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  saveCart();
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = getCartSubtotal();
  const grandTotal = subtotal + DELIVERY_FEE;

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(subtotal);
  }

  if (cartGrandTotal) {
    cartGrandTotal.textContent = formatPrice(
      cart.length ? grandTotal : DELIVERY_FEE
    );
  }

  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">

        <p>Your bag is empty.</p>

        <button
          class="btn btn-dark"
          id="continueShoppingNew"
        >
          Continue Shopping
        </button>

      </div>
    `;

    document
      .getElementById("continueShoppingNew")
      ?.addEventListener("click", closeCartDrawer);

    return;
  }

  cartItems.innerHTML = cart
    .map(item => {
      const product = products.find(
        p => p.id === item.id
      );

      if (!product) return "";

      return `
        <div class="cart-item">

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <div>

            <div class="cart-item-name">
              ${product.name}
            </div>

            <div class="cart-item-price">
              ${formatPrice(product.price)} each
            </div>

            <div
              style="
                display:flex;
                align-items:center;
                gap:8px;
                margin-top:7px;
              "
            >

              <button
                data-minus="${product.id}"
                style="
                  width:28px;
                  height:28px;
                  border:1px solid #ddd;
                  background:#fff;
                  border-radius:6px;
                "
              >
                −
              </button>

              <b>${item.quantity}</b>

              <button
                data-plus="${product.id}"
                style="
                  width:28px;
                  height:28px;
                  border:1px solid #ddd;
                  background:#fff;
                  border-radius:6px;
                "
              >
                +
              </button>

            </div>

          </div>

          <button
            class="remove-item"
            data-remove="${product.id}"
            aria-label="Remove"
          >
            ×
          </button>

        </div>
      `;
    })
    .join("");
}

function openCartDrawer() {
  if (!cartDrawer) return;

  cartDrawer.classList.add("open");

  overlay?.classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer?.classList.remove("open");

  overlay?.classList.remove("show");

  document.body.style.overflow = "";
}

/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);

  if (!product || !productModal) return;

  currentModalProduct = product;

  modalImage.src = product.image;
  modalImage.alt = product.name;

  modalCategory.textContent =
    `${product.category} • ${product.type}`;

  modalName.textContent = product.name;

  modalPrice.textContent =
    formatPrice(product.price);

  modalDescription.textContent =
    product.description;

  productModal.classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  productModal?.classList.remove("show");

  document.body.style.overflow = "";

  currentModalProduct = null;
}

/* =========================================================
   CHECKOUT
   ========================================================= */

function getCustomerDetails() {
  return {
    name: document.getElementById("customerName")?.value.trim(),
    phone: document.getElementById("customerPhone")?.value.trim(),
    city: document.getElementById("customerCity")?.value.trim(),
    address: document.getElementById("customerAddress")?.value.trim()
  };
}

function openCheckout() {
  if (!cart.length) {
    alert(
      "Your bag is empty. Please add a product first."
    );
    return;
  }

  if (!checkoutModal) {
    alert("Checkout system is not available.");
    return;
  }

  checkoutModal.classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutModal?.classList.remove("show");

  document.body.style.overflow = "";
}

function buildWhatsAppMessage(customer) {
  const subtotal = getCartSubtotal();
  const total = subtotal + DELIVERY_FEE;

  let message =
    "Assalam-o-Alaikum AK Collection,%0A%0A";

  message +=
    "*NEW ORDER REQUEST*%0A%0A";

  cart.forEach(item => {
    const product = products.find(
      p => p.id === item.id
    );

    if (product) {
      message +=
        `• ${encodeURIComponent(product.name)} × ${item.quantity} — ${encodeURIComponent(formatPrice(product.price * item.quantity))}%0A`;
    }
  });

  message +=
    `%0A*Products Total:* ${encodeURIComponent(formatPrice(subtotal))}%0A`;

  message +=
    `*Delivery / Advance:* ${encodeURIComponent(formatPrice(DELIVERY_FEE))}%0A`;

  message +=
    `*TOTAL PAYABLE:* ${encodeURIComponent(formatPrice(total))}%0A%0A`;

  message +=
    "*CUSTOMER DETAILS*%0A";

  message +=
    `Name: ${encodeURIComponent(customer.name)}%0A`;

  message +=
    `Phone: ${encodeURIComponent(customer.phone)}%0A`;

  message +=
    `City: ${encodeURIComponent(customer.city)}%0A`;

  message +=
    `Address: ${encodeURIComponent(customer.address)}%0A%0A`;

  message +=
    "Please confirm my order.";

  return message;
}

function sendOrderToWhatsApp() {
  if (!cart.length) {
    alert(
      "Your bag is empty. Please add a product first."
    );
    return;
  }

  const customer = getCustomerDetails();

  if (
    !customer.name ||
    !customer.phone ||
    !customer.city ||
    !customer.address
  ) {
    alert(
      "Please fill in your name, phone, city and complete address."
    );
    return;
  }

  const message =
    buildWhatsAppMessage(customer);

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  window.open(url, "_blank");

  showOrderSuccess();
}

function showOrderSuccess() {
  const checkoutBox =
    checkoutModal?.querySelector(".checkout-box");

  if (!checkoutBox) return;

  checkoutBox.innerHTML = `
    <button
      class="checkout-close"
      id="successClose"
    >
      ×
    </button>

    <div
      style="
        text-align:center;
        padding:35px 20px;
      "
    >

      <div
        style="
          width:65px;
          height:65px;
          margin:0 auto 18px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#111;
          color:#fff;
          font-size:30px;
        "
      >
        ✓
      </div>

      <span class="eyebrow">
        AK COLLECTION
      </span>

      <h2
        style="
          font-family:Georgia,serif;
          margin:12px 0;
        "
      >
        Order Ready
      </h2>

      <p
        style="
          color:#666;
          line-height:1.7;
        "
      >
        Your order details have been prepared
        for WhatsApp. Please send the message
        on WhatsApp to confirm your order.
      </p>

      <button
        class="confirm-order"
        id="successDone"
        style="margin-top:20px"
      >
        DONE
      </button>

    </div>
  `;

  document
    .getElementById("successClose")
    ?.addEventListener(
      "click",
      closeCheckoutModal
    );

  document
    .getElementById("successDone")
    ?.addEventListener(
      "click",
      closeCheckoutModal
    );
}

/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

productsGrid?.addEventListener(
  "click",
  event => {
    const add =
      event.target.closest("[data-add]");

    const view =
      event.target.closest("[data-view]");

    if (add) {
      const productId =
        Number(add.dataset.add);

      addToCart(productId);

      add.textContent = "ADDED ✓";

      setTimeout(() => {
        add.textContent = "ADD TO CART";
      }, 900);
    }

    if (view) {
      openProductModal(
        Number(view.dataset.view)
      );
    }
  }
);

/* =========================================================
   CART BUTTONS
   ========================================================= */

cartItems?.addEventListener(
  "click",
  event => {
    const remove =
      event.target.closest("[data-remove]");

    const plus =
      event.target.closest("[data-plus]");

    const minus =
      event.target.closest("[data-minus]");

    if (remove) {
      removeFromCart(
        Number(remove.dataset.remove)
      );
    }

    if (plus) {
      changeQuantity(
        Number(plus.dataset.plus),
        1
      );
    }

    if (minus) {
      changeQuantity(
        Number(minus.dataset.minus),
        -1
      );
    }
  }
);

/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

bagButton?.addEventListener(
  "click",
  openCartDrawer
);

closeCart?.addEventListener(
  "click",
  closeCartDrawer
);

overlay?.addEventListener(
  "click",
  closeCartDrawer
);

/* =========================================================
   SEARCH
   ========================================================= */

searchToggle?.addEventListener(
  "click",
  () => {
    searchBox?.classList.toggle("show");

    if (
      searchBox?.classList.contains("show")
    ) {
      searchInput?.focus();
    } else {
      if (searchInput) {
        searchInput.value = "";
      }

      renderProducts();
    }
  }
);

searchInput?.addEventListener(
  "input",
  () => {
    const query =
      searchInput.value.trim().toLowerCase();

    if (!query) {
      renderProducts();
      return;
    }

    const filtered =
      products.filter(product =>
        `${product.name} ${product.category} ${product.type}`
          .toLowerCase()
          .includes(query)
      );

    renderProducts(filtered);
  }
);

/* =========================================================
   PRODUCT MODAL EVENTS
   ========================================================= */

closeModal?.addEventListener(
  "click",
  closeProductModal
);

productModal?.addEventListener(
  "click",
  event => {
    if (event.target === productModal) {
      closeProductModal();
    }
  }
);

modalAdd?.addEventListener(
  "click",
  () => {
    if (!currentModalProduct) return;

    addToCart(
      currentModalProduct.id
    );

    modalAdd.textContent =
      "ADDED TO BAG ✓";

    setTimeout(() => {
      modalAdd.textContent =
        "ADD TO BAG";
    }, 1000);
  }
);

/* =========================================================
   CHECKOUT EVENTS
   ========================================================= */

checkoutButton?.addEventListener(
  "click",
  openCheckout
);

whatsappOrderButton?.addEventListener(
  "click",
  () => {
    openCheckout();
  }
);

closeCheckout?.addEventListener(
  "click",
  closeCheckoutModal
);

checkoutModal?.addEventListener(
  "click",
  event => {
    if (event.target === checkoutModal) {
      closeCheckoutModal();
    }
  }
);

checkoutForm?.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    sendOrderToWhatsApp();
  }
);

checkoutWhatsapp?.addEventListener(
  "click",
  sendOrderToWhatsApp
);

/* =========================================================
   CONTACT WHATSAPP
   ========================================================= */

whatsappContact?.addEventListener(
  "click",
  () => {
    const message = encodeURIComponent(
      "Assalam-o-Alaikum AK Collection, I would like to know more about your watches."
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank"
    );
  }
);

/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeCartDrawer();
      closeProductModal();
      closeCheckoutModal();
    }
  }
);

/* =========================================================
   START
   ========================================================= */

setupBrandLogo();
setupMobileMenu();
setupCategories();
renderProducts();
updateCart();
