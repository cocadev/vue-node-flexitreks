<template>
  <div class="layout--default">
    <div class="wrap wrap--mid pad-top pad-bottom">
      <h4>404 error</h4>
      <h1>Sorry!</h1>
      <p>We can’t seem to find the page your looking for.</p>
      <p><small>Go back to <nuxt-link to="/"><u>flexitreks.com</u></nuxt-link> or visit our <nuxt-link :to="{ name: 'destinations' }"><u>destinations</u></nuxt-link>.</small></p>
      <br><br>
      <animated-bike />
    </div>
  </div>
</template>

<script>
import FHeader from '../components/global/Header';
import FFooter from '../components/global/Footer';
import AnimatedBike from '../components/global/AnimatedBike'

export default {
  components: {
    FHeader,
    FFooter,
    AnimatedBike
  },

  head () {
    return {
      title: 'Page not found'
    }
  }
}
</script>
