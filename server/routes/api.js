const express = require('express')
const router = express.Router()
const articles = require('../data/articles.js')

const bcrypt = require('bcrypt')
const { Client } = require('pg')
const { request } = require('express')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'q7ux',
  database: 'TP5'
})

client.connect()

class Panier {
  constructor() {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.articles = []
  }
}


// TP5

// LOGIN IMPLEMENTATION

router.post('/register',async (req, res) => {
  const password = req.body.password
  const email = req.body.email
// SELECT email FROM users u WHERE u.email = email;
  const hash = await bcrypt.hash(password, 10)
  const result = await client.query({
    text: "SELECT email FROM users WHERE email = $1;",
    values: [email]
}).catch((error) => {
  const result = [null]
  console.log({message:"Free"})

})



  if ( result.rows != '' ) {
      res.status(400).json({ message: 'Email deja present' })
      return
  } else {

      
          const sql = "INSERT INTO users(email,password) VALUES($1,$2);"
           await client.query({
              text: sql,
              values: [email, hash] // ici name et description ne sont pas concaténées à notre requête
          }).catch((error)=>{
            console.log({message:"Problème"})
          })

  }

  res.json('done')
  



})

// LOGIN

router.post('/login',async (req, res) => {
const password = req.body.password
const email = req.body.email

const result = await client.query({
    text: "SELECT email , password FROM users WHERE email = $1 ;",
    values: [email]
  }).catch((error) => {
const result = [null]
console.log({message:"Libre"})

})

//console.log(result.rows[0].email)


if ( result.rows[0].email !== email && !(await bcrypt.compare(password,result.rows[0].password))) {

    
    res.status(400).json({ message: 'l Email ou le mot de passe n est pas correct ' })
    return
}else if (req.session.userID !== undefined){
  res.status(401).json({ message: 'Already Connected' })
}
 else {
  
        const sql = "SELECT id FROM users WHERE email = $1 ;"
        req.session.userID = await client.query({
            text: sql,
            values: [email] // ici name et description ne sont pas concaténées à notre requête
        }).catch((error)=>{
          console.log({message:"Probleme"})
        })

        //console.log(req.session.userID.rows[0].id)


}

res.json('done')




})

router.get('/me', (req, res) => {

if(req.session.userID){
  console.log(req.session.userID.rows[0].id)
  res.json(req.session.userID)
}else{
  res.status(401).json({ message: 'Non connecté' })
}

})


//FIN TP5


/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (request, response) => {
  response.json(request.session.panier)
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (request, response) => {
  const articleId = parseInt(request.body.id)
  const articleQuantity = parseInt(request.body.quantity)
  const articleExists = articles.find(article => article.id === articleId) !== undefined
  const quantityIsPositive = articleQuantity > 0
  const articleIsAlreadyInCart = request.session.panier.articles.find(article => article.id === articleId) !== undefined

  if (articleExists && quantityIsPositive && !articleIsAlreadyInCart) {
    request.session.panier.articles.push(articles.find(article => article.id === articleId))
    response.json({
      id: articleId,
      quantity: articleQuantity
    })
  } else {
    response.status(400).json({ message: 'Invalid parameters' })
  }
})

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay',  (request, response) => {
  if (){

  }
  
  const firstName = request.body.firstname;
  const lastName = request.body.lastname;

  request.session.destroy();

  response.json({ message: `Merci ${firstName} ${lastName} pour votre achat`});
});

/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', parseArticle, (request, response) => {
  const articleQuantity = parseInt(request.body.quantity)
  
  const articleInCart = request.session.panier.articles.find(article => article.id === request.articleId)

  if (articleInCart === undefined || articleQuantity < 1){
    response.status(400).json({ message : 'Invalid parameters' })
  } else {
    articleInCart.quantity = articleQuantity
    response.json(request.session.panier)
  }
})



/*


 * Cette route doit supprimer un article dans le panier
 */
router.delete('/panier/:articleId', (request, response) => {
  const articleInCart = request.session.panier.articles.find(article => article.id === articleId)

  if (articleInCart === undefined){
    response.status(400).json({ message: 'Invalid parameters' })
  } else {
    const indexToDelete = request.session.panier.articles.findIndex(article => article.id === request.articleId)
    request.session.panier.splice(indexToDelete, 1)
    response.json(request.session.panier)
  }
})


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/articles', (req, res) => {
  res.json(articles)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const image = req.body.image
  const price = parseInt(req.body.price)

  // vérification de la validité des données d'entrée
  if (typeof name !== 'string' || name === '' ||
    typeof description !== 'string' || description === '' ||
    typeof image !== 'string' || image === '' ||
    isNaN(price) || price <= 0) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  const article = {
    id: articles.length + 1,
    name: name,
    description: description,
    image: image,
    price: price
  }
  articles.push(article)
  // on envoie l'article ajouté à l'utilisateur
  res.json(article)
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
function parseArticle(req, res, next) {
  const articleId = parseInt(req.params.articleId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.articleId = articleId

  const article = articles.find(a => a.id === req.articleId)
  if (!article) {
    res.status(404).json({ message: 'article ' + articleId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.article = article
  next()
}

router.route('/article/:articleId')
  /**
   * Cette route envoie un article particulier
   */
  .get(parseArticle, (req, res) => {
    // req.article existe grâce au middleware parseArticle
    res.json(req.article)
  })

  /**
   * Cette route modifie un article.
   * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
   * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
   *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
   */
  .put(parseArticle, (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const price = parseInt(req.body.price)

    req.article.name = name
    req.article.description = description
    req.article.image = image
    req.article.price = price
    res.send()
  })

  .delete(parseArticle, (req, res) => {
    const index = articles.findIndex(a => a.id === req.articleId)

    articles.splice(index, 1) // remove the article from the array
    res.send()
  })

module.exports = router
