<template>
  <div id="app" :class="`route-${$route.name}`">
    <header role="banner">
      <div class="wrap">
        <router-link to="/">
          <svg width="130" height="26" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 .517v24.808h4.612V15.17h7.661v-4.277H4.612v-6.1h8.033V.517zM13.723 25.325h4.5V.517h-4.5zM24.1 14.055h10.153c-.15-1.09-.688-2.027-1.618-2.808-.93-.781-2.04-1.196-3.328-1.246-1.29.05-2.418.471-3.385 1.265-.967.794-1.575 1.723-1.822 2.789m14.765 1.302c0 .645-.088 1.389-.26 2.231H24.174c.297 1.39.91 2.45 1.84 3.18.93.732 1.966 1.098 3.106 1.098 1.786 0 3.174-.805 4.166-2.418h4.909c-.57 1.885-1.698 3.44-3.385 4.668-1.686 1.228-3.532 1.816-5.54 1.767-2.729.05-5.047-.886-6.956-2.808-1.91-1.922-2.863-4.26-2.863-7.012 0-2.776.954-5.15 2.863-7.122 1.909-1.972 4.215-2.957 6.918-2.957 2.627 0 4.89.961 6.787 2.882 1.898 1.922 2.846 4.086 2.846 6.491"/><path fill="#FFF" d="M43.179 25.325H37.86l6.62-9.596-5.765-9.001H43.7l3.422 5.616 3.385-5.616h4.983l-5.765 9 6.695 9.597H51.1l-3.98-6.36zM56.01 2.971c0-.67.235-1.239.706-1.711.47-.47 1.028-.707 1.674-.707.669 0 1.233.236 1.692.707.458.472.688 1.042.688 1.711 0 .67-.23 1.24-.688 1.712a2.271 2.271 0 0 1-1.692.706c-.646 0-1.204-.235-1.674-.706a2.332 2.332 0 0 1-.707-1.712"/><path fill="#FFF" d="M56.307 25.325h4.463V6.728h-4.463z"/><path fill="#00B3F0" d="M68.464 25.325h-4.5V10.782H61.77V6.728h2.194V.517h4.5v6.21h2.641v4.055h-2.64zM75.717 25.325h-4.463V14.911c-.199-5.852 2.515-8.79 8.145-8.816.123 0 .235.014.334.038v4.314c-2.677.1-4.016 1.575-4.016 4.426v10.452z"/><path d="M83.378 14.055H93.53c-.149-1.09-.688-2.027-1.618-2.808-.93-.781-2.04-1.196-3.328-1.246-1.29.05-2.418.471-3.385 1.265-.967.794-1.575 1.723-1.822 2.789m14.765 1.302c0 .645-.087 1.389-.26 2.231h-14.43c.297 1.39.91 2.45 1.84 3.18.93.732 1.965 1.098 3.106 1.098 1.785 0 3.173-.805 4.165-2.418h4.91c-.57 1.885-1.699 3.44-3.385 4.668-1.686 1.228-3.533 1.816-5.542 1.767-2.727.05-5.046-.886-6.954-2.808-1.91-1.922-2.864-4.26-2.864-7.012 0-2.776.954-5.15 2.864-7.122C83.5 6.97 85.808 5.984 88.51 5.984c2.627 0 4.89.961 6.787 2.882 1.897 1.922 2.845 4.086 2.845 6.491M103.945 25.325h-4.5V.517h4.5v14.952l5.93-8.741h5.153l-6.695 9.112 7.55 9.485h-5.599l-6.34-8.704z" fill="#00B3F0"/><path d="M114.358 19.489h4.128c.422 1.587 1.612 2.38 3.57 2.38 1.117 0 1.867-.178 2.251-.539.384-.359.577-.812.577-1.357 0-.546-.218-.98-.651-1.302-.435-.322-1.792-.694-4.073-1.116-1.636-.545-2.802-1.128-3.496-1.748-1.116-.991-1.673-2.306-1.673-3.942 0-1.612.6-2.976 1.803-4.092 1.203-1.116 2.92-1.674 5.151-1.674 2.207 0 3.893.546 5.058 1.637s1.786 2.443 1.86 4.054h-4.389c-.198-1.066-1.054-1.6-2.566-1.6-.992 0-1.649.15-1.971.447-.322.298-.484.67-.484 1.116 0 .744.88 1.314 2.642 1.71l2.082.41c1.661.546 2.802 1.079 3.422 1.6 1.165.992 1.748 2.318 1.748 3.98 0 1.785-.664 3.316-1.99 4.593-1.327 1.277-3.099 1.564-5.486 1.544-1.876-.016-3.638-.144-4.716-.808-1.108-.682-1.717-1.63-2.053-2.28-.382-.74-.62-1.748-.744-3.013" fill="#00B3F0"/></g></svg>
        </router-link>
        <button
          v-if="token"
          type="button"
          class="button"
          @click="logout"
        >Logout</button>
        <button
          v-if="token"
          type="button"
          :class="{
            button: true,
            publish: true,
            publishing,
            published
          }"
          @click="publish"
        >Publish</button>
      </div>
    </header>
    <div class="container">
      <main-nav v-if="token" />
      <div v-else />
      <main class="main">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script>
