// Get product details from API 
const productId = new URLSearchParams(window.location.search).get('id');
const product = `http://localhost:3000/api/products/${productId}`;

async function getProductDetails() {
    await fetch(product)
        .then(response => response.json())
        .then(data => {

            // Title of the page
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
            colorSelect.append(...colorOptions);
        })
        .catch(err => console.log(err)); // Catch error if any
}

getProductDetails();

const addToCartBtn = document.getElementById('addToCart');
addToCartBtn.addEventListener('click', async () => {
    await fetch(product)
        .then(response => response.json())
        .then(data => {

            // Verify if user as selected a color
            let productcolors = document.getElementById('colors');
            if (productcolors.options[0].selected) {
                alert('Veuillez selectionner une couleur');
                return false;
            }

            // Verify if user as selected a quantity
            let productQuantity = document.getElementById('quantity').value;
            if (productQuantity < 1) {
                alert('Veuillez entrer une quantité supérieure à 0');
                return false;
            }

            const selectedColor = productcolors.options[productcolors.selectedIndex].value;
            const productColors = data.colors.filter(color => color === selectedColor);

            // Create product object
            const product = {
                id: data._id,
                name: data.name,
                description: data.description,
                price: data.price,
                color: productColors.join(''),
                image: data.imageUrl,
                altImg: data.altTxt,
                quantity: parseInt(productQuantity)
            }

            // Add product to cart in localStorage and regroup products by id and color
            const cartDetails = JSON.parse(localStorage.getItem('cart')) || [];
            const cartProduct = cartDetails.find(product => product.id === data._id && product.color === productColors.join(''));
            if (cartProduct) {
                cartProduct.quantity += parseInt(productQuantity);
            } else {
                cartDetails.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cartDetails));

            // Redirect to cart page
            window.location.href = './cart.html';

        })
        .catch(err => console.log(err)); // Catch error if any
});