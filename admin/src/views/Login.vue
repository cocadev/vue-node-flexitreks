<template>
  <div class="wrap wrap--thin">
    <div class="header">
      <h1>Login</h1>
    </div>
    <h3
      v-if="error"
      class="error"
    >{{ error }}</h3>
    <form @submit.prevent="login">
      <p>
        <label for="email_address">Email</label>
        <input type="email" id="email_address" name="email_address" required />
      </p>

      <p>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required />
      </p>

      <input type="submit" class="button button--blue" value="Login" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',

  data () {
    return {
      error: ''
    }
  },

  methods: {
    login (event) {
      const email_address = event.target.email_address.value
      const password = event.target.password.value
      if (!email_address || !password) {
        this.error = 'Please fill in both fields'
        return
      }

      this.error = ''

      this.axios.post('auth/login', {
        email_address,
        password
      })
        .then(res => {
          localStorage.setItem('flexitreks_jwt', res.data.token)
          window.location.href = '/'
        })
        .catch(e => {
          this.error = 'There was a problem logging you in'
          event.target.password.value = ''
        })
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  @media (min-width: 40em) {
    display: grid;
    grid-template-columns: 1fr 1fr 100px;
    grid-gap: 30px;
    align-items: end;

    p,
    p input {
      margin: 0;
    }

    [type="submit"] {
      padding: 14px 10px;
    }
  }
}
</style>
