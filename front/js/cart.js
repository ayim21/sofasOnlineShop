/* GET CART FROM LOCALSTORAGE */
let cart = JSON.parse(localStorage.getItem('cart'));
console.log(cart);

/* DISPLAY CART ITEMS */
async function displayInfo() {
    //If cart is empty --> display message that cart is empty
    if (cart == null) {
        document.querySelector('h1').innerText = "Votre panier est vide.";
    }
    //Else display cart items
    else {
        document.querySelector('h1').innerText = "Votre panier";
        //For each item, create article
        for (let item of cart) {
            //Send HTTP request
            let response = await fetch(`http://localhost:3000/api/products/${item.id}`);
            let data = await response.json();
            //Display each item from the cart
            function insertContent(data) {
                let article = document.createElement('article');
                document.querySelector('#cart__items').appendChild(article);
                //article.setAttribute('class', 'cart__item');
                article.classList.add('cart__item');
                article.setAttribute('data-id', `${item.id}`);
                article.setAttribute('data-color', `${item.color}`);
                article.innerHTML =
                `<div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${item.color}</p>
                        <p class="cart__item__content__price">${data.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>`;
            };
            insertContent(data);
        }
    }
}
displayInfo();

/* DISPLAY ORDER TOTAL */
async function orderTotalPrice() {
    let totalPrice = 0;
    //For each item multiply qty and unit price
    for (let item of cart) {
        let response = await fetch(`http://localhost:3000/api/products/${item.id}`);
        let data = await response.json();
        
        let itemPrice = `${item.quantity}` * `${data.price}`;
        totalPrice += itemPrice
    }
    //Insert Sum of all prices
    document.querySelector('#totalPrice').textContent = totalPrice;
}
orderTotalPrice();

async function orderTotalQuantity() {
    let totalQuantity = 0;

    for (let item of cart) {
        totalQuantity += Number(`${item.quantity}`);
    }
    //Insert Sum of all quantities
    document.querySelector('#totalQuantity').textContent = totalQuantity;
}
orderTotalQuantity();