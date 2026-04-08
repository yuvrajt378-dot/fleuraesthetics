const RS = "\u20B9";

const products = [
  { id: 1, name: "Bouquet", price: 499, img: "images/p1.jpg" },
  { id: 2, name: "Rose Pack", price: 399, img: "images/p2.jpg" },
  { id: 3, name: "Luxury Box", price: 699, img: "images/p3.jpg" },
  { id: 4, name: "Gift Set", price: 599, img: "images/p4.jpg" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* LOAD PRODUCTS */
function loadProducts() {
  const shop = document.getElementById("shop");
  if (!shop) return;

  shop.innerHTML = "";

  products.forEach((p, index) => {
    shop.innerHTML += `
      <div class="card fade-in" style="transition-delay:${index * 0.08}s">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${RS} ${p.price}</p>
        <button onclick="addToCart(${p.id}, this)">Add</button>
      </div>
    `;
  });

  observeScroll();
}

/* ADD TO CART */
function addToCart(id, btn) {
  const item = cart.find((i) => i.id === id);

  if (item) item.qty++;
  else {
    const product = products.find((p) => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  /* Button press */
  btn.style.transform = "scale(0.9)";
  setTimeout(() => (btn.style.transform = "scale(1)"), 150);

  animateCartCount();
  showToast("Added to Cart 🛍️");

  updateCartUI();
  saveCart();
}

/* FLOATING TOAST */
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

/* SCROLL ANIMATION */
function observeScroll() {
  const items = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  });

  items.forEach((el) => observer.observe(el));
}

/* CART UI */
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" class="cart-img">
        <div>
          <h4>${item.name}</h4>
          <p>${RS} ${item.price}</p>
        </div>

        <div class="qty-box">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = "Total: " + RS + " " + total;
  countEl.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

/* QTY */
function changeQty(id, val) {
  const item = cart.find((i) => i.id === id);
  item.qty += val;

  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }

  updateCartUI();
  saveCart();
}

/* SAVE */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* CART OPEN */
function openCart() {
  document.getElementById("cartDrawer").classList.toggle("open");
}

/* COUNT ANIMATION */
function animateCartCount() {
  const el = document.getElementById("cart-count");
  el.classList.add("cart-bounce");

  setTimeout(() => el.classList.remove("cart-bounce"), 300);
}

/* INIT */
loadProducts();
updateCartUI();
