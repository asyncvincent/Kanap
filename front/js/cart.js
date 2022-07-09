const cart = localStorage.getItem('cart');
const cartDetails = JSON.parse(cart);

if (cart === null) {
    window.location.href = './index.html';
}


// display cart details
async function getCartDetails() {
    let cartQuantity = 0;
    cartDetails.forEach(product => {
        cartQuantity += product.quantity;
    });
    document.getElementById('totalQuantity').innerHTML = cartQuantity;

    let cartPrice = 0;
    cartDetails.forEach(product => {
        cartPrice += product.price * product.quantity;
    });
    document.getElementById('totalPrice').innerHTML = cartPrice;
    const cartDetailsList = document.getElementById('cart__items');
    cartDetailsList.innerHTML = cartDetails.map(product => {
        return `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${product.image}" alt="${product.altImg}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : ${product.quantity}</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="0">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
    }).join('');
}

getCartDetails();

// use itemQuantity to update cart details and localStorage when user changes quantity of a product in cart
const itemQuantity = document.querySelectorAll('.itemQuantity');
itemQuantity.forEach(input => {
    input.addEventListener('change', () => {
        const productId = input.parentElement.parentElement.parentElement.parentElement.dataset.id;
        const productColor = input.parentElement.parentElement.parentElement.parentElement.dataset.color;
        const productQuantity = input.value;
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.forEach(product => {
            if (product.id === productId && product.color === productColor) {
                product.quantity = productQuantity;
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        getCartDetails();
    });
});