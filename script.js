
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🌗 THEME INIT
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

// 🌙 TOGGLE THEME
function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// 🛍️ PRODUCTS
const products = [
  {
    id: 1,
    name: "Fleur Lip Scrub (Litchi)",
    price: 349,
    images: ["images/litchi1.jpg", "images/litchi2.jpg"]
  },
  {
    id: 2,
    name: "Fleur Lip Scrub (Strawberry)",
    price: 349,
    images: ["images/strawberry1.jpg", "images/strawberry2.jpg"]
  },
  {
    id: 3,
    name: "Fleur Lip Scrub (Lemon)",
    price: 349,
    images: ["images/lemon1.jpg", "images/lemon2.jpg"]
  },
  {
    id: 4,
    name: "Fleur Lip Scrub (Brownie)",
    price: 349,
    images: ["images/brownie1.jpg", "images/brownie2.jpg"]
  }
];

// 🔥 RENDER PRODUCTS
function renderProducts() {
  const shop = document.getElementById("shop");
  if (!shop) return;

  shop.innerHTML = products.map(p => `
    <div class="card" onclick="openPreview(${p.id})">
      <div class="img-box">
        <img src="${p.images[0]}"
             onmouseover="this.src='${p.images[1]}'"
             onmouseout="this.src='${p.images[0]}'">
      </div>

      <h4>${p.name}</h4>
      <p>₹${p.price}</p>

      <button onclick="event.stopPropagation(); addToCart(${p.id}, this)" class="premium-btn">
        Add to Cart
      </button>
    </div>
  `).join("");
}

// 🔍 OPEN PREVIEW
function openPreview(id) {
  const product = products.find(p => p.id === id);
  let index = 0;

  const popup = document.createElement("div");
  popup.className = "product-popup";

  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-btn" onclick="this.closest('.product-popup').remove()">✕</span>

      <div class="popup-img">
        <img id="popup-main-img" src="${product.images[0]}">
      </div>

      <div class="popup-thumbs">
        ${product.images.map((img, i) => `
          <img src="${img}" onclick="changeImage(${i})">
        `).join("")}
      </div>

      <h3>${product.name}</h3>
      <p>₹${product.price}</p>

      <button onclick="addToCart(${product.id}); this.closest('.product-popup').remove();" class="premium-btn big-btn">
        Add to Cart
      </button>
    </div>
  `;

  document.body.appendChild(popup);

  window.changeImage = (i) => {
    index = i;
    document.getElementById("popup-main-img").src = product.images[index];
  };

  let startX = 0;

  popup.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  popup.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) index = (index + 1) % product.images.length;
    else if (endX - startX > 50) index = (index - 1 + product.images.length) % product.images.length;

    document.getElementById("popup-main-img").src = product.images[index];
  });

  const img = popup.querySelector("#popup-main-img");
  img.addEventListener("click", () => img.classList.toggle("zoomed"));
}

// ➕ ADD TO CART
function addToCart(id, btn) {
  const item = cart.find(i => i.id === id);

  if (item) item.qty++;
  else {
    const product = products.find(p => p.id === id);
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.images[0],
      qty: 1
    });
  }

  saveCart();
  animateCart();
  showToast("Added to cart ✨");
}

// 💾 SAVE
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// 🔄 UPDATE UI
function updateCartUI() {
  const count = document.getElementById("cart-count");
  if (count) count.innerText = cart.reduce((a, b) => a + b.qty, 0);

  const itemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p style="text-align:center;opacity:0.6;">Cart is empty</p>`;
    if (totalEl) totalEl.innerText = "";
    return;
  }

  let total = 0;

  itemsContainer.innerHTML = cart.map(item => {
    total += item.price * item.qty;

    return `
      <div class="cart-item">
        <div class="cart-left">
          <img src="${item.img}" class="cart-img">
          <div class="cart-info">
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
          </div>
        </div>

        <div class="qty-box">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  if (totalEl) totalEl.innerText = "Total: ₹" + total;
}

// 🔄 CHANGE QTY
function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);

  saveCart();
}

// 🛒 OPEN CART
function openCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.classList.toggle("open");
}

// 🎯 CART ANIMATION
function animateCart() {
  const cartIcon = document.getElementById("cart-count");
  if (!cartIcon) return;

  cartIcon.classList.add("cart-bounce");
  setTimeout(() => cartIcon.classList.remove("cart-bounce"), 300);
}

// 🔥 TOAST
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// 📦 CHECKOUT
function checkout() {
  if (cart.length === 0) {
    showToast("Cart is empty 🥲");
    return;
  }
  window.location.href = "checkout.html";
}

// 🚀 INIT
renderProducts();
updateCartUI();
// =========================
// 📲 FINAL ORDER → WHATSAPP (ADDED SAFELY)
// =========================
function finalOrder() {

  const inputs = document.querySelectorAll("input");

  const name = inputs[0]?.value.trim();
  const address = inputs[1]?.value.trim();
  const phone = inputs[2]?.value.trim();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ❌ VALIDATION
  if (!name || !address || !phone) {
    alert("Please fill all details");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // 🧾 MESSAGE BUILD (SAFE FORMAT)
  let message = "New Order - Fleur Aesthetics\n\n";

  message += "Name: " + name + "\n";
  message += "Address: " + address + "\n";
  message += "Phone: " + phone + "\n\n";

  message += "Order Details:\n";

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    message += "- " + item.name + " x" + item.qty + " = Rs " + itemTotal + "\n";
    total += itemTotal;
  });

  message += "\nTotal: Rs " + total;

  // 📞 YOUR NUMBER
  const phoneNumber = "9888651040"; // <-- keep like this (no +)

  // ✅ WHATSAPP URL (FIXED)
  const url =
    "https://wa.me/" +
    phoneNumber +
    "?text=" +
    encodeURIComponent(message);

  // 🚀 REDIRECT
  window.location.href = url;

  // 🧹 CLEAR CART AFTER ORDER
  localStorage.removeItem("cart");
}
