// PRODUCTS
const products = [
  {id:1,name:"Bouquet",price:499,img:"images/p1.jpg"},
  {id:2,name:"Rose Pack",price:399,img:"images/p2.jpg"},
  {id:3,name:"Luxury Box",price:699,img:"images/p3.jpg"},
  {id:4,name:"Gift Set",price:599,img:"images/p4.jpg"},
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// FIX DATA
cart = cart.map(i => ({...i, qty: i.qty ? i.qty : 1}));

// LOAD PRODUCTS
function loadProducts(){
  const shop = document.getElementById("shop");
  if(!shop) return;

  shop.innerHTML = "";

  products.forEach(p=>{
    shop.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
  });
}

// ADD
function addToCart(id){
  const item = cart.find(p=>p.id===id);

  if(item){
    item.qty++;
  } else {
    const product = products.find(p=>p.id===id);
    cart.push({...product, qty:1});
  }

  saveCart();
}

// SAVE
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  renderCart();
}

// 🔥 UPDATED COUNT (TOP + MOBILE)
function updateCart(){
  let total = 0;
  cart.forEach(i => total += i.qty);

  const top = document.getElementById("cart-count");
  const mobile = document.getElementById("mobile-cart-count");

  if(top) top.innerText = total;
  if(mobile) mobile.innerText = total;
}

// ➕➖
function changeQty(id, val){
  const item = cart.find(p=>p.id===id);
  if(!item) return;

  item.qty += val;

  if(item.qty <= 0){
    removeItem(id);
    return;
  }

  saveCart();
}

// ❌ REMOVE
function removeItem(id){
  cart = cart.filter(p=>p.id !== id);
  saveCart();
}

// RENDER
function renderCart(){
  const container = document.getElementById("cart-items");
  const totalBox = document.getElementById("total");

  if(!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item=>{
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" class="cart-img">

        <div class="cart-info">
          <p>${item.name}</p>
          <small>₹${item.price}</small>

          <div class="qty">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>

        <div class="cart-right">
          <span>₹${item.price * item.qty}</span>
          <button class="remove" onclick="removeItem(${item.id})">✕</button>
        </div>
      </div>
    `;
  });

  totalBox.innerText = "Total: ₹" + total;
}

// OPEN CART
function openCart(){
  document.getElementById("cartDrawer").classList.toggle("open");
  renderCart();
}

// WHATSAPP
function checkout(){
  let msg = "Order:%0A";

  cart.forEach(i=>{
    msg += `${i.name} x${i.qty} = ₹${i.price*i.qty}%0A`;
  });

  window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`);
}

// INIT
loadProducts();
updateCart();
renderCart();
