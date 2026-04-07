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
async function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const state = document.getElementById("state").value;

  if (!name || !phone || !address || !state) {
    alert("Fill all address fields!");
    return;
  }

  let totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let delivery = (state === "Andhra Pradesh" || state === "Telangana") ? 99 : 199;

  let finalAmount = totalAmount + delivery;

  // CREATE ORDER (BACKEND)
  const res = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ amount: finalAmount })
  });

  const order = await res.json();

  const options = {
    key: "rzp_test_xxxxxxxx", // replace
    amount: order.amount,
    currency: "INR",
    order_id: order.id,

    handler: async function (response) {
      alert("Payment Successful!");

      await fetch("http://localhost:5000/save-order", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          payment_id: response.razorpay_payment_id,
          cart,
          total: finalAmount,
          name,
          phone,
          address,
          state,
          status: "Placed"
        })
      });

      cart = [];
      updateCartUI();
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
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
