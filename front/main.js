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

/*PRODUCT VEW */
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
            const productId = this.$route.params._id;
            let itemColorSelected = document.querySelector('#colors');
            let itemQtySelected = document.querySelector('#quantity');

            if (itemColorSelected.value == '') {
                alert('Veuillez choisir une couleur.')
            } else if (itemQtySelected.value == 0) {
                alert('Veuillez choisir une quantité entre 1 et 100.')
            } else {
                let cart = JSON.parse(localStorage.getItem('cart'));
                if (cart == null) cart = [];
                console.log(cart);

                //Create new Item Object to add into cart
                let newItemToAdd = {
                    id: productId,
                    color: itemColorSelected.value,
                    quantity: itemQtySelected.value
                }

                if (localStorage.cart == null) {
                    cart.push(newItemToAdd);
                    alert('Votre article a été ajouté dans le panier.');
                } else if (localStorage.cart.includes(newItemToAdd.id) && localStorage.cart.includes(newItemToAdd.color)) {
                    for (let i = 0; i < cart.length; i++) {
                        if (cart[i].id === newItemToAdd.id && cart[i].color === newItemToAdd.color) {
                            let newQty = Number(itemQtySelected.value) + Number(cart[i].quantity);
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
                router.push({ path: `/${productId}`, force: true })
            }
        }
    }
}

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/:_id', name: 'product', component: Product }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(), //Provide history implementation to use
    routes //short for 'routes: routes'
})

const app = Vue.createApp({});

app.use(router);
app.mount('#app');