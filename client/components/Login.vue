<template>
  <div>
    
    <form @submit.prevent="connectClient">
       <h2>Log in</h2> 
       <input type="email" name="" id="" v-model="currentClient.email" placeholder="E-mail" required>
       <input type="password" name="" id="" v-model="currentClient.password" placeholder="Password" required>
       <button type="submit">Log in</button>

       <br>
       <p>If you don't have an account <router-link to='/register'>register</router-link> yourself </p>

    </form>


    
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object },
  },
  data () {
    return {
        currentClient: {
             email: '',
        password: ''
        }
       
    }
  },
  async mounted () {
  },
    methods: {
        connectClient () {
      this.$emit('connect-client', this.currentClient)
    },

  }
}
</script>

<style scoped>
</style>