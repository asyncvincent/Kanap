const baseUrl = 'http://localhost:3000/api/products/'; // Base URL to get product details
let cart = localStorage.getItem('cart'); // Get cart from localStorage
let cartItems = JSON.parse(cart); // Parse cart to JSON
let cartItemsId = []; // Create an array to store product ids
let cartItemsColor = []; // Create an array to store product colors
let cartItemsQuantity = []; // Create an array to store product quantities

const cartContainer = document.getElementById('cart__items'); // Get cart container in DOM

/*
 * -Fetch product details
 * @param {string} productId - Product id
 */
async function fetchProduct(productId) {
    const response = await fetch(baseUrl + productId); // Fetch product details
    const product = await response.json(); // Parse response to JSON
    return product; // Return product details
};

// Check if cart is empty
if (cartItems === null || cartItems.length === 0) {
    cartContainer.innerHTML = `<div style="text-align:center;margin-bottom:20px;font-size: 1.2em;">Votre panier est vide.</div>`;
    document.querySelector('.cart__price').style.display = 'none'; // Hide cart price
    document.querySelector('.cart__order').style.display = 'none'; // Hide cart order button
}

// Loop through cart items
for (let i = 0; i < cartItems.length; i++) {
    cartItemsId.push(cartItems[i].id); // Push product ids to array 
    cartItemsColor.push(cartItems[i].color); // Push product colors to array
    cartItemsQuantity.push(cartItems[i].quantity); // Push product quantities to array

    // Fetch product details
    fetchProduct(cartItems[i].id)
        .then(product => {
            cartDetails =
                `<article class="cart__item" data-id="${product._id}" data-color="${cartItemsColor[i]}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altImg}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${cartItemsColor[i]}</p>
                                <p>${product.price} &euro;</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : ${cartItemsQuantity[i]}</p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="0">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`;

            cartContainer.insertAdjacentHTML('beforeend', cartDetails); // Insert cart details in DOM

            const deleteItem = document.querySelectorAll('.deleteItem'); // Get delete item buttons
            // Loop through delete item buttons
            for (let i = 0; i < deleteItem.length; i++) {
                // Add event listener to delete item button
                deleteItem[i].addEventListener('click', () => {
                    alert('Voulez vous vraiment supprimer ce produit ?', 'Cette action est irréversible.'); // Alert user
                    // Get product id
                    const productId = deleteItem[i].parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
                    // Get product color
                    const productColor = deleteItem[i].parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
                    // Remove product from cart
                    removeProduct(productId, productColor);
                });
            }

            const itemQuantity = document.querySelectorAll('.itemQuantity'); // Get item quantity inputs
            // Loop through item quantity inputs
            for (let i = 0; i < itemQuantity.length; i++) {
                // Add event listener to item quantity input
                itemQuantity[i].addEventListener('keyup', (e) => {
                    if (e.keyCode === 13) { // Check if enter key is pressed
                        // Get product id
                        const productId = itemQuantity[i].parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
                        // Get product color
                        const productColor = itemQuantity[i].parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
                        // Get product quantity
                        const productQuantity = itemQuantity[i].value;
                        // Check if quantity is superior to 0 and inferior to 100
                        if (productQuantity > 0 && productQuantity < 100 && isNaN(productQuantity) === false && productQuantity.indexOf('.') === -1) {
                            // Update product quantity
                            updateQuantity(productId, productColor, productQuantity);
                        } else {
                            // Display error message
                            alert('error', 'La quantité doit être supérieure à 0 et inférieure à 100 et doit contenir uniquement des chiffres.');
                        }
                    }
                });
            }

            // Total quantity of products in cart
            let totalQuantityValue = 0; // Create variable to store total quantity value
            for (let i = 0; i < cartItemsQuantity.length; i++) { // Loop through cart items quantities
                totalQuantityValue += parseInt(cartItemsQuantity[i]); // Add product quantities to total quantity
            }
            document.getElementById('totalQuantity').innerHTML = totalQuantityValue; // Update total quantity in cart

            // Total price of products in cart
            let totalPriceValue = 0; // Create variable to store total price value
            for (let i = 0; i < cartItemsQuantity.length; i++) { // Loop through cart items quantities
                fetchProduct(cartItemsId[i])
                    .then(product => {
                        totalPriceValue += parseInt(cartItemsQuantity[i]) * parseInt(product.price); // Add product price to total price
                        document.getElementById('totalPrice').innerHTML = totalPriceValue; // Update total price in cart
                    });
            }

        }).catch(err => {
            console.log(err); // Log error
            alert('error', 'Une erreur est survenue'); // Display error message
        });
}

/*
 * - Remove product from cart
 * @param {string} productId - Product id
 * @param {string} productColor - Product color
 */
