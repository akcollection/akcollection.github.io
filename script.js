/* =========================================================
   AK COLLECTION — STORE SCRIPT
   ========================================================= */

const WHATSAPP_NUMBER = "923709039540";
const DELIVERY_FEE = 250;


/* =========================================================
   PRODUCTS
   ========================================================= */

const products = [

  {
    id: 1,
    name: "Automatic Skelton",
    type: "Luxury",
    price: 6800,
    image: "blue-leather.jpg",
    description:
      "Premium automatic skeleton-style watch with a bold luxury appearance."
  },

  {
    id: 2,
    name: "Rolex Blue",
    type: "Classic",
    price: 2999,
    image: "blue-dial.jpg",
    description:
      "Elegant blue dial watch designed for a clean and timeless look."
  },

  {
    id: 3,
    name: "Hublot Skelton",
    type: "Modern",
    price: 4000,
    image: "silver-chronograph.jpg",
    description:
      "Modern skeleton-inspired design with a strong everyday presence."
  },

  {
    id: 4,
    name: "Rolex Set",
    type: "Luxury",
    price: 7200,
    image: "silver-set.jpg",
    description:
      "Premium watch set with a sophisticated and complete presentation."
  },

  {
    id: 5,
    name: "Patek Philippe",
    type: "Luxury",
    price: 2800,
    image: "white-dial.jpg",
    description:
      "Clean white dial design with a refined luxury-inspired appearance."
  }

];


/* =========================================================
   STATE
   ========================================================= */

let cart = JSON.parse(
  localStorage.getItem("akCollectionCart") || "[]"
);

let activeFilter = "All";


/* =========================================================
   ELEMENTS
   ========================================================= */

const productsGrid = document.getElementById("productsGrid");

const cartBtn = document.getElementById("cartBtn");
const cartClose = document.getElementById("cartClose");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");
const grandTotal = document.getElementById("grandTotal");

const checkoutBtn = document.getElementById("checkoutBtn");
const directWhatsapp = document.getElementById("directWhatsapp");

const productModal = document.getElementById("productModal");
const productModalClose =
  document.getElementById("productModalClose");

const productModalContent =
  document.getElementById("productModalContent");

const checkoutModal =
  document.getElementById("checkoutModal");

const checkoutClose =
  document.getElementById("checkoutClose");

const checkoutForm =
  document.getElementById("checkoutForm");

const checkoutWhatsapp =
  document.getElementById("checkoutWhatsapp");

const menuBtn =
  document.getElementById("menuBtn");

const mobileMenu =
  document.getElementById("mobileMenu");

const mobileClose =
  document.getElementById("mobileClose");

const menuOverlay =
  document.getElementById("menuOverlay");

const searchBtn =
  document.getElementById("searchBtn");

const searchBox =
  document.getElementById("searchBox");

const searchInput =
  document.getElementById("searchInput");

const closeSearch =
  document.getElementById("closeSearch");


/* =========================================================
   HELPERS
   ========================================================= */

function formatPrice(price) {
  return `PKR ${price.toLocaleString("en-PK")}`;
}


function saveCart() {
  localStorage.setItem(
    "akCollectionCart",
    JSON.stringify(cart)
  );
}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProducts() {

  const searchTerm =
    searchInput?.value.trim().toLowerCase() || "";

  let filtered = products.filter(product => {

    const matchesFilter =
      activeFilter === "All" ||
      product.type === activeFilter;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.type.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });


  if (!filtered.length) {

    productsGrid.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:60px 20px;
        color:#888;
        font-size:13px;
      ">
        No watches found.
      </div>
    `;

    return;
  }


  productsGrid.innerHTML = filtered.map(product => `

    <article class="product-card">

      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

      </div>


      <div class="product-info">

        <span class="product-type">
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
            onclick="openProduct(${product.id})"
          >
            VIEW
          </button>

          <button
            class="add-cart"
            onclick="addToCart(${product.id})"
          >
            ADD TO BAG
          </button>

        </div>

      </div>

    </article>

  `).join("");
}


/* =========================================================
   FILTERS
   ========================================================= */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".filter")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    activeFilter =
      button.dataset.filter;

    renderProducts();
  });

});


/* =========================================================
   SEARCH
   ========================================================= */

searchBtn.addEventListener("click", () => {

  searchBox.classList.toggle("show");

  if (searchBox.classList.contains("show")) {
    searchInput.focus();
  }

});


searchInput.addEventListener("input", renderProducts);


closeSearch.addEventListener("click", () => {

  searchInput.value = "";
  searchBox.classList.remove("show");

  renderProducts();

});


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) return;


  const existing =
    cart.find(item => item.id === productId);


  if (existing) {
    existing.quantity++;
  } else {

    cart.push({
      id: product.id,
      quantity: 1
    });

  }


  saveCart();
  renderCart();
  openCart();

}


function removeFromCart(productId) {

  cart =
    cart.filter(item => item.id !== productId);

  saveCart();
  renderCart();

}


function changeQuantity(productId, amount) {

  const item =
    cart.find(item => item.id === productId);

  if (!item) return;


  item.quantity += amount;


  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }


  saveCart();
  renderCart();

}


function getCartTotal() {

  return cart.reduce((total, item) => {

    const product =
      products.find(p => p.id === item.id);

    if (!product) return total;

    return total +
      product.price * item.quantity;

  }, 0);

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

  const totalItems =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );


  cartCount.textContent = totalItems;


  const subtotal =
    getCartTotal();


  cartTotal.textContent =
    formatPrice(subtotal);


  grandTotal.textContent =
    subtotal > 0
      ? formatPrice(subtotal + DELIVERY_FEE)
      : "PKR 0";


  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">

        <span>◇</span>

        <h3>Your bag is empty</h3>

        <p>
          Add a watch to get started.
        </p>

      </div>
    `;

    return;
  }


  cartItems.innerHTML = cart.map(item => {

    const product =
      products.find(p => p.id === item.id);

    if (!product) return "";


    return `

      <div class="cart-item">

        <img
          src="${product.image}"
          alt="${product.name}"
        >


        <div class="cart-item-info">

          <h4>${product.name}</h4>

          <p>
            ${formatPrice(product.price)}
          </p>


          <div class="cart-qty">

            <button
              onclick="changeQuantity(${product.id}, -1)"
            >
              −
            </button>

            <span>${item.quantity}</span>

            <button
              onclick="changeQuantity(${product.id}, 1)"
            >
              +
            </button>

          </div>

        </div>


        <button
          class="cart-remove"
          onclick="removeFromCart(${product.id})"
        >
          REMOVE
        </button>

      </div>

    `;

  }).join("");
}


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {

  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");

}


