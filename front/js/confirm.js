//PAGE CONFIRMATION = afficher l'id de la commande
let order = JSON.parse(localStorage.getItem("order"));
// console.log(order.orderId);
let spanId = document.querySelector("#orderId");
spanId.innerHTML = order.orderId;
localStorage.clear();