//PAGE PANIER
const cart = JSON.parse(localStorage.getItem("cart"));

async function displayItem() {
    for (let i = 0; i < cart.length; i++) {
        const product = cart[i];
        // let url = './product.html?id='+ element.ref;//recupère la ref de chaque élément,
        // console.log(url);
        let idKanap = product.ref;
        let selectedColor = product.color;
        let quantity = product.quantity;
        // console.log('dans le panier local nous avons : ' + quantity + ' exemplaires de ' + idKanap + ' de couleur : ' + selectedColor);
        // appeler l'api et récup les données de l'élément ciblé dans la boucle
        await fetch("http://localhost:3000/api/products/" + idKanap)
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (value) {
                productPrice = value.price;
                let productName = value.name;
                let imageUrl = value.imageUrl;
                let altTxt = value.altTxt;
                //console.log('les elmts du panier sont : ' + productName + ' ' + selectedColor + ' de prix : ' + productPrice + ' EUR' + ' ' + imageUrl + altTxt + ' ' + quantity);

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
};

if (cart === null) {
    alert('le panier est vide'); //panier vide, ne rien faire ou afficher un texte qui le dit
} else {
    
    displayItem();

}



/* modifier la quantité de l'article 
 * = 1 récup articles et leur dataset.id / 2 récup qté dans l'input itemQuantity
 * si itemQuantity change (addeventlistener) / alors set nouvelle quantité de itemQuantity ds DOM et dans cart
 */
function changePdtQty() {
    let article = document.querySelectorAll('article');
    // let productID = article.dataset.id;
    console.log(article);
}
changePdtQty();

/* Supprimer l'article : 
 * = 1 récup articles et leur dataset.id / 2 récup qté dans l'input itemQuantity
 * si deleteItem click (addeventlistener) / alors set suppr product ds DOM et dans cart
 */
function deleteProduct() {
    let deleteItem = document.querySelectorAll('.deleteItem');
    console.log(deleteItem);
    console.log("jusqu'ici ça focntionne")

    for (let j = 0; j < deleteItem.length; j++) {

        deleteItem[j].addEventListener('click', (event) => {
            // event.preventDefault(); c'est un paragraphe pas un btn
            console.log("test")
            deleteItem[j].value = itemQuantity.value;
        })

    }
}


// fonction pour calculer le nombre d'articles dans le panier
function totalInCart() {
    //logique : pour chaque élément du panier, ajouter sa quantité à la variable totalQuantity
    let totalQty = Number(0);
    cart.forEach(element => {
        totalQty += element.quantity;
    });
    let totalQuantity = document.querySelector('#totalQuantity');
    totalQuantity.innerText = totalQty;
}
totalInCart();





// fonction pour calculer le montant total du panier 
// function totalPce() {
//     let totalPce;

//     cart.forEach(element => {
//         let idKanap = element.ref;
//         let productQty = Number(element.quantity);
//         totalPce = Number(0);

//         fetch("http://localhost:3000/api/products/" + idKanap)
//             .then(function (res) {
//                 if (res.ok) {
//                     return res.json();
//                 }
//             })
//             .then(function (value) {
//                 productPrice = Number(value.price);
//                 console.log("qté du produit " + productQty + " prix produit " + productPrice)

//                 // calcul total
//                 totalPce += (productQty * productPrice);
//                 console.log("retour du prix total boucle = " + totalPce);
//             })
//     });

//     // affichage prix total dans le panier
//     let totalPrice = document.querySelector('#totalPrice');
//     totalPrice.innerText = totalPce;
// }
// totalPce();




// itemQuantity.addEventListener('change', function() {
//     //la fonction qui change la valeur de l'input qté s'il est modif par l'utilisateur
//     console.log('dans la fonction fléchée')
//     itemQuantity.textContent = this.value;
// })



//calcul montant total : utiliser la fonction reduce














//augmenter la quantité d'un article ou supprimer du panier : 
// let addCount = 0;
// let removeCount = 0;

// document
//   .getElementById("parent")
//   .addEventListener('click', function(){
//     document
//       .getElementById("parent-count").innerText = (++parentCount);
// });

// document
//   .getElementById("child")
//   .addEventListener('click', 
// function(e){
//   e.preventDefault(); // pour stopper le rechargement de la page
//   e.stopPropagation(); // pou répercuter l'action uniquement sur l'elmt child

//   document
//       .getElementById("child-count").innerText = (++childCount);
// });
//générer un id de commande ? = comment ?


//PAGE CONFIRMATION 
//afficher l'id de la commande 