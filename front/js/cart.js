//PAGE PANIER
const cart = JSON.parse(localStorage.getItem("cart"));

async function displayItem() {
    if (cart === null || cart == 0) {
        // ajout d'une div "panier vide"
        document.querySelector("#cart__items").innerHTML = "<div class=\"cart_item\">Votre panier est vide !</div>";
        // masquer le formulaire de commande
        document.querySelector(".cart__order").style.display = "none";
    } else {
        for (let i = 0; i < cart.length; i++) {
            const product = cart[i];
            let idKanap = product.ref;
            let selectedColor = product.color;
            let quantity = product.quantity;
            // appeler l'api et récup les données de l'élément ciblé dans la boucle
            await fetch("http://localhost:3000/api/products/" + idKanap)
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(function (value) { // affichage du panier 
                    let productPrice = value.price;
                    let productName = value.name;
                    let imageUrl = value.imageUrl;
                    let altTxt = value.altTxt;
                    // créer les éléments dans lesquels les infos des produits vont ê affichés :
                    let cartSection = document.querySelector('#cart__items');
                    let article = document.createElement('article');
                    article.className = "cart__item";
                    article.setAttribute('data-id', idKanap);

                    let divImage = document.createElement('div');
                    divImage.className = ".cart__item__img";
                    divImage.innerHTML = `<img src="${imageUrl}" alt="${altTxt}" width="150px" height="auto">`

                    let divContent = document.createElement('div');
                    divContent.className = "cart__item__content";

                    let divTitlePrice = document.createElement('div');
                    divTitlePrice.className = "cart__item__content__titlePrice";
                    let title = document.createElement('h2');
                    title.innerHTML = productName;
                    let price = document.createElement('p');
                    price.innerHTML = productPrice + ' EUR';

                    let divSettings = document.createElement('div');
                    divSettings.className = "cart__item__content__settings";
                    let divQuantity = document.createElement('div');
                    divQuantity.className = "cart__item__content__settings__quantity";
                    // divQuantity.innerHTML = `<p>Qté :<p> <br/>
                    //     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">`;
                    let quantityTitle = document.createElement('p');
                    quantityTitle.innerHTML = "Qté : ";
                    let quantityInput = document.createElement('input');
                    quantityInput.type = "number";
                    quantityInput.name = "itemQuantity";
                    quantityInput.className = "itemQuantity";
                    quantityInput.min = "1";
                    quantityInput.max = "100";
                    quantityInput.value = quantity;

                    let divColor = document.createElement('div');
                    divColor.innerHTML = `<p>Couleur : ${selectedColor}<p>`;

                    let divDelete = document.createElement('div');
                    divDelete.className = "cart__item__content__settings__delete";
                    let deleteItem = document.createElement('p');
                    deleteItem.className = "deleteItem";
                    deleteItem.innerText = "Supprimer";

                    // affichage des éléments (ordre décroissant du plus précis au plus global)
                    divTitlePrice.appendChild(title);
                    divTitlePrice.appendChild(price);
                    divContent.appendChild(divTitlePrice);

                    divQuantity.appendChild(quantityTitle);
                    divQuantity.appendChild(quantityInput);
                    divSettings.appendChild(divColor);
                    divSettings.appendChild(divQuantity);
                    divDelete.appendChild(deleteItem);
                    divSettings.appendChild(divDelete);
                    divContent.appendChild(divSettings);

                    article.appendChild(divImage);
                    article.appendChild(divContent);
                    cartSection.appendChild(article);

                })
                .catch(function (error) {
                    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                });
        }

        // totalInCart(); fonction greffée à totalPce
        deleteProduct();
        changePdtQty();
        totalPce();

    };
}
displayItem();

/* fonction pour modifier la quantité de l'article 
 * = 1 récup les input itemQuantity des articles et leur id dans le panier / 2 récup qté dans l'input itemQuantity
 * si itemQuantity change (addEventlistener) / alors set nouvelle quantité de itemQuantity ds DOM et dans cart
 */
function changePdtQty() { //chercher autres techniques pour retirer l'event listener de la fonction (autre écouteur)
    // sélection des inputs
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    for (let k = 0; k < itemQuantity.length; k++) {
        // console.log(itemQuantity[k].value);
        itemQuantity[k].addEventListener('change', () => { //callback        
            // console.log('index produit ' + k + ' valeur initiale ds la localStorage : ' + cart[k].quantity + ' nouvelle valeur : ' + itemQuantity[k].value);
            cart[k].quantity = itemQuantity[k].value;
            localStorage.setItem('cart', JSON.stringify(cart));
            // totalInCart();
            // ajouter fonction prix total pour recalcul à chaque retrait d'article
            totalPce();
        })
    }
}

