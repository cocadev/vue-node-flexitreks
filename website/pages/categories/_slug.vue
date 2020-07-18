<template>
  <div>
    <h3
      v-show="name && (gallery && gallery.length || heroImg)"
      class="title"
    >
      <span v-show="!showingSearchResults()"> {{ name }}</span>
      <span v-show="showingSearchResults()">Your search results</span>
    </h3>
    <f-hero-slider
      :options="{
        duration: 500,
        loop: true,
        perPage: {
          500 : Math.min(gallery ? gallery.length : 2, 1),
        },
        count: ( gallery ? gallery.length : 0 ) + (heroImg ? 1 : 0)
      }"
    >
      <f-hero
        v-if="heroImg && heroImg.url"
        :image="heroImg && heroImg.url"
        gradient="part"
      />
      <f-hero
        v-for="(feature, i) in gallery_details"
        :key="i"
        :image="feature.url"
        gradient="part"
      />
    </f-hero-slider>

    <div class="description">
      <div class="wrap">
        <div class="breadcrumbs">
          <nuxt-link
            class="orange-link orange-link--arrow orange-link--large"
            style="font-size: 13px"
            to="/"
          >
            Home
          </nuxt-link>

          <nuxt-link
            class="orange-link orange-link--arrow orange-link--large"
            style="font-size: 13px"
            to="/categories"
          >
            Categories
          </nuxt-link>
          <a style="color: #003150">
            <span v-show="!showingSearchResults()"> {{ name }}</span>
            <span v-show="showingSearchResults()">Your search results</span>
          </a>
        </div>
        <div>
          <div
            v-show="!showingSearchResults()"
            class="header"
          >
            {{ name }}
          </div>

          <div
            v-show="showingSearchResults()"
            class="header"
          >
            Search results
          </div>

          <div
            v-show="!showingSearchResults()"
            class="html"
            v-html="description"
          />
        </div>
      </div>
    </div>

    <f-filters/>
    <div class="wrap">
      <TourList :tours="tours" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  h1 {
    margin: 0;
    padding: 15px 20px;
    font-size: 14px;

    @media (min-width: 768px) {
      display: none;
    }
  }
</style>

<script>
import TourList from '@/components/tours/TourList.vue';
import FFilters from '@/components/global/Filters';
import FHero from '@/components/global/Hero';
import FHeroSlider from '@/components/global/HeroSlider';

export default {
  async asyncData({ params, store }) {
    await store.dispatch('getToursForCategory')
  },

  components: {
    TourList,
    FFilters,
    FHero,
    FHeroSlider
  },

  data () {
    return {
      gallery: [],
      gallery_details: [],
      heroImg: null,
      description: null,
      name: null,
      myContries: [],
      defaultFilters: '',
      hasChangedFilters: false,
      loadedFilters: false
    }
  },

  computed: {
    tours () {
      return this.$store.getters.currentTours
    }
  },

  beforeRouteUpdate (to, from, next) {
    next()
  },

  async mounted () {

    try {
      const { data } = await this.$axios.get(`categories/${this.$route.params.slug}`)
      this.gallery = data.gallery
      this.gallery_details = data.gallery_details
      this.heroImg = data.image
      this.name = data.name
      this.description = data.description
      if (data.filter_id === 'bike') this.$store.commit('changeFilter', { type: 'bike_and_boat', value: 'hotel' })
      if (data.filter_id === 'bike_boat') this.$store.commit('changeFilter', { type: 'bike_and_boat', value: 'boat' })

      if (data.filter_id === 'self_guided') this.$store.commit('changeFilter', { type: 'guidance', value: 'self-guided' })
      if (data.filter_id === 'guided') this.$store.commit('changeFilter', { type: 'guidance', value: 'guided' })

      if (data.filter_id === '1_4_nights') this.$store.commit('changeFilter', { type: 'nights', value: '1-4' })
      if (data.filter_id === '5_8_nights') this.$store.commit('changeFilter', { type: 'nights', value: '5-8' })
      if (data.filter_id === '9_14_nights') this.$store.commit('changeFilter', { type: 'nights', value: '9-14' })

      if (data.filter_id === 'easy') this.$store.commit('changeFilter', { type: 'difficulty', value: 'Easy' })
      if (data.filter_id === 'leisurely') this.$store.commit('changeFilter', { type: 'difficulty', value: 'Leisurely' })
      if (data.filter_id === 'moderate') this.$store.commit('changeFilter', { type: 'difficulty', value: 'Moderate' })
      if (data.filter_id === 'challenging') this.$store.commit('changeFilter', { type: 'difficulty', value: 'Challenging' })
      if (data.filter_id === 'offers') this.$store.commit('changeFilter', { type: 'offers', value: 'true' })
    } catch(e) {
      this.gallery = []
    }
    this.$store.commit('changeFilter', { type: 'countries', value: this.$store.state.global.destinations.map(i=>i.name).slice(0) });
    this.defaultFilters = JSON.stringify(this.$store.state.filters)
    this.loadedFilters = true
  },

  head () {
    const title = this.title || 'Category'
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  },

  methods: {
    showingSearchResults () {
      if (! this.loadedFilters) {
        return this.hasChangedFilters
      }
      let currentFilters = JSON.stringify(this.$store.state.filters)
      if (currentFilters !== this.defaultFilters) {
        this.hasChangedFilters = true
      }
      return this.hasChangedFilters
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.title {
  color: white;
  font-size: 52px;
  font-weight: 600;
  text-shadow: 2px 2px 2px #333;
  text-align: center;
  align-self: center;
  position: absolute;
  z-index: 10;
  margin-top: 100px;
  width: 100%;
}
.description {
  background: #fff;
}
.header {
  color: #003150;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}
.html {
  color: #52869B;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 16px;
}
.breadcrumbs {
  margin-top: 23px;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  font-size: 13px;
}
.orange-link {
  margin-right: 25px;
}
.orange-link::before {
  margin: -1px;
  margin-left: -3px;
}
@media (max-width: 900px) {
  .title {
    font-size: 42px;
    margin-top: 50px;
  }
}

@media (max-width: 750px) {
  .title {
    font-size: 22px;
    margin-top: 30px;
  }
}

@media (max-width: 450px) {
  .title {
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
