let cart = [];

// ADD TO CART
function addToCart(name, price) {
  let item = cart.find(p => p.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartUI();
}

// UPDATE CART
function updateCartUI() {
  let cartItems = document.getElementById("cart-items");
  let total = document.getElementById("cart-total");

  cartItems.innerHTML = "";

  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.qty;

    cartItems.innerHTML += `
      <p>${item.name} - ₹${item.price} x ${item.qty}</p>
    `;
  });

  total.innerText = "Total: ₹" + totalPrice;
}

// TOGGLE CART
function toggleCart() {
  let cartBox = document.getElementById("cart-box");

  if (cartBox.style.display === "none") {
    cartBox.style.display = "block";
  } else {
    cartBox.style.display = "none";
  }
}

// CHECKOUT
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  alert("Proceeding to payment...");
}
