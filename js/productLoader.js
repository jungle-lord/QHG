document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const container = document.getElementById("productContainer");
  const categoryContainer = document.getElementById("category-filters");
  let allProducts = [];

  // Loading state
  function showLoading() {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-gold" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  // Error state
  function showError() {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-exclamation-triangle fa-3x text-gold mb-3"></i>
        <h4 class="mb-3">Unable to Load Products</h4>
        <p class="text-muted">Please try again later or contact support.</p>
        <button class="btn btn-outline-dark mt-3" onclick="window.location.reload()">
          <i class="fas fa-sync-alt me-2"></i>Retry
        </button>
      </div>
    `;
  }

  // Fetch products data
  async function fetchProducts() {
    showLoading();

    try {
      const response = await fetch("products/products.json");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      allProducts = data.products;
      const categories = [
        "All",
        ...new Set(allProducts.map((p) => p.category)),
      ];
      renderCategoryButtons(categories);
      renderProducts(allProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      showError();
    }
  }

  // Render category filter buttons
  function renderCategoryButtons(categories) {
    categoryContainer.innerHTML = categories
      .map(
        (cat) => `
      <button class="btn ${
        cat === "All" ? "btn-dark" : "btn-outline-dark"
      } mx-1 my-1 category-btn" 
              data-category="${cat.toLowerCase()}"
              aria-label="Filter by ${cat}">
        ${cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>
    `
      )
      .join("");

    // Add event listeners
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", filterProducts);
    });
  }

  // Filter products by category
  function filterProducts(e) {
    const category = e.target.dataset.category;
    const filtered =
      category === "all"
        ? allProducts
        : allProducts.filter((p) => p.category.toLowerCase() === category);

    renderProducts(filtered);
    highlightActiveButton(e.target);
  }

  // Highlight active filter button
  function highlightActiveButton(activeBtn) {
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("btn-dark", "btn-outline-dark");
      btn.classList.add(btn === activeBtn ? "btn-dark" : "btn-outline-dark");
    });
  }

  // Render products grid
  function renderProducts(products) {
    if (products.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-search fa-3x text-gold mb-3"></i>
          <h4 class="mb-3">No Products Found</h4>
          <p class="text-muted">Try a different search or category</p>
          <button class="btn btn-outline-dark mt-3" onclick="renderProducts(allProducts); highlightActiveButton(document.querySelector('.category-btn[data-category=\"all\"]'))">
            Show All Products
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = products
      .map(
        (product) => `
      <div class="col-lg-3 col-md-4 col-6 mb-4">
        <div class="product-card card h-100 shadow-sm">
          ${
            product.condition === "New"
              ? `
            <div class="product-badge bg-success text-white">
              New
            </div>`
              : product.condition === "Refurbished"
              ? `
            <div class="product-badge bg-primary text-white">
              Refurbished
            </div>`
              : ""
          }
          <div class="product-image position-relative">
            <img 
              src="${product.image}" 
              class="img-fluid" 
              alt="${product.title}"
              loading="lazy"
              width="300"
              height="300"
            >
          </div>
          <div class="card-body p-3">
            <h5 class="product-title mb-2">${product.title}</h5>
            <p class="product-description small text-muted mb-2">${
              product.description
            }</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-secondary">${product.condition}</span>
              <div class="product-price">
                <span class="current-price fw-bold">$${product.price}</span>
                ${
                  product.originalPrice
                    ? `
                <span class="original-price text-muted text-decoration-line-through ms-2 small">$${product.originalPrice}</span>
                `
                    : ""
                }
              </div>
            </div>
            <div class="product-rating mb-2">
              ${generateRatingStars(product.rating)}
              <span class="small ms-1">(${product.reviewCount || 0})</span>
            </div>
            <div class="product-warranty small mb-3">
              <i class="fas fa-shield-alt text-gold me-1"></i>
              <span>${product.warranty}</span>
            </div>
            <button class="btn btn-primary w-100 py-2 add-to-cart" data-id="${
              product.id
            }">
              <i class="fas fa-shopping-cart me-2"></i>Add to Cart
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Add event listeners to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", function () {
        const productId = this.dataset.id;
        // Add your cart functionality here
        this.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
        this.classList.add("btn-success");
        setTimeout(() => {
          this.innerHTML =
            '<i class="fas fa-shopping-cart me-2"></i>Add to Cart';
          this.classList.remove("btn-success");
        }, 2000);
      });
    });
  }

  // Generate rating stars
  function generateRatingStars(rating) {
    const fullStars = Math.floor(rating || 4);
    const hasHalfStar = (rating || 4) % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star text-gold"></i>';
    }

    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt text-gold"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star text-gold"></i>';
    }

    return stars;
  }

  // Initialize
  fetchProducts();

  // Add scroll event for navbar
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
});
