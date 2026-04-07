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

  total.innerText = "Subtotal: ₹" + totalPrice;
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

  // GET USER INPUT
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const state = document.getElementById("state").value;

  // VALIDATION
  if (!name || !phone || !address || !state) {
    alert("Please fill all address details!");
    return;
  }

  // CALCULATE CART TOTAL
  let totalAmount = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  // DELIVERY CHARGE LOGIC
  let deliveryCharge = 199;

  if (state === "Andhra Pradesh" || state === "Telangana") {
    deliveryCharge = 99;
  }

  const finalAmount = totalAmount + deliveryCharge;

  console.log("Base:", totalAmount);
  console.log("Delivery:", deliveryCharge);
  console.log("Final:", finalAmount);

  alert(
    `Order Summary:\n
    Product Total: ₹${totalAmount}
    Delivery: ₹${deliveryCharge}
    Final Amount: ₹${finalAmount}`
  );

  // 👉 NEXT STEP (Razorpay)
  // send finalAmount to backend instead of totalAmount

}
