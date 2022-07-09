//get product details from local storage
let productId = localStorage.getItem('productId');
let productName = localStorage.getItem('productName');
let productPrice = localStorage.getItem('productPrice');
let productImage = localStorage.getItem('productImage');
let productAlt = localStorage.getItem('productAlt');
let productDescription = localStorage.getItem('productDescription');
let productColors = localStorage.getItem('productColors');
let productQuantity = localStorage.getItem('productQuantity');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

console.log(cart);
//add product to cart
function addProductToCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        alt: productAlt,
        description: productDescription,
        colors: productColors,
        quantity: productQuantity
    };
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}


//display cart
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartList = document.getElementById('cartList');
    let cartTotal = document.getElementById('cartTotal');
    let cartTotalPrice = 0;
    let cartTotalQuantity = 0;
    cartList.innerHTML = '';
    cart.forEach(product => {
        let cartItem = document.getElementById('cart__items');
        //cartItem.classList.add('cart__item');
        cartItem.innerHTML = `
        <article class="cart__item" data-id="{id}" data-color="{colors}">
            <div class="cart__item__img">
            <img src="${image}" alt="${alt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${name}</h2>
                <p>Vert</p>
                <p>42,00 €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>
        `;
        cardList = document.querySelector('.cart');
        cartList.appendChild(cartItem);
        cartTotalPrice += parseInt(product.price) * parseInt(product.quantity);
        cartTotalQuantity += parseInt(product.quantity);
    }
    );
    cartTotal.innerHTML = `
        <p class="cart__total__price">Total: ${cartTotalPrice}</p>
        <p class="cart__total__quantity">Quantity: ${cartTotalQuantity}</p>
    `;
}