const productId = new URLSearchParams(window.location.search).get('id'); // Get product id from url
const baseUrl = 'http://localhost:3000/api/products/'; // Base URL to get product details
const product = baseUrl + productId; // Get product details from API

/*
 *  - function alert is used to display the message in the alert box
 *  @param {string} type - type of the alert
 *  @param {string} message - message to be displayed
 */
function alert(type, message) {
    const alertMessageContainer = document.querySelector('body'); // Get body element

    // Error alert type
    error = `<div style="width: fit-content; 
                        z-index: 998;
                        font-family: arial, sans-serif;
                        padding: 12px 16px;
                        border-radius: 8px;
                        background-color: #FFBABA;
                        border: 1px solid #FF6E6E;
                        text-align: center;
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        color: #D8000C;" role="alert">${message}</div>`;

    // Success alert type
    success = `<div style="width: fit-content;
                        z-index: 999;
                        font-family: arial, sans-serif;
                        padding: 12px 16px;
                        border-radius: 8px;
                        background-color: #BFFFBA;
                        border: 1px solid #00FF00;
                        text-align: center;
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        color: #008000;" role="alert">${message}</div>`;

    if (type === 'error') {
        alertMessageContainer.insertAdjacentHTML('beforeend', error);
    } else if (type === 'success') {
        alertMessageContainer.insertAdjacentHTML('beforeend', success);
    }

    let alert = document.querySelectorAll('div[role="alert"]'); // Get all alerts

    // Remove alert after 3 seconds
    setTimeout(() => {
        alert.forEach(el => el.remove());
    }, 3000);
}

// Get product details from API
async function getProductDetails() {
    await fetch(product)
        .then(response => response.json()) // parse JSON from request
        .then(data => { // return data

            // Set title of the page to product name
            document.title = data.name;

            // Product image 
            const productImg = document.querySelector('.item__img');
            const img = document.createElement('img');
            img.src = data.imageUrl;
            img.alt = data.altTxt;
            productImg.appendChild(img);

            // Product name
            const title = document.getElementById('title');
            title.innerHTML = data.name;

            // Product price
            const price = document.getElementById('price');
            price.innerHTML = data.price;

            // Product description
            const description = document.getElementById('description');
            description.innerHTML = data.description;

            // Product color select
            const colorSelect = document.getElementById('colors');
            const colorOptions = data.colors.map(color => {
                const option = document.createElement('option');
                option.value = color;
                option.innerHTML = color;
                return option;
            });

            colorSelect.append(...colorOptions); // Append options to select

        }).catch(err => console.log(err)); // Catch error if any
}

getProductDetails();

const addToCartBtn = document.getElementById('addToCart'); // Add to cart button

// Add to cart button click event
addToCartBtn.addEventListener('click', async () => {
    await fetch(product)
        .then(response => response.json()) // parse JSON from request
        .then(data => {
            let productcolors = document.getElementById('colors'); // Get product colors
            let productQuantity = document.getElementById('quantity').value; // Get product quantity*

            // Check if user selected color
            if (productcolors.options[0].selected) {
                alert('error', 'Veuillez sélectionner une <b>couleur</b>.');
                return false;
            }

            // Check if user selected quantity
            if (productQuantity < 1) {
                alert('error', 'Veuillez choisir une <b>quantité</b> supérieure à <b>0</b>.');
                return false;
            }

            // Check if user selected quantity is greater than 100
            if (productQuantity > 100) {
                alert('error', 'Veuillez choisir une <b>quantité</b> inférieure à <b>100</b>.');
                return false;
            }

            const selectedColor = productcolors.options[productcolors.selectedIndex].value; // Get selected color
            const productColors = data.colors.filter(color => color === selectedColor); // Get product colors

            /*
             * - Product object
             *  @param {string} id - product id
             *  @param {string} color - product color
             *  @param {number} quantity - product quantity
             */
            const product = {
                id: data._id,
                color: productColors.join(''),
                quantity: parseInt(productQuantity)
            }

            const cart = localStorage.getItem('cart'); // Get cart from local storage

            if (cart) { // If cart is not empty 
                const cartItems = JSON.parse(cart); // Get cart items from local storage
                const cartItem = cartItems.find(item => item.id === product.id && item.color === product.color); // Check if product already exists in cart
                if (cartItem) {
                    cartItem.quantity += product.quantity; // Add quantity to existing item
                } else {
                    cartItems.push(product); // Add product to cart
                }
                localStorage.setItem('cart', JSON.stringify(cartItems)); // Update cart in local storage
                alert('success', `Le produit <b>${data.name}</b> a été ajouté au panier.`);
            } else { // If cart is empty
                localStorage.setItem('cart', JSON.stringify([product])); // Add product to cart
                alert('success', `Le produit <b>${data.name}</b> a été ajouté au panier.`);
            }

        }).catch(err => console.log(err)); // Catch error if any
});