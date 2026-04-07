// CART ARRAY
let cart = [];

// ADD TO CART
function addToCart(name, price) {
  let existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartCount();
}

// UPDATE CART COUNT
function updateCartCount() {
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").innerText = count;
}

// TOGGLE CART
function toggleCart() {
  let panel = document.getElementById("cart-panel");

  if (panel.style.right === "" || panel.style.right === "-300px") {
    panel.style.right = "0px";
  } else {
    panel.style.right = "-300px";
  }

  renderCart();
}

// RENDER CART
function renderCart() {
  let panel = document.getElementById("cart-panel");

  if (cart.length === 0) {
    panel.innerHTML = "<h2>Your Cart</h2><p>Cart is empty</p>";
    return;
  }

  let total = 0;
  panel.innerHTML = "<h2>Your Cart</h2>";

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    panel.innerHTML += `
      <div style="margin-bottom:10px;">
        <p>${item.name} - ₹${item.price}</p>
        <button onclick="decreaseQty(${index})">−</button>
        ${item.qty}
        <button onclick="increaseQty(${index})">+</button>
        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
  });

  panel.innerHTML += `<h3>Total: ₹${total}</h3>`;
  panel.innerHTML += `<button onclick="checkout()">Checkout</button>`;
}

// INCREASE QTY
function increaseQty(index) {
  cart[index].qty++;
  updateCartCount();
  renderCart();
}

// DECREASE QTY
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }

  updateCartCount();
  renderCart();
}

// REMOVE ITEM
function removeItem(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

// CHECKOUT
async function checkout() {
  console.log("Checkout clicked");
  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const response = await fetch("https://web-8jea.onrender.com/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount: total })
  });

  const order = await response.json();

  let options = {
    key: "YOUR_KEY_ID",
    amount: order.amount,
    currency: "INR",
    order_id: order.id,
    name: "HSV Sugandhika",
    description: "Pooja Items",
    handler: function () {
      alert("Payment Successful 🎉");
    }
  };

  let rzp = new Razorpay(options);
  rzp.open();
}// SCROLL
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
}