import MainNav from '@/components/MainNav'
export default {
  components: {
    MainNav
  },

  data () {
    return {
      token: !!localStorage.getItem('flexitreks_jwt'),
      publishing: false,
      published: false
    }
  },

  mounted () {
    if (!this.token) return
    this.$store.dispatch('getDestinations')
    this.$store.dispatch('getRegions')
    this.$store.dispatch('getOperators')
    this.$store.dispatch('getHotels')
    this.$store.dispatch('getRestaurants')
    this.$store.dispatch('getTours')
  },

  methods: {
    logout () {
      localStorage.removeItem('flexitreks_jwt')
      window.location.href = '/login/'
    },

    async publish () {
      if (this.publishing || this.published) return

      this.publishing = true
      try {
        await fetch('https://api.netlify.com/build_hooks/5b84f893c9659217e7643ca1', { method: 'post' })
        this.publishing = false
        this.published = true
        setTimeout(() => {
          this.published = false
        }, 2000)
      } catch (e) {
        this.publishing = false
        this.published = false
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/settings.scss';
@import './assets/scss/form.scss';
@import './assets/scss/definition-list.scss';

html,
body {
  padding: 0;
  margin: 0;
  min-height: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $copy;
  font: 400 14px /1.4 'Montserrat', Helvetica, Arial, sans-serif;
}

.container {
  min-height: calc(100vh - 80px);
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 1fr 3fr;
    max-width: 1400px;
  }

  @media (min-width: 1000px) {
    display: grid;
    grid-template-columns: 210px 1fr;
  }
}

#app {
  background: #FFF;
  display: grid;
  grid-template-rows: 80px 1fr;
  grid-template-columns: 1fr;
  min-height: 100vh;
  width: 100%;

  @media (min-width: 600px) {
    background: #edf4f6;
    background: linear-gradient(to right, #edf4f6 0%,#edf4f6 50%,#ffffff 51%,#ffffff 100%);
  }
}

[role="banner"] {
  background: #003150;
  padding: 26px 0 0;
  grid-column: span 2;
  grid-row: span 1;

  button {
    float: right;
    margin: 0 0 0 10px;
    padding: 8px 15px;
    font-size: 0.8em;
  }

  .publishing {
    cursor: progress;
    opacity: 0.2;
    transition: 300ms opacity;
  }

  .publish {
    transition: 300ms;
  }

  .published {
    background: $orange;
    cursor: auto;
  }
}

.main {
  @media (min-width: 600px) {
    background: #FFF;
    padding: 35px 0 35px 35px;
  }
}

.wrap {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.clear:before,
.clear:after {
  content: '';
  display: table;
  clear: both;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}

p {
  margin: 0 0 30px;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

hr {
  border: none;
  margin: 30px 0;
  border-bottom: 1px solid $line;
}

h1 {
  margin: 0;
  font-size: 1.3em;
  color: $dark;
}

h2 {
  font-size: 1.2em;
  margin: 0 0 30px;
}

h3 {
  font-size: 1.1em;
  margin: 0 0 30px;
}

@media screen and (min-width: 500px) {
  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.3em;
  }

  h3 {
    font-size: 1.2em;
  }
}

@media screen and (min-width: 800px) {
  h1 {
    font-size: 2.2em;
  }
}

.toasted-container.top-right {
  top: 80px;
  right: 10px;

  @media screen and (min-width: 800px) {
    top: 10px;
    right: 20px;
  }
}

table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

th,
td {
  background: #FFF;
  padding: 15px;
  border-left: 1px solid $line;

  &:first-child {
    border-left: none;
  }
}

thead th {
  background: $line;
  border-color: darken($line, 10%);
}

tbody tr:nth-child(even) td {
  background: $light;
}

.header {
  border-bottom: 1px solid $line;
  margin-bottom: 30px;
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  h1 {
    margin-right: auto;
  }
}

.page-nav {
  border-bottom: 1px solid $line;
  margin-bottom: 30px;
  padding-bottom: 30px;
  color: $dark;
  font: italic 14px 'Libre Baskeville', serif;

  a {
    margin-right: 25px;
  }

  .router-link-exact-active {
    color: $light-blue;
  }

  @media (min-width: 600px) {
    padding-top: 26px;
  }
}
</style>
