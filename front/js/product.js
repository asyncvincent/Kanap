// Get product details
async function getProductDetails() {
    let productId = new URLSearchParams(window.location.search).get('id');
    let product = `http://localhost:3000/api/products/${productId}`;
    await fetch(product)
        .then(response => response.json())
        .then(data => {
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
            colorSelect.append(...colorOptions);
        })
        .catch(err => console.log(err)); // Catch error if any
}

getProductDetails();

//store product id in local storage
function storeProductId() {
    let productId = new URLSearchParams(window.location.search).get('id');
    localStorage.setItem('productId', productId);
    localStorage.setItem('productName', document.getElementById('title').innerHTML);
    localStorage.setItem('productPrice', document.getElementById('price').innerHTML);
    localStorage.setItem('productImage', document.querySelector('.item__img img').src);
    localStorage.setItem('productAlt', document.querySelector('.item__img img').alt);
    localStorage.setItem('productDescription', document.getElementById('description').innerHTML);

    //store product colors in local storage
    let productcolors = document.getElementById('colors');
    if (productcolors.options[0].selected) {
        alert('Please select a color');
        return;
    } else {
        localStorage.setItem('productColors', productcolors.options[productcolors.selectedIndex].value);
    }

    //store product quantity in local storage
    let productQuantity = document.getElementById('quantity').value;
    if (productQuantity < 1) {
        alert('Veuillez entrer une quantité supérieure à 1');
        return;
    } else {
        localStorage.setItem('productQuantity', productQuantity);
    }

    //store all product details in item local storage named cart
    let cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
    }

}

const addButton = document.getElementById('addToCart');
addButton.addEventListener('click', () => {
    storeProductId();
    window.location.href = './cart.html';
});