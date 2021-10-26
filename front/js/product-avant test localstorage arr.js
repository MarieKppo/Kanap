// PAGE PRODUIT 

// recup url de la page produit
const params = document.location.href;
const kanapUrl = new URL(params);
// recup _id produit dans l'url
const idKanap = kanapUrl.searchParams.get("id"); //faut il tester si l'url possède un id ou pas ?

//envoi id à l'api pour retourner infos du produit 
fetch("http://localhost:3000/api/products/" + idKanap)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    //modif titre page web avec nom produit
    document.querySelector("title").innerHTML = value.name;

    // recup div image dans laquelle la balise image doit apparaître
    let divImage = document.querySelector(".item__img");
    let image = document.createElement('img');
    image.src = value.imageUrl;
    image.alt = value.altTxt;
    //affichage image
    divImage.appendChild(image);

    // modif titre, prix et description
    document.querySelector("#title").innerHTML = value.name;
    document.querySelector("#price").innerHTML = value.price;
    document.querySelector("#description").innerHTML = value.description;

    //implémentation du choix des couleurs dispo pour le produit
    let colors = document.querySelector("#colors");
    let colorsOptions = value.colors;
    colorsOptions.forEach(element => {
      let option = document.createElement("option");
      option.innerHTML = element;
      option.value = element;
      colors.appendChild(option);
    });
  })
  .catch(function (error) {
    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
  });

// fonction ajouter au panier
let addToCartBtn = document.querySelector('#addToCart');
addToCartBtn.onclick = () => {
  let selectedColor = document.querySelector("#colors").value;
  let quantity = document.querySelector("input").value;
  console.log("couleur et quantuté sélectionnées : " + selectedColor + " " + quantity )

   // variable panier = tableau. elle contient chaque ajout au panier : un ajout = [i]

  if(selectedColor == "") {
    alert("Veuillez sélectionner une des couleurs proposées pour ce modèle svp.");
  }
  if((quantity == null) || (quantity < 1) || (quantity > 100)) {
    alert("Veuillez renseigner un quantité en utilisant un nombre compris entre 1 et 100 svp.");
  } else {  //alors ajouter au localStorage, ajouter aux articles déjà stockés s'il y en a. Tableau ?
    if(localStorage.getItem('data-id')){ // si cart != "" alors ajouter cart.push(le nouvel article ajouté)
      console.log('resultat du local storage : ' 
                    + localStorage.getItem('data-id', idKanap) + " " 
                    + localStorage.getItem('data-color') + " " 
                    + localStorage.getItem('data-quantity'));
      localStorage.setItem
    }
    else{ // puisque cart == "" alors ajouter un article cart.push(localStorage stringyf)
      localStorage.setItem('data-id', idKanap);
      localStorage.setItem('data-color', selectedColor);
      localStorage.setItem('data-quantity', quantity);
      console.log('resultat du local storage else : ' 
                  + localStorage.getItem('data-id', idKanap) + " " 
                  + localStorage.getItem('data-color') + " " 
                  + localStorage.getItem('data-quantity'));
    }
  };
}
//attention ne pas imbriquer d'event listener dans des events