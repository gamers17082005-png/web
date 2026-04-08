function checkout() {

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let message = "🛕 *HSV Sugandhika Order* %0A%0A";

  let total = 0;

  cart.forEach(item => {
    message += `📦 ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}%0A`;
    total += item.price * item.quantity;
  });

  // DELIVERY CHARGE LOGIC
  let state = prompt("Enter your state:");

  let delivery = 199;
  if (state && (state.toLowerCase() === "andhra pradesh" || state.toLowerCase() === "telangana")) {
    delivery = 99;
  }

  total += delivery;

  message += `%0A🚚 Delivery: ₹${delivery}`;
  message += `%0A💰 *Total: ₹${total}*`;

  // CUSTOMER DETAILS
  let name = prompt("Enter your name:");
  let address = prompt("Enter your address:");

  message += `%0A%0A👤 Name: ${name}`;
  message += `%0A📍 Address: ${address}`;
  message += `%0A📌 State: ${state}`;

  const phoneNumber = "919876543210"; // 🔥 CHANGE THIS

  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(url, "_blank");
}