async function removeProduct(productId, productColor) {
    // Loop through cart items
    for (let i = 0; i < cartItems.length; i++) {
        // Check if product id and color match
        if (cartItems[i].id == productId && cartItems[i].color == productColor) {
            // Remove product from cart
            cartItems.splice(i, 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartItems)); // Save cart in localStorage
    window.location.reload(); // Reload page
}

/*
 * - Update product quantity
 * @param {string} productId - Product id
 * @param {string} productColor - Product color
 * @param {int} productQuantity - Product quantity
 */
async function updateQuantity(productId, productColor, productQuantity) {
    // Loop through cart items
    for (let i = 0; i < cartItems.length; i++) {
        // Check if product id and color match
        if (cartItems[i].id == productId && cartItems[i].color == productColor) {
            // Update product quantity
            cartItems[i].quantity = productQuantity;
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartItems)); // Save cart in localStorage
    window.location.reload(); // Reload page
}

function alert(type, message) {
    const alertMessageContainer = document.querySelector('body'); // Get body

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

    alertMessageContainer.insertAdjacentHTML('afterend', error); // Insert error alert in DOM

    let alert = document.querySelectorAll('div[role="alert"]'); // Get all alerts

    // Remove alert after 3 seconds
    setTimeout(() => {
        alert.forEach(el => el.remove());
    }, 3000);
}

/*
 * - Check if form is valid
 * @param {string} form - Form firstname
 * @param {string} form - Form lastname
 * @param {string} form - Form adress
 * @param {string} form - Form city
 * @param {string} form - Form email
 * @return {boolean} - True if form is valid, false if not
 */
function validateForm(firstname, lastname, adress, city, email) {

    let nameRegExp = new RegExp("^[A-zÀ-ú \-]+$"); // Name regular expression 
    let adressRegExp = new RegExp("^[A-zÀ-ú0-9 ,.'\-]+$"); // Adress regular expression
    let emailRegExp = new RegExp("^[a-zA-Z0-9_. -]+@[a-zA-Z.-]+[.]{1}[a-z]{2,10}$"); // Email regular expression

    // Check if form is valid
    if (firstname.length < 2 || firstname.length > 50) {
        alert('error', 'Le prénom doit contenir entre 2 et 50 caractères.'); // Display error message
        return false;
    } else if (!nameRegExp.test(firstname)) {
        alert('error', 'Le prénom doit contenir que des lettres.'); // Display error message
        return false;
    } else if (lastname.length < 2 || lastname.length > 50) {
        alert('error', 'Le nom doit contenir entre 2 et 50 caractères.'); // Display error message
        return false;
    } else if (!nameRegExp.test(lastname)) {
        alert('error', 'Le nom doit contenir que des lettres.'); // Display error message
        return false;
    } else if (adress.length < 2 || adress.length > 50) {
        alert('error', 'L\'adresse doit contenir entre 2 et 50 caractères.'); // Display error message
        return false;
    } else if (!adressRegExp.test(adress)) {
        alert('error', 'L\'adresse doit contenir que des lettres, des chiffres, des tirets et des espaces.'); // Display error message
        return false;
    } else if (city.length < 2 || city.length > 50) {
        alert('error', 'La ville doit contenir entre 2 et 50 caractères.'); // Display error message
        return false;
    } else if (!nameRegExp.test(city)) {
        alert('error', 'La ville doit contenir que des lettres.'); // Display error message
        return false;
    } else if (email.length < 2 || email.length > 50) {
        alert('error', 'L\'email doit contenir entre 2 et 50 caractères.'); // Display error message
        return false;
    } else if (!emailRegExp.test(email)) {
        alert('error', 'L\'email doit être valide.'); // Display error message
        return false;
    }
    return true;
}

let orderBtn = document.getElementById('order'); // Get order button

// Add event listener to order button
orderBtn.addEventListener('click', async (e) => {

    e.preventDefault(); // Prevent default behavior

    let firstname = document.getElementById('firstName').value; // Get firstname
    let lastname = document.getElementById('lastName').value; // Get lastname
    let address = document.getElementById('address').value; // Get address 
    let city = document.getElementById('city').value; // Get city
    let email = document.getElementById('email').value; // Get email

    if (validateForm(firstname, lastname, address, city, email)) {

        let productIdArray = []; // Create array to store product ids

        // Loop through cart items
        cartItems.forEach(item => {
            productIdArray.push(item.id); // Add product id to array
        });

        // Create order object 
        let orderObject = {
            contact: {
                firstName: firstname,
                lastName: lastname,
                address: address,
                city: city,
                email: email
            },
            products: productIdArray
        };

        // Send order to server
        await fetch(`${baseUrl}order`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderObject) // Convert order object to JSON
        })
            .then(res => res.json()) // Convert response to JSON
            .then(async data => { // Get response from server
                window.location.href = `confirmation.html?id=${data.orderId}`; // Redirect to confirmation page
                localStorage.clear(); // Clear local storage
            }).catch(err => {
                console.log(err); // Log error 
                alert('error', 'Une erreur est survenue.'); // Show error message 
            }); // Catch error
    }
});