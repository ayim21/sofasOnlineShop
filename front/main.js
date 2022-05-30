/* HOME VIEW */
const Home = {
    template: '#home',
    name: 'Home',
    data() {
        return {
            items: [{
                _id: '',
                imageUrl: '',
                altTxt: '',
                name: '',
                description: ''
            }]
        }
    },
    created() {
        this.getItems();
    },
    methods: {
        getItems() {
            axios.get('http://localhost:3000/api/products')
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    this.items[i] = res.data[i]; 
                }
                console.log(res.data)
            }).catch(err => console.log(err))
        }
    }
}

/* PRODUCT VEW */
const Product = {
    template: '#product',
    name: 'Product',
    data() {
        return {
            item: [{
                _id: '',
                imageUrl: '',
                altTxt: '',
                name: '',
                price: '',
                description: '',
                colors: []
            }]
        }
    },
    created() {
        this.getOneItem();
    },
    methods: {
        getOneItem() {
            const productId = this.$route.params._id;
            axios.get(`http://localhost:3000/api/products/${productId}`)
            .then(res => {
                this.item = res.data;
                for(let i = 0; i < res.data.colors.length; i++) {
                    this.item.colors[i] = res.data.colors[i];
                }
                console.log(res.data)
            }).catch(err => console.log(err))
        },
        addToCart() {
            const itemId = this.$route.params._id;
            const itemImg = this.item.imageUrl;
            const itemAltTxt = this.item.altTxt;
            const itemPrice = this.item.price;
            const itemDescription = this.item.description;
            const itemColor = document.querySelector('#colors');
            const itemQty = document.querySelector('#quantity');

            if (itemColor.value == '') {
                alert('Veuillez choisir une couleur.')
            } else if (itemQty.value == 0) {
                alert('Veuillez choisir une quantité entre 1 et 100.')
            } else {
                let cart = JSON.parse(localStorage.getItem('cart'));
                if (cart == null) cart = [];
                console.log(cart);

                //Create new Item Object to add into cart
                let newItemToAdd = {
                    id: itemId,
                    imgUrl: itemImg,
                    imgTxt: itemAltTxt,
                    price: itemPrice,
                    description: itemDescription,
                    color: itemColor.value,
                    quantity: itemQty.value
                }

                if (localStorage.cart == null) {
                    cart.push(newItemToAdd);
                    alert('Votre article a été ajouté dans le panier.');
                } else if (localStorage.cart.includes(newItemToAdd.id) && localStorage.cart.includes(newItemToAdd.color)) {
                    for (let i = 0; i < cart.length; i++) {
                        if (cart[i].id === newItemToAdd.id && cart[i].color === newItemToAdd.color) {
                            let newQty = Number(itemQty.value) + Number(cart[i].quantity);
                            cart[i].quantity = newQty.toString();
                            alert('Votre article a été ajouté dans le panier.');
                        }
                    }
                } else {
                    cart.push(newItemToAdd);
                    alert('Votre article a été ajouté dans le panier.');
                }
            
                //Save the cart with new item added into
                localStorage.setItem('cart', JSON.stringify(cart));
                this.$router.go();
            }
        }
    }
}