/* fonction pour supprimer l'article : 
 * = 1 récup articles et leur id dans le cart 
 * si deleteItem click (addeventlistener) / alors set suppr product ds DOM et dans cart
 */
function deleteProduct() {
    let deleteItem = document.querySelectorAll('.deleteItem');
    for (let j = 0; j < deleteItem.length; j++) {
        deleteItem[j].addEventListener('click', (event) => { //callback
            event.preventDefault();
            let itemToDelete = cart.indexOf(cart[j]);
            console.log("index du produit à suppr : " + itemToDelete + " couleur : " + cart[j].color)
            cart.splice(itemToDelete, 1);
            // renvoyer ce nouveau panier dans le localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            // alert('Le Kanap a été supprimé du panier');
            // recharger la page pour suppr affichage du produit dans le panier
            location.reload();
        })
        totalPce();
    }
}

/* fonction pour calculer le nombre d'articles dans le panier
// function totalInCart() {
//     //logique : pour chaque élément du panier, ajouter sa quantité à la variable totalQuantity
//     let totalQty = Number(0);
//     cart.forEach(element => {
//         totalQty += Number(element.quantity);
//     });
//     document.querySelector('#totalQuantity').innerText = totalQty;
* }
*/

/* fonction pour calculer le montant total du panier 
 * 1 = calculer le prix d'un article * sa quantité
 * 2 = additionner les totaux de chaque ligne dans le prix total
 */
function totalPce() {
    let totalPce = parseInt(0);
    let totalQty = Number(0);
    // console.log('test')

    let elements = document.querySelectorAll('.cart__item');
    elements.forEach(element => {
        let dataAttribute = element.getAttribute('data-id');
        let productQty = element.querySelector(".itemQuantity").value;

        totalQty += Number(productQty);
        document.querySelector('#totalQuantity').innerText = totalQty;

        fetch("http://localhost:3000/api/products/" + dataAttribute)
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (value) {
                let productPrice = Number(value.price);
                // console.log("qté du produit " + productQty + " prix produit " + productPrice)
                // calcul total
                totalPce += (productQty * productPrice);
                // affichage prix total dans le panier
                document.querySelector('#totalPrice').innerText = totalPce;
            })
    });
}

