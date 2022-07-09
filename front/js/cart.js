const cart = localStorage.getItem('cart');
const cartDetails = JSON.parse(cart);


// calcul total of quantity of products in cart 
let totalQuantity = 0;

cartDetails.forEach(product => {
    let cartPrice = '';
    cartPrice += product.price * product.quantity;
    document.getElementById('totalPrice').innerHTML = cartPrice;
});

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


const cartItems = document.querySelectorAll('.cart__item');
cartItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('deleteItem')) {
            const id = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
            const color = e.target.parentElement.parentElement.parentElement.parentElement.dataset.color;
            cartDetails.forEach((product, index) => {
                if (product.id === id && product.color === color) {
                    cartDetails.splice(index, 1);
                }
            });
            localStorage.setItem('cart', JSON.stringify(cartDetails));
            window.location.reload();
        }
    });
});

const itemQuantity = document.querySelectorAll('.itemQuantity');
itemQuantity.forEach(item => {
    item.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            const id = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
            const color = e.target.parentElement.parentElement.parentElement.parentElement.dataset.color;
            cartDetails.forEach((product, index) => {
                if (product.id === id && product.color === color) {
                    cartDetails[index].quantity = e.target.value;
                }
            });
            localStorage.setItem('cart', JSON.stringify(cartDetails));
            window.location.reload();
        }
    });
});
console.log(cartDetails);
// Redirect to index.html if cart is empty
if (cartDetails.length === 0) {
    window.location.href = './index.html';
}