/* CART VIEW */
const Cart = {
    template: '#cart',
    name: 'Cart',
    data() {
        return {
            products: [{
                _id: '',
                imgUrl: '',
                imgTxt: '',
                name: '',
                description: '',
                price: '',
                color: '',
                quantity: ''
            }],
            order: [{
                totalQty: '',
                totalPrice: ''
            }],
            cart: false,
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            email: '',
            validFirstName: '',
            validLastName: '',
            validAddress: '',
            validCity: '',
            validEmail: '',
            firstNameErrorMsg: '',
            lastNameErrorMsg: '',
            addressErrorMsg: '',
            cityErrorMsg: '',
            emailErrorMsg: ''
        }
    },
    created() {
        this.fromShoppingCart();
        this.orderTotalQty();
        this.orderTotalPrice();
    },

    watch: {
        firstName(value) {
            this.firstName = value;
            this.validateFirstName(value);
        },
        lastName(value) {
            this.lastName = value;
            this.validateLastName(value);
        },
        address(value) {
            this.address = value;
            this.validateAddress(value);
        },
        city(value) {
            this.city = value;
            this.validateCity(value);
        },
        email(value) {
            this.email = value;
            this.validateEmail(value);
        },
    },
    methods: {
        fromShoppingCart() {
            let cart = JSON.parse(localStorage.getItem('cart'));
            console.log(cart)
            if (cart == null || cart.length == 0) {
                this.cart = false;
            } else {
                for (let i = 0; i < cart.length; i++) {
                    this.products[i] = cart[i];
                    this.products[i].price = cart[i].price.toFixed(2);
                    this.cart = true;
                }
            }
        },
        orderTotalQty() {
            let cart = JSON.parse(localStorage.getItem('cart'));
            let totalQty = 0;

            if (cart == null || cart.length == 0) {
                this.order.totalQty = 0;
            } else {
                for (let i = 0; i < cart.length; i++) {
                    totalQty += Number(cart[i].quantity);
                }
                this.order.totalQty = totalQty;
            }
        },
        orderTotalPrice() {
            let cart = JSON.parse(localStorage.getItem('cart'));
            let totalPrice = 0;

            if (cart == null || cart.length == 0) {
                this.order.totalPrice = 0;
            } else {
                for (let i = 0; i < cart.length; i++) {
                    let itemTotal = Number(cart[i].quantity) * Number(cart[i].price);
                    totalPrice += itemTotal;
                }
                this.order.totalPrice = totalPrice.toFixed(2);
            }
        },
        deleteItem(index) {
            let cart = JSON.parse(localStorage.getItem('cart'));
            //index helps to select the right delete button
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            this.$router.go();
            
        },
        modifyItemQty(index) {
            let cart = JSON.parse(localStorage.getItem('cart'));
            let itemQtyInput = document.getElementsByClassName('itemQuantity');

            if (itemQtyInput[index].value <= 0) {
                itemQtyInput[index].value = 0;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                this.$router.go();
            } else if (itemQtyInput[index].value >= 100) {
                itemQtyInput[index].value = 100;
                cart[index].quantity = itemQtyInput[index].value;
                localStorage.setItem('cart', JSON.stringify(cart));
                this.$router.go();
            } else {
                cart[index].quantity = itemQtyInput[index].value;
                localStorage.setItem('cart', JSON.stringify(cart));
                this.$router.go();
            }
        },
        validateFirstName(value) {
            const firstNameField = document.querySelector('#firstName')
            if (/^[A-Za-z éèëôöîï-]+$/.test(value)) {
                firstNameField.style.border = 'medium solid rgb(76, 187, 23)';
                this.firstNameErrorMsg = '';
                this.validFirstName = true;
            } else {
                firstNameField.style.border = 'medium solid rgb(253, 45, 1)';
                this.firstNameErrorMsg = 'Veuillez saisir votre prénom.';
                this.validFirstName = false;
            }
        },
        validateLastName(value) {
            const lastNameField = document.querySelector('#lastName')
            if (/^[A-Za-z éèëôöîï\'-]+$/.test(value)) {
                lastNameField.style.border = 'medium solid rgb(76, 187, 23)';
                this.lastNameErrorMsg = '';
                this.validLastName = true;
            } else {
                lastNameField.style.border = 'medium solid rgb(253, 45, 1)';
                this.lastNameErrorMsg = 'Veuillez saisir votre nom.';
                this.validLastName = false;
            }
        },
        validateAddress(value) {
            const addressField = document.querySelector('#address')
            if (/[A-Za-zéèëôîï0-9\'\.\-\s\,]{5}/.test(value)) {
                addressField.style.border = 'medium solid rgb(76, 187, 23)';
                this.addressErrorMsg = '';
                this.validAddress = true;
            } else {
                addressField.style.border = 'medium solid rgb(253, 45, 1)';
                this.addressErrorMsg = 'Veuillez saisir votre adresse.';
                this.validAddress = false;
            }
        },
        validateCity(value) {
            const cityField = document.querySelector('#city')
            if (/[A-Za-zéèëôîï0-9\'\.\-\s\,]{2}/.test(value)) {
                cityField.style.border = 'medium solid rgb(76, 187, 23)';
                this.cityErrorMsg = '';
                this.validCity = true;
            } else {
                cityField.style.border = 'medium solid rgb(253, 45, 1)';
                this.cityErrorMsg = 'Veuillez saisir votre ville.';
                this.validCity = false;
            }
        },
        validateEmail(value) {
            const emailField = document.querySelector('#email')
            if (/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(value)) {
                emailField.style.border = 'medium solid rgb(76, 187, 23)';
                this.emailErrorMsg = '';
                this.validEmail = true;
            } else {
                emailField.style.border = 'medium solid rgb(253, 45, 1)';
                this.emailErrorMsg = 'Veuillez saisir votre email.';
                this.validEmail = false;
            }
        },
        confirmOrder() {
            const products = [];
            const cart = JSON.parse(localStorage.getItem('cart'));
            if (cart != null || cart.length != 0) {
                for (let item of cart) {
                    products.push(item.id);
                }
            }; 
            const contact = {
                firstName: this.firstName,
                lastName: this.lastName,
                address: this.address,
                city: this.city,
                email: this.email
            };

            if (this.validFirstName == true && 
                this.validLastName == true && 
                this.validAddress == true && 
                this.validCity == true &&
                this.validEmail == true) {
                //POST request
                const toSendToApi = {
                    products,
                    contact
                }; 
                console.log(toSendToApi)      
                axios.post('http://localhost:3000/api/products/order', toSendToApi)
                .then(res => {
                    let orderId = res.data.orderId;
                    localStorage.clear();
                    router.push({ path: `/cart/${orderId}` });
                })
                .catch( err => {
                    console.log(err)
                })
            } else {
                alert('Veuillez vérifier que tous les champs sont correctements remplis.')
            }
        }
    }
}

/* CONFIRMATION VIEW */
const Confirmation = {
    template: '#confirmation',
    name: 'Confirmation',
    data () {
        return {
            orderId: ''
        }
    },
    created() {
        this.getOrderId();
    },
    methods: {
        getOrderId() {
            this.orderId = this.$route.params.orderId;
        }
    }
}

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/:_id', name: 'product', component: Product },
    { path: '/cart', name: 'cart', component: Cart },
    { path: '/cart/:orderId', name: 'confirmation', component: Confirmation }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(), //Provide history implementation to use
    routes //short for 'routes: routes'
})

const app = Vue.createApp({});

app.use(router);
app.mount('#app');