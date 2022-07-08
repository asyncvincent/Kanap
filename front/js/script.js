const apiUrl = 'http://localhost:3000/api/products'; // Get the product id from the URL

async function getProducts() {
    /*
    *  Fetch all products from the API
    *  and display them in the table
    */
    await fetch(apiUrl)
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            const products = data.map(product => { // Map the data to a new array
                return `
                    <a href="product.html?id=${product._id}">
                        <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                            <h3 class="productName">${product.name}</h3>
                            <p class="productDescription">${product.description}</p>
                        </article>
                    </a>`
            }).join('');
            document.getElementById('items').innerHTML = products; // Display the products in the table
        }).catch(err => console.error(err)); // Handle errors
}

getProducts(); // Call the function to fetch the products