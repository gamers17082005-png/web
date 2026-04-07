// =======================
// 🛒 CART SYSTEM
// =======================
let cart = [];

// ADD TO CART
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  console.log("Cart:", cart);
  updateCartUI();
}

// UPDATE CART UI
function updateCartUI() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div>
        ${item.name} - ₹${item.price} x ${item.quantity}
        <button onclick="increaseQty(${index})">+</button>
        <button onclick="decreaseQty(${index})">-</button>
      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: ₹" + total;
  }
}

// INCREASE QTY
function increaseQty(index) {
  cart[index].quantity++;
  updateCartUI();
}

// DECREASE QTY
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// =======================
// 💳 CHECKOUT + PAYMENT
// =======================
async function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  console.log("Checkout amount:", totalAmount);

  try {
    // CREATE ORDER FROM BACKEND
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: totalAmount })
    });

    const order = await res.json();
    console.log("Order:", order);

    // RAZORPAY OPTIONS
    const options = {
      key: "rzp_test_xxxxxxxx", // 🔴 replace with your key
      amount: order.amount,
      currency: "INR",
      name: "HSV Sugandhika",
      description: "Pooja Items",
      order_id: order.id,

      handler: async function (response) {
        alert("Payment Successful!");

        // SAVE ORDER
        await fetch("http://localhost:5000/save-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            payment_id: response.razorpay_payment_id,
            cart: cart,
            total: totalAmount,
            date: new Date()
          })
        });

        // CLEAR CART
        cart = [];
        updateCartUI();
      },

      theme: {
        color: "#FF7A00"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Payment failed!");
  }
}
