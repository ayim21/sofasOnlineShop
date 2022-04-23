//localStorage.clear();

/* DISPLAY PRODUCT */

function insertImage(item) {
    let image = document.createElement('img');
    let container = document.querySelector('.item__img');
    container.appendChild(image);
    image.setAttribute('src', `${item.imageUrl}`);
}

function insertText(item) {
    document.querySelector('#title').innerHTML = `${item.name}`;
    document.querySelector('#price').innerHTML = `${item.price}`;
    document.querySelector('#description').innerHTML = `${item.description}`;
}

function insertColorChoices(item) {
    for (let i = 0; i < item.colors.length; i++) {
        let colorOption = document.createElement('option');
        let container = document.querySelector('#colors');
        container.appendChild(colorOption);
        colorOption.setAttribute('value', `${item.colors[i]}`);
        colorOption.innerText = `${item.colors[i]}`;
    }
}

/* API call */

//Get productID from current page URL
const currentPageUrl = window.location.href;
const newUrl = new URL(currentPageUrl);
const productId = newUrl.searchParams.get('id');
//Endpoint to getOneProduct
const url = `http://localhost:3000/api/products/${productId}`;

fetch(url)
    .then((res) => {
        if (res.ok) return res.json();
    })
    .then((item) => {
        console.log(item);
        insertImage(item);
        insertText(item);
        insertColorChoices(item);
    })
    .catch((err) => {
        console.log('Une erreur est survenue : ' + err);
    });

/* ADD ITEMS INTO CART */

//Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart'));
if (cart == null) cart = [];
console.log(cart);

function addIntoCart() {
    //Create newItemSelected object
    const selectedQty = document.querySelector('#quantity').value;
    const selectedColor = document.querySelector('#colors').value;

    const newItemSelected = {
        id: productId,
        quantity: selectedQty,
        color: selectedColor
    };

    //Add newItemSelected into cart
    const idValue = newItemSelected.id;
    const qtyValue = newItemSelected.quantity;
    const colorValue = newItemSelected.color;

    if (localStorage.cart == null) {
        cart.push(newItemSelected);
    } else if (localStorage.cart.includes(idValue) && localStorage.cart.includes(colorValue)) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === idValue && cart[i].color === colorValue) {
                let newQty = Number(qtyValue) + Number(cart[i].quantity);
                cart[i].quantity = newQty.toString();
            }
        }
    } else {
        cart.push(newItemSelected);
    }

    //Save the cart with new item added into
    localStorage.setItem('cart', JSON.stringify(cart));
}

function confirm() {
    document.querySelector('#addToCart').addEventListener('click', () => {
        if (document.querySelector('#colors').value == '') {
            alert('Veuillez choisir une couleur');
        } else if (document.querySelector('#quantity').value <= 0 || document.querySelector('#quantity').value > 100) {
            alert('Veuillez sélectionner une quantité entre 1 et 100');
        } else  {
            addIntoCart();
            alert('Votre article a été ajouté dans le panier');
            console.log(localStorage.cart);
        }
    });
}

confirm();