// 🛒 CART PAGE FUNCTIONALITY

const cartContainer = document.getElementById("cartContainer"); // container that holds all cart items
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let cartCount = cartItems.length;

// ✅ Update cart-count display
document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = cartCount));

// ✅ Render Cart Items
function renderCart() {
  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartContainer.innerHTML = cartItems
    .map(
      (item, index) => `
        <div class="cart-item book-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-details">
            <h3 class="cart-item-title productName">${item.name}</h3>
            <p class="cart-item-author">by Emmanuel Faniyi</p>
            <div class="cart-item-price productPrice">${item.price}</div>
            <div class="quantity-selector">
              <button class="quantity-btn decrease-btn" data-id="${index}">-</button>
              <input type="text" class="quantity-input" value="1" data-id="${index}" />
              <button class="quantity-btn increase-btn" data-id="${index}">+</button>
            </div>
          </div>
          <div class="cart-item-actions">
            <button class="remove-btn btn-sm" data-index="${index}">
              <i class="fas fa-trash"></i> Remove
            </button>
            <button class="save-later-btn btn-sm">
              <i class="fas fa-bookmark"></i> Save for Later
            </button>
          </div>
        </div>
      `
    )
    .join("");

  attachRemoveEvents();
}

// ✅ Attach remove button handlers
function attachRemoveEvents() {
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("cartCount", cartItems.length);
      showToast("Info", "Item removed from cart!");
      renderCart();
    });
  });
}

// ✅ Toast Notification
function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "position-fixed bottom-0 end-0 p-3";
  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-header" style="background: linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%); color: white;">
        <i class="fas fa-check-circle me-2"></i>
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ✅ Initialize Cart Display
renderCart();
