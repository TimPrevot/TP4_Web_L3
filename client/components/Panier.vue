<template>
  <div>
    <h2>Mon Panier</h2>
    <!-- TODO -->
    <article v-for="article in panier.articles" :key="article.id">
      <div class="articleImage">
        <div :style="{ backgroundImage: 'url(' + articles[article.id - 1].image + ')' }"></div>
      </div>
      <div class="articleContent">
        <div class="articleTitle">
          <h2>{{ articles[article.id - 1].name }} - {{ articles[article.id - 1].price }}</h2>
        </div>
        <p>{{ articles[article.id - 1].description }}</p>
      </div>
      <div>
        <button @click="addOne(article.id)">+</button>
        {{ article.quantity }}
        <button @click="removeOne(article.id)">-</button>
      </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object }
  },
  data () {
    return {
    }
  },
  async mounted () {
  },
  methods: {
    addOne (articleId) {
      this.$emit('add-one', articleId)
    },
    removeOne (articleId) {
      this.$emit('remove-one', articleId)
    }
  }
}
</script>

<style scoped>
</style>
