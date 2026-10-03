/* AK COLLECTION — STORE SCRIPT */
const WHATSAPP_NUMBER = "923709039540";
const DELIVERY_FEE = 250;

/* PRODUCTS
   category must be one of: Watches, Caps, Glasses, Bracelets
   To add a cap, copy a line, set category: "Caps", and put its photo in the repo. */
const products = [
  { id: 1, category: "Watches", type: "Luxury", name: "Automatic Skelton", price: 6800, image: "blue-leather.jpg", description: "Premium automatic skeleton-style watch with a bold luxury appearance." },
  { id: 2, category: "Watches", type: "Classic", name: "Rolex Blue", price: 2999, image: "blue-dial.jpg", description: "Elegant blue dial watch designed for a clean and timeless look." },
  { id: 3, category: "Watches", type: "Modern", name: "Hublot Skelton", price: 4000, image: "silver-chronograph.jpg", description: "Modern skeleton-inspired design with a strong everyday presence." },
  { id: 4, category: "Watches", type: "Luxury", name: "Rolex Set", price: 7200, image: "silver-set.jpg", description: "Premium watch set with a sophisticated and complete presentation." },
  { id: 5, category: "Watches", type: "Luxury", name: "Patek Philippe", price: 2800, image: "white-dial.jpg", description: "Clean white dial design with a refined luxury-inspired appearance." }
];

let cart = JSON.parse(localStorage.getItem("akCollectionCart") || "[]");
let activeFilter = "All";

const $ = id => document.getElementById(id);
const productsGrid = $("productsGrid"), cartDrawer = $("cartDrawer"), cartOverlay = $("cartOverlay"),
  cartItems = $("cartItems"), cartCount = $("cartCount"), cartTotal = $("cartTotal"), grandTotal = $("grandTotal"),
  productModal = $("productModal"), productModalContent = $("productModalContent"), checkoutModal = $("checkoutModal"),
  mobileMenu = $("mobileMenu"), menuOverlay = $("menuOverlay"), searchBox = $("searchBox"), searchInput = $("searchInput");

const formatPrice = p => `PKR ${p.toLocaleString("en-PK")}`;
const saveCart = () => localStorage.setItem("akCollectionCart", JSON.stringify(cart));
const findProduct = id => products.find(p => p.id === id);

