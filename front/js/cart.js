/*****************/
/* SHOPPING CART */
/*****************/

/* GET CART FROM LOCALSTORAGE */
let cart = JSON.parse(localStorage.getItem('cart'));
console.log(cart);

/* ARRAY WITH SHOPPING CART ITEMS ID */
let products = [];
if (cart != null || cart.length != 0) {
    for (let item of cart) {
        products.push(item.id);
    }
}
console.log(products);


/* DISPLAY EACH SHOPPING CART ITEM*/
async function displayInfo() {
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

async function orderTotalQuantity() {
    let totalQuantity = 0;

    for (let item of cart) {
        totalQuantity += Number(`${item.quantity}`);
    }
    //Insert Sum of all quantities
    document.querySelector('#totalQuantity').textContent = totalQuantity;
}

/* DELETE ITEM FROM SHOPPING CART */
async function deleteItem() {
    for (let item of cart) {
        let response = await fetch(`http://localhost:3000/api/products/${item.id}`);
        let data = await response.json();

        let deleteItemButton = document.querySelectorAll('.deleteItem');
        let i = deleteItemButton.length - 1;
        deleteItemButton[i].addEventListener('click', () => {
            cart.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        })
    }
}

/* MODIFY SHOPPING CART ITEM QUANTITY */
async function modifyItemQty() {
    for (let item of cart) {
        let response = await fetch(`http://localhost:3000/api/products/${item.id}`);
        let data = await response.json();

        let itemQtyInput = document.getElementsByClassName('itemQuantity');
        let i = itemQtyInput.length - 1;
        itemQtyInput[i].addEventListener('change', function () {
            if (this.value <= 0) {
                this.value = 0;
                cart.splice(i, 1);
            } else if (this.value >= 100) {
                this.value = 100;
                cart[i].quantity = this.value;
            } else { cart[i].quantity = this.value }
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        })
    }
}

/* MAIN FUNCTION */
function main() {
    //If cart is empty --> display message that cart is empty
    if (cart == null || cart.length == 0) {
        return document.querySelector('h1').innerText = "Votre panier est vide.";
    }
    //Else display cart items
    else {
        document.querySelector('h1').innerText = "Votre panier";
        displayInfo();
        orderTotalPrice();
        orderTotalQuantity();
        deleteItem();
        modifyItemQty();
    }
}
main();


/**************/
/* ORDER FORM */
/**************/

let form = document.querySelector('form');

/* FirstName RegExp */
function validFirstName(firstName) {
    let firstNameRegExp = new RegExp('^[A-Za-z éèëôöîï-]+$');
    let testFirstName = firstNameRegExp.test(firstName.value);

    if (firstName.value == '') {
        document.getElementById('firstNameErrorMsg').textContent = 'Veuillez saisir votre prénom.';
    } else if (testFirstName) {
        document.getElementById('firstNameErrorMsg').textContent = '';
        return true;
    } else {
        document.getElementById('firstNameErrorMsg').textContent = 'Veuillez saisir le prénom saisi.';
        return false;
    }
};

form.firstName.addEventListener('change', function () {
    validFirstName(this);
})

/* LastName RegExp */
function validLastName(lastName) {
    let lastNameRegExp = new RegExp('^[A-Za-z éèëôöîï\'-]+$');
    let testLastName = lastNameRegExp.test(lastName.value);

    if (lastName.value == '') {
        document.getElementById('lastNameErrorMsg').textContent = 'Veuillez saisir votre nom.';
    } else if (testLastName) {
        document.getElementById('lastNameErrorMsg').textContent = '';
        return true;
    } else {
        document.getElementById('lastNameErrorMsg').textContent = 'Veuillez vérifier le nom saisi.';
        return false;
    }
};

form.lastName.addEventListener('change', function () {
    validLastName(this);
})

/* Address RegExp */
function validAddress(address) {
    let addressRegExp = new RegExp('[A-Za-zéèëôîï0-9\'\.\-\s\,]{5}', 'g');
    let testAddress = addressRegExp.test(address.value);

    if (address.value == '') {
        document.getElementById('addressErrorMsg').textContent = 'Veuillez saisir votre adresse.';
    } else if (testAddress) {
        document.getElementById('addressErrorMsg').textContent = '';
        return true;
    } else {
        document.getElementById('addressErrorMsg').textContent = 'Veuillez vérifier l\'adresse saisie.';
        return false;
    }
};

form.address.addEventListener('change', function () {
    validAddress(this);
})

/* City RegExp */
function validCity(city) {
    let cityRegExp = new RegExp('[A-Za-zéèëôîï0-9\'\.\-\s\,]{2}');
    let testCity = cityRegExp.test(city.value);

    if (city.value == '') {
        document.getElementById('cityErrorMsg').textContent = 'Veuillez saisir votre ville.';
    } else if (testCity) {
        document.getElementById('cityErrorMsg').textContent = '';
        return true;
    } else {
        document.getElementById('cityErrorMsg').textContent = 'Veuillez vérifier la ville saisie.';
        return false;
    }
};

form.city.addEventListener('change', function () {
    validCity(this);
})

/* Email RegExp */
function validEmail(email) {
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let testEmail = emailRegExp.test(email.value);

    if (email.value == '') {
        document.getElementById('emailErrorMsg').textContent = 'Veuillez saisir votre adresse mail.';
    } else if (testEmail) {
        document.getElementById('emailErrorMsg').textContent = '';
        return true;
    } else {
        document.getElementById('emailErrorMsg').textContent = 'Veuillez vérifier l\'adresse mail saisie.';
        return false;
    }
};

form.email.addEventListener('change', function () {
    validEmail(this);
})


/**********************/
/* ORDER CONFIRMATION */
/**********************/

form.addEventListener('submit', function (event) {
    event.preventDefault();

    //Object that contains form inputs
    const contact = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value
    };

    //Info to send to API to get back order number
    const toSendToApi = {
        products,
        contact
    };
    console.log(toSendToApi);

    if (!validFirstName(form.firstName)
        || !validLastName(form.lastName)
        || !validAddress(form.address)
        || !validCity(form.city)
        || !validEmail(form.email)) {
        alert('Veuillez vérifier que tous les champs sont remplis correctement.')
    } else if (validFirstName(form.firstName)
        && validLastName(form.lastName)
        && validAddress(form.address)
        && validCity(form.city)
        && validEmail(form.email)) {

        //To send POST request to API
        let url = 'http://localhost:3000/api/products/order';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(toSendToApi),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        }).then(function (res) {
            if (res.ok) {
                return res.json();
            }
        }).then(function (data) {
            //Clear shopping cart
            localStorage.clear();
            //Go to confirmation page
            location.replace(`./confirmation.html?id=${data.orderId}`);
        }).catch(function (err) {
            console.log('Une erreur est survenue : ' + err);
        })
    }
})