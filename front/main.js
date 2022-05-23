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
        this.displayInfo();
    },
    methods: {
        displayInfo() {
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
    name: 'Product'
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