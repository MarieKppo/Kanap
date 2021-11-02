//requête service web - accéder à l'api
let products = fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    //variable récup la section items dans laquelle vont apparaître les articles
    let items = document.querySelector("#items");
    //boucle
      value.forEach(element => {
        console.log(element);
        //création du lien vers page produit
        let newA = document.createElement('a');
        newA.href = './product.html?id='+ element._id;//recupère la ref de chaque élément,

        //création de l'article
        let article = document.createElement('article');
        
        // création image
        let image = document.createElement('img');
        image.src = element.imageUrl;
        image.alt = element.altTxt; // recup alt image : utiliser getAttribute

        // nom du produit 
        let productName = document.createElement('h3');
        productName.className = "productName"; //création de la classe pour le contenu html
        productName.textContent = element.name; //recup de la prop name dans le tableau

        // extrait de description
        let productDescription = document.createElement('p');
        productDescription.className = "productDescription";
        productDescription.textContent = element.description;

        // affichage
        article.appendChild(image);
        article.appendChild(productName);
        article.appendChild(productDescription);
        newA.appendChild(article);
        items.appendChild(newA);

      });
  })
  .catch(function(err) {
    // Une erreur est survenue
    let serverErr = document.querySelector(".items");
    serverErr.innerHTML = "<div>Absence de connexion au serveur, nous ne pouvons pas afficher les articles.</div>";
    // alert("nous n'avons pas pu charger les canapés, ils sont trop lourds."); 
  });

