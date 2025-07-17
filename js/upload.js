document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("productImage");
    const title = document.getElementById("productTitle").value;
    const category = document.getElementById("productCategory").value;
    const price = document.getElementById("productPrice").value;
    const condition = document.getElementById("productCondition").value;
    const warranty = document.getElementById("productWarranty").value;
    const description = document.getElementById("productDescription").value;
    const status = document.getElementById("status");

    if (
      !fileInput.files.length ||
      !title ||
      !category ||
      !price ||
      !condition ||
      !warranty ||
      !description
    ) {
      status.innerHTML =
        '<div class="alert alert-danger">Please fill all fields</div>';
      return;
    }

    status.innerHTML = '<div class="alert alert-info">Adding product...</div>';

    try {
      // In a real implementation, you would upload the image and add the product to your JSON
      // For GitHub Pages, we'll simulate this with localStorage (for demo only)

      // Generate a unique filename
      const file = fileInput.files[0];
      const filename = `product-${Date.now()}.${file.name.split(".").pop()}`;

      // Simulate saving the image
      const reader = new FileReader();
      reader.onload = function (e) {
        // In a real app, you would save the image to your server or GitHub repo
        console.log(`Would save image as: products/images/${filename}`);

        // Create product object
        const product = {
          id: Date.now(),
          category: category,
          title: title,
          price: price,
          condition: condition,
          description: description,
          image: `products/images/${filename}`,
          warranty: warranty,
        };

        // Simulate adding to products.json
        console.log("Would add product:", product);

        status.innerHTML = `
                <div class="alert alert-success">
                    Product added successfully! (Demo only - not actually saved)
                </div>
            `;

        // Reset form
        fileInput.value = "";
        document.getElementById("preview").style.display = "none";
        e.target.reset();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      status.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
  });
