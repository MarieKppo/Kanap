// PAGE PRODUIT 

// recup url de la page produit
const params = document.location.href;
const kanapUrl = new URL(params);
console.log(kanapUrl); //affichage test

// recup _id produit dans l'url
const idKanap = kanapUrl.searchParams.get("id"); //faut il tester si l'url possède un id ou pas ?
console.log(idKanap);


//envoi id à l'api pour retourner infos du produit 
fetch("http://localhost:3000/api/products/" + idKanap)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
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
    // recup liste option
    let colors = document.querySelector("#colors");
    //création variable tableau des couleurs
    let colorChoice = value.colors;
    console.log("les couleurs possibles pour ce modèle sont : " + colorChoice + ".");
    //boucle affichage des couleurs dispo
    for (let i = 0; i < colorChoice.length; i++) {
      let option = document.createElement("option");
      option.innerHTML = colorChoice[i];
      option.value = colorChoice[i]
      colors.appendChild(option);
    }
    
    console.log("juqu'ici l'affiche du produit et de ses options fonctionne");
  

  })
  .catch(function(error) {
    console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
  });


let addToCartBtn = document.querySelector('#addToCart');
addToCartBtn.onclick = () => { 

  console.log('test')
  
  //quand choix de la couleur du canap, retourner la couleur choisie au programme pour ajout panier : switch ? ou dans la boucle ?
  let selectedColor = document.querySelector('#colors').value
  console.log("la couleur sélectionnée est le : " + selectedColor)

  // let selectedColor = get[document.querySelector("option").selectedIndex].value;
  // console.log(selectedColor);
  let quantity = document.querySelector("input").value;
  console.log(quantity);

  if(selectedColor == ""){
    alert("Veuillez sélectionner une des couleurs proposées pour ce modèle svp.");
  }
  if ((quantity == null) || (quantity < 1) || (quantity > 100)){
    alert("Veuillez renseigner un quantité en utilisant un nombre compris entre 1 et 100 svp.");
  }

  else {
    localStorage.setItem('Couleur', selectedColor);
    localStorage.setItem('Quantité', quantity);
    console.log('local storage ok');

  };
}