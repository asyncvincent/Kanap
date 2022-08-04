// Get product id from url
function getId() {
    var id = new URLSearchParams(window.location.search).get('id'); // Get product id from url
    return id;
}

document.getElementById('orderId').innerHTML = `<b>${getId()}</b>`; // Display order id