/******************************* vérifier les infos dans le formulaire de commande + requet post api */
/* ajouter condition si panier == vide alors ne pas afficher le formulaire */
// if (cart === null || cart == 0) {
//     // cacher le formulaire 
//     // document.querySelector(".cart__order").style.display = "none";
// } else {
    // récup le bouton commander pour écouter le click
    let orderBtn = document.querySelector('#order');
    // event listerner : au click si vérif ok alors envoyer contact + products à api (post)
    orderBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let contact = {};
        let products = [];

        //collecter les id des produits du panier
        cart.forEach(element => {
            products.push(element.ref);
        })

        //vérification des données du formulaire 
        let firstName = document.querySelector('#firstName');
        let lastName = document.querySelector('#lastName');
        let address = document.querySelector('#address');
        let city = document.querySelector('#city');
        let email = document.querySelector('#email');
        // prénom
        if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(firstName.value)) {
            let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
            firstNameErrorMsg.innerHTML = "Renseignez votre <b>prénom</b> pour valider votre commande."
            console.log("dans if prénom, car " + firstName.value + " ne correspond pas au modèle");
        }
        // nom
        else if (!/^[A-Za-zÀ-ÿ\-']+$/gi.test(lastName.value)) {
            let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
            lastNameErrorMsg.innerHTML = "Renseignez votre nom pour valider votre commande."
            console.log("dans if nom, car nom ne correspond pas au modèle");
        }
        // adresse
        else if (!/^([A-Za-zÀ-ÿ]|[0-9]{1,4})([A-Za-zÀ-ÿ\-' ]+$)/gi.test(address.value)) {
            let addressErrorMsg = document.querySelector('#addressErrorMsg');
            addressErrorMsg.innerHTML = "Renseignez votre address pour valider votre commande."
            console.log("dans if adresse, car adresse ne correspond pas au modèle");
        }
        // ville
        else if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(city.value)) { // ou cp + ville : /^[0-9]{5} [A-Za-zÀ-ÿ\-' ]+$/gi
            let cityErrorMsg = document.querySelector('#cityErrorMsg');
            cityErrorMsg.innerHTML = "Renseignez votre ville pour valider votre commande."
            console.log("dans if ville, car ville est ne correspond pas au modèle");
        }
        // email
        else if (!/([a-z\.\-]{1,})@([a-z\-\.]{2,})\.([a-z]{2,4})/gi.test(email.value)) {
            let emailErrorMsg = document.querySelector('#emailErrorMsg');
            emailErrorMsg.innerHTML = "Renseignezvotre email pour valider votre commande."
            console.log("dans if email, car email correspond pas au regex");
        } else {
            // récup valeurs et créer un objet contact 
            contact = {
                'firstName': firstName.value,
                'lastName': lastName.value,
                'address': address.value,
                'city': city.value,
                'email': email.value,
            }
            // console.log('contact')
            // console.log(contact)
            
            // console.log('le tableau des id des produits :' + products);
        // console.log('les données contact sont : ');
        // console.log(contact);
        let order = {
            contact,
            products
        }
        console.log(order);

        //requete post api
        fetch("http://localhost:3000/api/products/order", {
                "method": "post",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(order)
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (value) {
                localStorage.setItem('order', JSON.stringify(value));
                //redirection vers page confirmation + 
                window.location.href = "confirmation.html"    
            })
            .catch(err => {
                console.error(err);
            });
        }
        //avec requete post hors else : requete envoyée meme si contact = vide
    }); // fin eventListener
// }



//trash saved au cas ou
/* fonction pour collecter tous les id des produits dans le panier
// function allProductsId() {
//     let arrayProductsId = [];
//     cart.forEach(element => {
//         arrayProductsId.push(element.ref);
//     // })
//     // console.log('le tableau des id des produits :')
//     // console.log(arrayProductsId);
//     return arrayProductsId;
//     })
// }
*/
/* contrôle que les infos saisies dans le formulaire correspondent aux types de données attendues + requete post api : 
 * logique : si prénom != regex lettres alors afficher span "veuillez renseigner votre prénom" etc
 * si mail != regex mail ...
 * si cp != regex cp ...
 * else récup les données dans l'objet contact et les envoyer pour générer id commande

function validateForm() {
    let firstName   = document.querySelector('#firstName');
    let lastName    = document.querySelector('#lastName');
    let address     = document.querySelector('#address');
    let city        = document.querySelector('#city');
    let email       = document.querySelector('#email'); 
    // prénom
    if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(firstName.value)) {
        let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
        firstNameErrorMsg.innerHTML = "Renseignez votre <b>prénom</b> pour valider votre commande."
        console.log("dans if prénom, car " + firstName.value + " ne correspond pas au modèle");
    }
    // nom
    else if (!/^[A-Za-zÀ-ÿ\-']+$/gi.test(lastName.value)) {
        let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
        lastNameErrorMsg.innerHTML = "Renseignez votre nom pour valider votre commande."
        console.log("dans if nom, car nom ne correspond pas au modèle");
    }
    // adresse
    else if (!/^([A-Za-zÀ-ÿ]|[0-9]{1,4})([A-Za-zÀ-ÿ\-' ]+$)/gi.test(address.value)) {    
        let addressErrorMsg = document.querySelector('#addressErrorMsg');
        addressErrorMsg.innerHTML = "Renseignez votre address pour valider votre commande."
        console.log("dans if adresse, car adresse ne correspond pas au modèle");
    }
    // ville
    else if (!/^[A-Za-zÀ-ÿ\-' ]+$/gi.test(city.value)) { // ou cp + ville : /^[0-9]{5} [A-Za-zÀ-ÿ\-' ]+$/gi
        let cityErrorMsg = document.querySelector('#cityErrorMsg');
        cityErrorMsg.innerHTML = "Renseignez votre ville pour valider votre commande."
        console.log("dans if ville, car ville est ne correspond pas au modèle");
    }
    // email
    else if (!/([a-z\.\-]{1,})@([a-z\-\.]{2,})\.([a-z]{2,4})/gi.test(email.value)) {
        let emailErrorMsg = document.querySelector('#emailErrorMsg');
        emailErrorMsg.innerHTML = "Renseignezvotre email pour valider votre commande."
        console.log("dans if email, car email correspond pas au regex");
    } 
    else {
        // récup valeurs et créer un objet contact 
        // insérer la fonction qui permet d'envoyer les infos de contact à l'api + tester api avant envoie !!!
        let contact = {
            'firstName' : firstName.value,
            'lastName'  : lastName.value,
            'address'   : address.value, 
            'city'      : city.value, 
            'email'     : email.value,
        }
        // console.log("afficher le contact dans else");
        // console.log(contact);         
    }
}
*/