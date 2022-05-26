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
                        this.item.colors[i] = res.data.colors[i]
                        //console.log(res.data.colors[i])
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
                //router.push({ path: `/${itemId}`, force: true })
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
            cart: false
        }
    },
    created() {
        this.fromShoppingCart();
        this.orderTotalQty();
        this.orderTotalPrice();
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
            for (let i = 0; i < cart.length; i++) {
                totalQty += Number(cart[i].quantity);
            }
            console.log(totalQty)
            this.order.totalQty = totalQty;
        },
        orderTotalPrice() {
            let cart = JSON.parse(localStorage.getItem('cart'));
            let totalPrice = 0;
            for (let i = 0; i < cart.length; i++) {
                let itemTotal = Number(cart[i].quantity) * Number(cart[i].price);
                console.log(itemTotal)
                totalPrice += itemTotal;
            }
            console.log(totalPrice)
            this.order.totalPrice = totalPrice.toFixed(2);
        },
        deleteItem(index) {
            let cart = JSON.parse(localStorage.getItem('cart'));
            //index helps to select the right delete button
            console.log(index)
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            this.$router.go();
            
        },
        modifyItemQty(index) {
            let cart = JSON.parse(localStorage.getItem('cart'));
            console.log(index);
            let itemQtyInput = document.getElementsByClassName('itemQuantity');
            console.log(itemQtyInput[index].value)
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
        }
    }
}

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/:_id', name: 'product', component: Product },
    { path: '/cart', name: 'cart', component: Cart }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(), //Provide history implementation to use
    routes //short for 'routes: routes'
})

const app = Vue.createApp({});

app.use(router);
app.mount('#app');