function closeCart() {

  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");

}


cartBtn.addEventListener("click", openCart);

cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function openProduct(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) return;


  productModalContent.innerHTML = `

    <div class="product-modal-content">

      <div class="modal-product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

      </div>


      <div class="modal-product-info">

        <span>${product.type}</span>

        <h2>${product.name}</h2>

        <div class="modal-price">
          ${formatPrice(product.price)}
        </div>

        <p>
          ${product.description}
        </p>

        <button
          class="modal-add"
          onclick="addToCart(${product.id}); closeProductModal();"
        >
          ADD TO BAG
        </button>

      </div>

    </div>

  `;


  productModal.classList.add("show");

}


function closeProductModal() {

  productModal.classList.remove("show");

}


productModalClose.addEventListener(
  "click",
  closeProductModal
);


productModal.addEventListener("click", event => {

  if (event.target === productModal) {
    closeProductModal();
  }

});


/* =========================================================
   CHECKOUT
   ========================================================= */

function openCheckout() {

  if (!cart.length) {
    alert("Please add a watch to your bag first.");
    return;
  }


  checkoutModal.classList.add("show");

}


function closeCheckout() {

  checkoutModal.classList.remove("show");

}


checkoutBtn.addEventListener(
  "click",
  openCheckout
);


checkoutClose.addEventListener(
  "click",
  closeCheckout
);


checkoutModal.addEventListener("click", event => {

  if (event.target === checkoutModal) {
    closeCheckout();
  }

});


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function createWhatsAppMessage(customer = {}) {

  const subtotal =
    getCartTotal();

  const total =
    subtotal + DELIVERY_FEE;


  let message =
    `*AK COLLECTION — NEW ORDER*%0A%0A`;


  cart.forEach(item => {

    const product =
      products.find(p => p.id === item.id);

    if (!product) return;


    const lineTotal =
      product.price * item.quantity;


    message +=
      `• ${product.name} x${item.quantity} — ${formatPrice(lineTotal)}%0A`;

  });


  message +=
    `%0A*Product Total:* ${formatPrice(subtotal)}`;

  message +=
    `%0A*Delivery / Advance:* ${formatPrice(DELIVERY_FEE)}`;

  message +=
    `%0A*Grand Total:* ${formatPrice(total)}`;


  if (customer.name) {

    message +=
      `%0A%0A*CUSTOMER DETAILS*`;

    message +=
      `%0AName: ${customer.name}`;

    message +=
      `%0APhone: ${customer.phone}`;

    message +=
      `%0ACity: ${customer.city}`;

    message +=
      `%0AAddress: ${customer.address}`;

  }


  return message;
}


/* DIRECT WHATSAPP */

directWhatsapp.addEventListener("click", () => {

  if (!cart.length) {
    alert("Please add a watch to your bag first.");
    return;
  }


  const message =
    createWhatsAppMessage();


  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    "_blank"
  );

});


/* CHECKOUT FORM */

checkoutForm.addEventListener("submit", event => {

  event.preventDefault();


  const customer = {

    name:
      document.getElementById("customerName").value.trim(),

    phone:
      document.getElementById("customerPhone").value.trim(),

    city:
      document.getElementById("customerCity").value.trim(),

    address:
      document.getElementById("customerAddress").value.trim()

  };


  const message =
    createWhatsAppMessage(customer);


  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    "_blank"
  );

});


/* SECOND WHATSAPP BUTTON */

checkoutWhatsapp.addEventListener("click", () => {

  const customer = {

    name:
      document.getElementById("customerName").value.trim(),

    phone:
      document.getElementById("customerPhone").value.trim(),

    city:
      document.getElementById("customerCity").value.trim(),

    address:
      document.getElementById("customerAddress").value.trim()

  };


  if (
    !customer.name ||
    !customer.phone ||
    !customer.city ||
    !customer.address
  ) {

    alert("Please fill all customer details first.");
    return;

  }


  const message =
    createWhatsAppMessage(customer);


  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    "_blank"
  );

});


/* =========================================================
   MOBILE MENU
   ========================================================= */

function openMobileMenu() {

  mobileMenu.classList.add("open");
  menuOverlay.classList.add("show");

}


function closeMobileMenu() {

  mobileMenu.classList.remove("open");
  menuOverlay.classList.remove("show");

}


menuBtn.addEventListener(
  "click",
  openMobileMenu
);

mobileClose.addEventListener(
  "click",
  closeMobileMenu
);

menuOverlay.addEventListener(
  "click",
  closeMobileMenu
);


document
  .querySelectorAll(".mobile-menu a")
  .forEach(link => {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;

  closeCart();
  closeProductModal();
  closeCheckout();
  closeMobileMenu();

});


/* =========================================================
   INITIALIZE
   ========================================================= */

renderProducts();
renderCart();