/* PRODUCTS */
function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const list = products.filter(p =>
    (activeFilter === "All" || p.category === activeFilter) &&
    (p.name + " " + p.type + " " + p.category).toLowerCase().includes(term));

  if (!list.length) {
    const msg = activeFilter !== "All" && !term
      ? `${activeFilter} are coming soon.<br><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Ask us on WhatsApp</a>`
      : "No products found.";
    productsGrid.innerHTML = `<div class="empty-note">${msg}</div>`;
    return;
  }
  productsGrid.innerHTML = list.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <span class="product-type">${p.category} · ${p.type}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price">${formatPrice(p.price)}</div>
        <div class="product-actions">
          <button onclick="openProduct(${p.id})">View</button>
          <button class="add-cart" onclick="addToCart(${p.id})">Add to bag</button>
        </div>
      </div>
    </article>`).join("");
}

function setFilter(name) {
  activeFilter = name;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === name));
  renderProducts();
}

document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter)));

/* category buttons and collage tiles */
document.querySelectorAll("[data-cat]").forEach(el => el.addEventListener("click", e => {
  setFilter(el.dataset.cat);
  if (el.tagName === "BUTTON") {
    e.preventDefault();
    $("collection").scrollIntoView({ behavior: "smooth" });
  }
}));

/* SEARCH */
$("searchBtn").addEventListener("click", () => {
  searchBox.classList.toggle("show");
  if (searchBox.classList.contains("show")) {
    $("collection").scrollIntoView({ behavior: "smooth" });
    searchInput.focus();
  }
});
searchInput.addEventListener("input", renderProducts);
$("closeSearch").addEventListener("click", () => {
  searchInput.value = "";
  searchBox.classList.remove("show");
  renderProducts();
});

/* CART */
function addToCart(id) {
  if (!findProduct(id)) return;
  const item = cart.find(i => i.id === id);
  item ? item.quantity++ : cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); openCart();
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); renderCart(); }
function changeQuantity(id, n) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += n;
  if (item.quantity <= 0) return removeFromCart(id);
  saveCart(); renderCart();
}
function getCartTotal() {
  return cart.reduce((t, i) => { const p = findProduct(i.id); return p ? t + p.price * i.quantity : t; }, 0);
}

function renderCart() {
  cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = getCartTotal();
  cartTotal.textContent = formatPrice(subtotal);
  grandTotal.textContent = subtotal > 0 ? formatPrice(subtotal + DELIVERY_FEE) : "PKR 0";

  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart"><h3>Your bag is empty</h3><p>Add a product to get started.</p></div>`;
    return;
  }
  cartItems.innerHTML = cart.map(i => {
    const p = findProduct(i.id);
    if (!p) return "";
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}">
      <div class="cart-item-info">
        <h4>${p.name}</h4><p>${formatPrice(p.price)}</p>
        <div class="cart-qty">
          <button onclick="changeQuantity(${p.id}, -1)" aria-label="Less">−</button>
          <span>${i.quantity}</span>
          <button onclick="changeQuantity(${p.id}, 1)" aria-label="More">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${p.id})">Remove</button>
    </div>`;
  }).join("");
}

function openCart() { cartDrawer.classList.add("open"); cartOverlay.classList.add("show"); }
function closeCart() { cartDrawer.classList.remove("open"); cartOverlay.classList.remove("show"); }
$("cartBtn").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* PRODUCT MODAL */
function openProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  productModalContent.innerHTML = `
    <div class="modal-product-image"><img src="${p.image}" alt="${p.name}"></div>
    <div class="modal-product-info">
      <span>${p.category} · ${p.type}</span>
      <h2>${p.name}</h2>
      <div class="modal-price">${formatPrice(p.price)}</div>
      <p>${p.description}</p>
      <button class="modal-add" onclick="addToCart(${p.id}); closeProductModal();">Add to bag</button>
    </div>`;
  productModal.classList.add("show");
}
function closeProductModal() { productModal.classList.remove("show"); }
$("productModalClose").addEventListener("click", closeProductModal);
productModal.addEventListener("click", e => { if (e.target === productModal) closeProductModal(); });

/* CHECKOUT */
function openCheckout() {
  if (!cart.length) return alert("Please add a product to your bag first.");
  checkoutModal.classList.add("show");
}
function closeCheckout() { checkoutModal.classList.remove("show"); }
$("checkoutBtn").addEventListener("click", openCheckout);
$("checkoutClose").addEventListener("click", closeCheckout);
checkoutModal.addEventListener("click", e => { if (e.target === checkoutModal) closeCheckout(); });

/* WHATSAPP ORDER */
function createWhatsAppMessage(c = {}) {
  const subtotal = getCartTotal();
  let m = "*AK COLLECTION - NEW ORDER*\n\n";
  cart.forEach(i => {
    const p = findProduct(i.id);
    if (p) m += `• ${p.name} x${i.quantity} - ${formatPrice(p.price * i.quantity)}\n`;
  });
  m += `\n*Product Total:* ${formatPrice(subtotal)}`;
  m += `\n*Delivery / Advance:* ${formatPrice(DELIVERY_FEE)}`;
  m += `\n*Grand Total:* ${formatPrice(subtotal + DELIVERY_FEE)}`;
  if (c.name) m += `\n\n*CUSTOMER DETAILS*\nName: ${c.name}\nPhone: ${c.phone}\nCity: ${c.city}\nAddress: ${c.address}`;
  return m;
}
function sendWhatsApp(customer) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(createWhatsAppMessage(customer))}`, "_blank");
}
function getCustomer() {
  return {
    name: $("customerName").value.trim(), phone: $("customerPhone").value.trim(),
    city: $("customerCity").value.trim(), address: $("customerAddress").value.trim()
  };
}

$("directWhatsapp").addEventListener("click", () => {
  if (!cart.length) return alert("Please add a product to your bag first.");
  sendWhatsApp();
});
$("checkoutForm").addEventListener("submit", e => { e.preventDefault(); sendWhatsApp(getCustomer()); });
$("checkoutWhatsapp").addEventListener("click", () => {
  const c = getCustomer();
  if (!c.name || !c.phone || !c.city || !c.address) return alert("Please fill all customer details first.");
  sendWhatsApp(c);
});

/* MOBILE MENU */
function openMobileMenu() { mobileMenu.classList.add("open"); menuOverlay.classList.add("show"); }
function closeMobileMenu() { mobileMenu.classList.remove("open"); menuOverlay.classList.remove("show"); }
$("menuBtn").addEventListener("click", openMobileMenu);
$("mobileClose").addEventListener("click", closeMobileMenu);
menuOverlay.addEventListener("click", closeMobileMenu);
document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", closeMobileMenu));

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeCart(); closeProductModal(); closeCheckout(); closeMobileMenu(); }
});

renderProducts();
renderCart();
