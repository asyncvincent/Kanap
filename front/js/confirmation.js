// Get product id from url
function getId() {
    var url = window.location.href; // Get url
    var id = new URL(url).searchParams.get("id"); // Get product id from url
    return id;
}

document.getElementById('orderId').innerHTML = `<b>${getId()}</b>`; // Display order id