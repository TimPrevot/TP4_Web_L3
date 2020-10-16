const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/panier', component: Panier },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    articles: [],
    panier: {
      createdAt: null,
      updatedAt: null,
      articles: []
    }
  },
  async mounted () {
    const res = await axios.get('/api/articles')
    this.articles = res.data
    const res2 = await axios.get('/api/panier')
    this.panier = res2.data
  },
  methods: {
    async addToPanier (articleId) {
      var parameters = {
        id: articleId,
        quantity: 1
      }
      const response = await axios.post('/api/panier', parameters) 
      this.panier.articles.push(response.data)
    },
    async removeFromPanier (articleId) {
      const response = await axios.delete('/api/panier' + articleId)
      const index = this.panier.articles.findIndex(article => article.id === articleId)
      this.panier.articles.splice(index, 1)
    },
    async addArticle (article) {
      const res = await axios.post('/api/article', article)
      this.articles.push(res.data)
    },
    async addOne (articleId) {
      const index = this.panier.articles.findIndex(a => a.id === articleId)
      const quantity = this.panier.articles[index].quantity + 1
      const response = await axios.put('/api/panier/' + articleId, { quantity })
      this.panier.articles[index].quantity = quantity
    },
    async removeOne (articleId) {
      const index = this.panier.articles.findIndex(a => a.id === articleId)
      const quantity = this.panier.articles[index].quantity - 1
      if (!quantity){
        this.removeFromPanier(articleId)
        return
      }
      const response = await axios.put('/api/panier/' + articleId, { quantity })
      this.panier.articles[index].quantity = quantity
    },
    async updateArticle (newArticle) {
      await axios.put('/api/article/' + newArticle.id, newArticle)
      const article = this.articles.find(article => article.id === newArticle.id)
      article.name = newArticle.name
      article.description = newArticle.description
      article.image = newArticle.image
      article.price = newArticle.price
    },
    async deleteArticle (articleId) {
      await axios.delete('/api/article/' + articleId)
      const index = this.articles.findIndex(a => a.id === articleId)
      this.articles.splice(index, 1)
    },

    async addClient (client) {
      const res3 = await axios.post('/api/register', client)
      this.connectClient(client)
    },
    async connectClient (client) {
      const res3 = await axios.post('/api/login', client)
      this.client = res3.data
    },
    isUserConnected () {
      const res4 = await axios.get('/me')
      if (!res4){
        return 0
      } else {
        return 1
      }
    }
  }
})
