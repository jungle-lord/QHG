document.addEventListener("DOMContentLoaded", function () {
  fetch("products/products.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("productContainer");

      data.products.forEach((product) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        col.innerHTML = `
                    <div class="card product-card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-primary">${product.condition}</span>
                                <strong>$${product.price}</strong>
                            </div>
                        </div>
                        <div class="card-footer bg-white">
                            <small class="text-muted">Warranty: ${product.warranty}</small>
                        </div>
                    </div>
                `;

        container.appendChild(col);
      });
    })
    .catch((error) => console.error("Error loading products:", error));
});
