<template>
  <div class="wrap shortlist-container">
    <no-ssr>
      <div v-if="shortlist === null">
        <header class="header center wrap pad-top pad-bottom">
          <h4>Shortlist</h4>
          <h1>Loading...</h1>
        </header>
      </div>
      <div v-else-if="!shortlist.length">
        <header class="header center wrap pad-top pad-bottom">
          <h1>No tours shortlisted</h1>
          <p>To add tours to your shortlist, look for the heart symbol on the tours page</p>
          <nuxt-link
            :to="{ name: 'destinations' }"
            class="orange-link"
          >Need some inspiration?</nuxt-link>
        </header>
      </div>
      <div v-else>
        <header class="shortlist-header clear">
          <h4>You have {{ shortlistTours.length }} tour{{ shortlistTours.length === 1 ? '' : 's' }} shortlisted</h4>
          <nuxt-link
            v-if="back"
            :to="back.fullPath"
            class="button button--back"
          >{{ back_label }}</nuxt-link>

          <a
            :href="shortlistEmail"
            target="_blank"
            class="button button--translucent button--large button--image"
          ><img
            src="~/assets/images/envelope.svg"
            alt=""
          ><span> Send to a friend</span></a>
        </header>
        <TourList :tours="shortlistTours" />
      </div>
      <div slot="placeholder">
        <header class="header center wrap pad-top pad-bottom">
          <h4>Shortlist</h4>
          <h1>Loading...</h1>
        </header>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import TourList from '@/components/tours/TourList.vue';
export default {
  components: {
    TourList
  },

  data () {
    return {
      back: { name: '', fullPath: '/' }
    }
  },

  computed: {
    shortlist () {
      return this.$store.state.shortlist
    },

    shortlistTours () {
      return this.$store.getters.shortlistTours
    },

    back_label () {
      if (!this.back) return 'Back'
      const routes = {
        'tours-slug': 'Back to tour',
        'destinations-slug': 'Back to search',
        'regions-slug': 'Back to search',
      }
      return routes[this.back.name] || 'Back'
    },

    shortlistEmail () {
      const n = ['a', 'two', 'three', 'four']
      let link = 'mailto:?subject=Holiday shortlist | Flexitreks&body='

      link += 'Hello!%0D%0A%0D%0AHere\'s ' + (n[this.shortlist.length] || 'a few') + ' holiday' + (this.shortlist.length  === 1 ? '' : 's') + ' I found on flexitreks.com. Click the link below to find out more!%0D%0A%0D%0A';
      
      link += 'https://www.flexitreks.com/shortlist?tours=' + this.shortlist.join(',')
      return link
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from && from.name) vm.back = from
    })
  },

  mounted () {
    setTimeout(() => {
      if (this.$route.query.tours) {
        this.$store.commit('updateShortlist', this.$route.query.tours.split(',').map(String).slice(0, 10))
        this.$store.dispatch('getShortlistTours')
      } else {
        this.$store.dispatch('getShortlistTours')
      }
    }, 100)
  },

  head () {
    const title = 'Shortlist'
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';

.shortlist-container {
  min-height: calc(100vh - 535px);
}

.shortlist-header {
  padding: 30px 0 17px;

  h4 {
    margin: -4px 0 21px;
  }

  .button--image {
    float: right;
    margin: -4px 0 0;

    @include mq(500px, true) {
      padding: 8px 10px 8px;
      margin: 0;

      img {
        margin: 0;
      }

      span {
        display: none;
      }
    }
  }
}
</style>
