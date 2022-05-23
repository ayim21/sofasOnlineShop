/* */
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
                colors: ''
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
                    
                console.log(res.data)
            }).catch(err => console.log(err))
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