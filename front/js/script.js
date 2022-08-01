const baseUrl = 'http://localhost:3000/api/products/'; // Base URL to get product details

// Get all products from API
async function getProducts() {
    await fetch(baseUrl)
        .then(response => response.json()) // Convert the response to JSON
        .then(data => { // Return data
            const products = data.map(product => { // Map the data to a new array
                return `
                    <a href="product.html?id=${product._id}">
                        <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                            <h3 class="productName">${product.name}</h3>
                            <p class="productDescription">${product.description}</p>
                        </article>
                    </a>`
            }).join(''); // Join the array to a string
            document.getElementById('items').innerHTML = products; // Display the products in the table
        }).catch(err => console.error(err)); // Handle errors
}

getProducts(); // Call the function to fetch the products