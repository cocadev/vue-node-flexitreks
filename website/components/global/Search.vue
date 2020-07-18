<template>
  <form
    :class="{
      'search-inputs': true,
    }"
    autocomplete="off"
    @submit.prevent
  >
    <label
      for="search"
      class="screen-reader-only"
    >Where would you like to go?</label>
    <input
      id="search"
      :value="term"
      :class="{ open }"
      :placeholder="$route.name === 'index' ? example : 'Where would you like to go?'"
      type="search"
      name="search"
      autocomplete="off"
      @input="input"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="routeSelected"
      @keydown.esc="!term && close()"
      @focus="focus"
      @blur="blur"
    >

    <div
      v-show="open"
      class="results"
    >
      <h4 v-show="!term">Popular searches&hellip;</h4>
      <ul>
        <li v-if="term && fetched && !results.length">
          Unfortunately, there were no results for your search. <nuxt-link :to="{ name: 'destinations' }"><u>Explore our destinations</u></nuxt-link>
        </li>
        <li
          v-for="(result, idx) in results"
          :key="idx"
          :class="{
            selected: selected === result.slug
          }"
          style="color: #333"
          @mousedown="route(result)"
          @click="route(result)"
          @mouseover="select(result)"
        >
          <svg
            v-if="result.type !== 'tour'"
            width="10"
            height="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              :fill="selected === result.slug ? '#F88F2B' : '#B8C5CA'"
              d="M5 14C1.667 9.84 0 6.84 0 5a5 5 0 1 1 10 0c0 1.84-1.667 4.84-5 9zm0-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              fill-rule="evenodd"
            />
          </svg>
          <svg
            v-if="result.type === 'tour'"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              :fill="selected === result.slug ? '#F88F2B' : '#B8C5CA'"
              d="M15.23 4.77l-.77.8H9.74V2.43h4.72l.77.8L16 4l-.77.77zM.77 3.23l.77-.8h4.72v3.14H1.54l-.77-.8L0 4l.77-.77zM8.18 0c.48 0 .86.23.86.5v14.8H7.3V.5c0-.27.4-.5.88-.5zm6.28 6.26l.77.8.77.77-.77.77-.77.8H9.74V6.25h4.72z"
              fill-rule="nonzero"
            />
          </svg>
          {{ result.name }}
        </li>
      </ul>
    </div>

  </form>
</template>

<script>
export default {
  data () {
    return {
      selected: '',
      open: false,
      example: '',
      fetched: false
    }
  },

  computed: {
    results () {
      return this.$store.getters.search_results
    },

    term () {
      return this.$store.state.search_term
    }
  },

  mounted () {
    if (this.$route.name === 'index') this.$store.commit('changeSearch', '')
    const examples = [ 'Italy', 'Spain', 'Lake Constance' ]
    this.example = 'Try "' + (examples[Math.floor(Math.random() * Math.floor(examples.length))]) + '"'
  },

  methods: {
    focus () {
      this.open = true
      if (!this.fetched) {
        this.$store.dispatch('getRecords')
        this.fetched = true
      }
    },

    blur () {
      this.close()
    },

    change (direction) {
      if (!this.results.length) {
        this.selected = ''
        return
      }

      if (!this.selected) {
        this.selected = this.results[0].slug
        return
      }

      const currentIndex = this.results.findIndex(r => r.slug === this.selected)
      if (currentIndex === -1) {
        this.selected = ''
        return
      }

      let newIndex = currentIndex + direction
      if (newIndex < 0) newIndex = this.results.length - 1
      const next = this.results[newIndex]
      if (!next) {
        this.selected = this.results[0].slug
        return
      }

      this.selected = next.slug
    },

    down () {
      this.change(1)
    },

    up () {
      this.change(-1)
    },

    close () {
      setTimeout(() => this.open = false, 100)
    },

    select(result) {
      this.selected = result.slug
    },

    input (e) {
      this.$store.commit('changeSearch', e.target.value)
      if (!this.open && e.target.value) this.open = true
      this.selected = ''
    },

    routeSelected () {
      this.route(this.results.find(r => r.slug === this.selected))
    },

    route (result) {
      if (!result && !this.results.length) return
      if (!result && this.results.length) result = this.results[0]

      this.open = false
      const routes = { 'tour': 'tours-slug', 'region': 'regions-slug', 'destination': 'destinations-slug' }
      this.$store.commit('changeSearch', result.name)
      this.$router.push({
        name: routes[result.type],
        params: {
          slug: result.slug
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';
form {
  position: relative;
}

.results {
  position: absolute;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  background: #FFF;
  z-index: 400;
  padding: 10px;
  width: 100%;
  left: 0;
  top: 100%;
  cursor: pointer;
  font-size: 14px;
  padding: 15px 0 5px;
  border-top: 1px dashed #C2CDD1;
  max-height: 50vh;
  overflow: scroll;

  @include mq(40em) {
    padding: 15px;
  }
}

.results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

input {
  background-image: url('~/assets/images/search.svg');
  background-repeat: no-repeat;
  background-position: 13px 50%;
  background-size: auto 45%;
  padding-left: 42px;
  font-weight: 300;

  &.open {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.search-inputs--home input {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  padding: 15px 15px 15px 45px;
  border-radius: 5px;

  @include mq(30em) {
    padding: 21px 20px 21px 60px;
    font-size: 18px;
  }

  &.open {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  &::-webkit-input-placeholder {
    font-size: 1em;
  }
  &::-moz-placeholder {
    font-size: 1em;
  }
  &:-ms-input-placeholder {
    font-size: 1em;
  }
  &:-moz-placeholder {
    font-size: 1em;
  }
}

.results li {
  padding: 13px 10px 12px 43px;
  position: relative;
}

.results svg {
  position: absolute;
  left: 20px;
  top: 15px;

  &[width="10"] {
    left: 23px;
  }
}

h4 {
  padding-left: 20px;
}

.selected {
  background-color: #EDF4F6;
}
</style>
