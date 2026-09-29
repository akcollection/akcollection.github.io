/* =========================================
   AK COLLECTION — STORE SCRIPT
   ========================================= */

const WHATSAPP_NUMBER = "923709039540";


/* =========================================
   PRODUCTS
   ========================================= */

const products = [
  {
    id: 1,
    name: "Automatic skelton",
    category: "Men",
    type: "Luxury",
    price: 6800,
    badge: "FEATURED",
    image: "images/blue-leather.jpg",
    description:
      "A bold royal-blue timepiece with a premium leather look, designed for a confident and elegant style."
  },

  {
    id: 2,
    name: "Rolex blue",
    category: "unisex",
    type: "Classic",
    price: 2999,
    badge: "NEW",
    image: "images/blue-dial.jpg",
    description:
      "A clean classic watch with a striking blue dial and timeless everyday styling."
  },

  {
    id: 3,
    name: "Hublot skelton",
    category: "Men",
    type: "Modern",
    price: 4000,
    badge: "POPULAR",
    image: "images/silver-chronograph.jpg",
    description:
      "A modern silver chronograph-inspired design that adds a sharp finish to any outfit."
  },

  {
    id: 4,
    name: "Rolex Set",
    category: "Luxury",
    type: "Set",
    price: 7200,
    badge: "LIMITED",
    image: "images/silver-set.jpg",
    description:
      "A premium silver watch set created for a refined and sophisticated look."
  },

  {
    id: 5,
    name: "Patek Phillipe",
    category: "Classic",
    type: "Luxury",
    price: 2800,
    badge: "NEW",
    image: "images/white-dial.jpg",
    description:
      "A clean white-dial design with an elegant appearance, perfect for everyday wear."
  }
];


/* =========================================
   ELEMENTS
   ========================================= */

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");

const bagButton = document.getElementById("bagButton");
const closeCart = document.getElementById("closeCart");
const continueShopping = document.getElementById("continueShopping");
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


/* =========================================
   CART
   ========================================= */

let cart = JSON.parse(localStorage.getItem("akCollectionCart")) || [];

let currentModalProduct = null;


/* =========================================
   PRICE FORMAT
   ========================================= */

function formatPrice(price) {
  return "PKR " + price.toLocaleString("en-PK");
}


/* =========================================
   SAVE CART
   ========================================= */

function saveCart() {
  localStorage.setItem("akCollectionCart", JSON.stringify(cart));
}


/* =========================================
   RENDER PRODUCTS
   ========================================= */

function renderProducts(list = products) {

  if (!productsGrid) return;

  if (list.length === 0) {

    productsGrid.innerHTML = `
      <div style="
        grid-column: 1 / -1;
        padding: 60px 20px;
        text-align: center;
        color: #777;
      ">
        <h3 style="margin-bottom:8px;">No watches found</h3>
        <p>Try another search or category.</p>
      </div>
    `;

    return;
  }


  productsGrid.innerHTML = list.map(product => {

    return `
      <article class="product-card">

        <div class="product-image">

          <img
            src="${product.image}"
            alt="${product.name} watch"
            loading="lazy"
          >

          <span class="product-badge">
            ${product.badge}
          </span>

        </div>

        <div class="product-info">

          <span class="product-category">
            ${product.category} • ${product.type}
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
              ADD TO BAG
            </button>

          </div>

        </div>

      </article>
    `;

  }).join("");
}


/* =========================================
   PRODUCT BUTTONS
   ========================================= */

productsGrid.addEventListener("click", function(event) {

  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");


  if (addButton) {

    const id = Number(addButton.dataset.add);

    addToCart(id);

    addButton.textContent = "ADDED ✓";

    setTimeout(() => {
      addButton.textContent = "ADD TO BAG";
    }, 1000);

  }


  if (viewButton) {

    const id = Number(viewButton.dataset.view);

    openProductModal(id);

  }

});


/* =========================================
   ADD TO CART
   ========================================= */

function addToCart(productId) {

  const product = products.find(item => item.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      id: product.id,
      quantity: 1
    });

  }

  saveCart();
  updateCart();

}


/* =========================================
   REMOVE FROM CART
   ========================================= */

function removeFromCart(productId) {

  cart = cart.filter(item => item.id !== productId);

  saveCart();
  updateCart();

}


/* =========================================
   CART UPDATE
   ========================================= */

function updateCart() {

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce((sum, item) => {

    const product = products.find(
      product => product.id === item.id
    );

    return sum + (product ? product.price * item.quantity : 0);

  }, 0);


  cartCount.textContent = totalItems;

  cartTotal.textContent = formatPrice(totalPrice);


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">

        <p>Your bag is empty.</p>

        <button class="btn btn-dark" id="continueShopping">
          Continue Shopping
        </button>

      </div>
    `;

    const newContinueButton =
      document.getElementById("continueShopping");

    if (newContinueButton) {
      newContinueButton.addEventListener(
        "click",
        closeCartDrawer
      );
    }

    return;
  }


  cartItems.innerHTML = cart.map(item => {

    const product = products.find(
      product => product.id === item.id
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
            ${formatPrice(product.price)} × ${item.quantity}
          </div>

        </div>

        <button
          class="remove-item"
          data-remove="${product.id}"
          aria-label="Remove ${product.name}"
        >
          ×
        </button>

      </div>
    `;

  }).join("");

}


