// 🛒 CART FUNCTIONALITY

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let cartCount = cartItems.length;

// ✅ Update cart-count elements
document.querySelectorAll(".cart-count").forEach((el) => {
  el.textContent = cartCount;
});

// ✅ Add to Cart Function
const addToCart = (e) => {
  const product = e.target.closest(".product");

  const name =
    product.querySelector(".productName")?.textContent || "My History Book";
  const price = product.querySelector(".productPrice")?.textContent || "$500";
  const image =
    product.querySelector("img")?.src ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

  // Add product data to localStorage
  cartItems.push({ name, price, image });
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Update cart count
  cartCount = cartItems.length;
  localStorage.setItem("cartCount", cartCount);
  document
    .querySelectorAll(".cart-count")
    .forEach((el) => (el.textContent = cartCount));

  // ✅ Toast
  showToast("Success", `${name} added to cart successfully!`);
};

// ✅ Toast Generator
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

// ✅ Attach Listeners
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", addToCart);
});

// ✅ Select elements
const searchBtn = document.getElementById("searchBtn");
const searchInputEl = document.getElementById("searchInput");
const bookContainer = document.getElementById("book-card"); // parent container

// ✅ Get product details dynamically from your product cards
let allProducts = Array.from(document.querySelectorAll(".product")).map((product) => ({
  name: product.querySelector(".productName")?.textContent.trim() || "",
  price: product.querySelector(".productPrice")?.textContent.trim() || "",
  image: product.querySelector("img")?.src || "",
}));

// ✅ Handle Search
searchBtn.addEventListener("click", () => {
  const searchValue = searchInputEl.value.toLowerCase();

  // ✅ Filter products
  const filtered = allProducts.filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue) ||
      item.price.toLowerCase().includes(searchValue)
  );

  // ✅ Clear old results
  bookContainer.innerHTML = "";

  // ✅ If nothing matches
  if (filtered.length === 0) {
    bookContainer.innerHTML = `<p class="text-center text-muted">No matching books found.</p>`;
    return;
  }

  // ✅ Render all matching results
  filtered.forEach((detail) => {
    bookContainer.innerHTML += `

          <div class="position-relative">
            <img
              src="${detail.image}"
              class="card-img-top book-cover"
              alt="${detail.name}"
            />
            <span class="discount-badge">20% OFF</span>
          </div>
          <div class="card-body d-flex flex-column ">
            <h5 class="card-title productName">${detail.name}</h5>
            <p class="card-text text-muted">Alex Michaelides</p>
            <div class="rating mb-2">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
              <span class="ms-1 text-muted">(4.5)</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div>
                <span class="price productPrice">${detail.price}</span>
                <span class="old-price">$16.99</span>
              </div>
              <button class="btn btn-primary add-to-cart">Add to Cart</button>
            </div>
          </div>
   
    `;
  });
});


searchInputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});
