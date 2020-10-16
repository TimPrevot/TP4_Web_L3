<template>
  <div>
    
    <form @submit.prevent="addClient">
       <h2>Register</h2> 
       <input type="email" name="" id="" v-model="newClient.email" placeholder="E-mail" required>
       <input type="password" name="" id="" v-model="newClient.password" placeholder="Password" required>
       <button type="submit">Register</button>

       <br>
       <p>If you already have an account <router-link to='/login'>log in</router-link> yourself </p>
        

    </form>

    
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
        newClient: {
             email: '',
        password: ''
        }
       
    }
  },
  async mounted () {
  },
    methods: {
        addClient () {
      this.$emit('add-client', this.newClient)
    },

  }
}
</script>

<style scoped>
</style>