/* =========================================
   CART REMOVE BUTTON
   ========================================= */

cartItems.addEventListener("click", function(event) {

  const removeButton =
    event.target.closest("[data-remove]");

  if (!removeButton) return;

  const id = Number(removeButton.dataset.remove);

  removeFromCart(id);

});


/* =========================================
   OPEN CART
   ========================================= */

function openCartDrawer() {

  cartDrawer.classList.add("open");
  overlay.classList.add("show");

  document.body.style.overflow = "hidden";

}


/* =========================================
   CLOSE CART
   ========================================= */

function closeCartDrawer() {

  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");

  document.body.style.overflow = "";

}


/* =========================================
   CART EVENTS
   ========================================= */

bagButton.addEventListener(
  "click",
  openCartDrawer
);

closeCart.addEventListener(
  "click",
  closeCartDrawer
);

overlay.addEventListener(
  "click",
  closeCartDrawer
);


/* =========================================
   SEARCH
   ========================================= */

searchToggle.addEventListener("click", function() {

  searchBox.classList.toggle("show");

  if (searchBox.classList.contains("show")) {

    searchInput.focus();

  } else {

    searchInput.value = "";
    renderProducts(products);

  }

});


searchInput.addEventListener("input", function() {

  const query =
    searchInput.value.trim().toLowerCase();

  if (!query) {

    renderProducts(products);

    return;

  }


  const results = products.filter(product => {

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.type.toLowerCase().includes(query)
    );

  });


  renderProducts(results);

});


/* =========================================
   FILTERS
   ========================================= */

const filterButtons =
  document.querySelectorAll(".filter");


filterButtons.forEach(button => {

  button.addEventListener("click", function() {

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");


    const filter =
      button.dataset.filter;


    if (filter === "all") {

      renderProducts(products);

      return;

    }


    const filtered = products.filter(product => {

      return (
        product.category === filter ||
        product.type === filter
      );

    });


    renderProducts(filtered);

  });

});


/* =========================================
   PRODUCT MODAL
   ========================================= */

function openProductModal(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product) return;

  currentModalProduct = product;


  modalImage.src = product.image;
  modalImage.alt = product.name;

  modalCategory.textContent =
    `${product.category} • ${product.type}`;

  modalName.textContent =
    product.name;

  modalPrice.textContent =
    formatPrice(product.price);

  modalDescription.textContent =
    product.description;


  productModal.classList.add("show");

  document.body.style.overflow = "hidden";

}


function closeProductModal() {

  productModal.classList.remove("show");

  document.body.style.overflow = "";

  currentModalProduct = null;

}


closeModal.addEventListener(
  "click",
  closeProductModal
);


productModal.addEventListener(
  "click",
  function(event) {

    if (event.target === productModal) {
      closeProductModal();
    }

  }
);


modalAdd.addEventListener("click", function() {

  if (!currentModalProduct) return;

  addToCart(currentModalProduct.id);

  modalAdd.textContent = "ADDED TO BAG ✓";

  setTimeout(() => {

    modalAdd.textContent = "ADD TO BAG";

  }, 1000);

});


/* =========================================
   WHATSAPP ORDER
   ========================================= */

checkoutButton.addEventListener("click", function() {

  if (cart.length === 0) {

    alert("Your bag is empty. Please add a watch first.");

    return;

  }


  let message =
    "Assalam-o-Alaikum AK Collection,%0A%0A";

  message +=
    "*I want to place an order:*%0A%0A";


  let total = 0;


  cart.forEach(item => {

    const product =
      products.find(product => product.id === item.id);

    if (!product) return;


    const itemTotal =
      product.price * item.quantity;

    total += itemTotal;


    message +=
      `• ${product.name} × ${item.quantity} — ${formatPrice(itemTotal)}%0A`;

  });


  message +=
    `%0A*Total: ${formatPrice(total)}*%0A%0A`;

  message +=
    "Please confirm my order and delivery details.";


  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


  window.open(url, "_blank");

});


/* =========================================
   CONTACT WHATSAPP
   ========================================= */

whatsappContact.addEventListener("click", function() {

  const message =
    "Assalam-o-Alaikum AK Collection, I would like to know more about your watches.";

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

});


/* =========================================
   ESCAPE KEY
   ========================================= */

document.addEventListener("keydown", function(event) {

  if (event.key !== "Escape") return;

  closeCartDrawer();
  closeProductModal();

});


/* =========================================
   INITIAL LOAD
   ========================================= */

renderProducts();
updateCart();
