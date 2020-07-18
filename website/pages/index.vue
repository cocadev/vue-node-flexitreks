<template>
  <div class="home">
    <f-hero
      :image="page.banner_id ? page.banner.url : '/temp-hero.jpg'"
      gradient="part"
    >
      <div class="hero__content">
        <div class="wrap">
          <home-filter />
        </div>
      </div>
    </f-hero>
    <div class="home-bg">
      <div class="wrap">
        <div class="home-primary clear">
          <main>
            <div v-html="page.content" />
          </main>
          <div class="featured">
            <tour-simple-preview
              v-if="inspiration"
              :tour="{
                slug: inspiration.slug,
                name: inspiration.name,
                image: inspiration.image,
                destinations: [
                  {
                    name: inspiration.subtitle
                  }
                ]
              }"
              :route-name="inspiration.type"
              size="large"
            />
          </div>
        </div>

        <f-information-box
          v-show="page.ksp_content"
          :page="{
            title: page.title,
            ksp_content: page.ksp_content,
            ksp_button_title: page.ksp_button_title,
            ksp_bg_hex: page.ksp_bg_hex,
            ksp_button_url: page.ksp_button_url,
            subtitle: page.subtitle
        }"/>

        <div
          v-show="!page.ksp_content"
          style="margin-top: -400px"
        />

        <nav
          v-if="collections && collections.items.length"
          class="featured-slider"
        >
          <p style="color: #00A8EC; font-size: 18px; font-weight: 400; font-family: Libre Baskerville, serif; margin-left: 10px"><i>Flexitreks collections</i></p>
          <h2 style="margin-left: 10px">{{ collections.title }}</h2>
          <div
            class="slider-view"
            v-html="collections.content"
          />

          <f-slider
            :options="{
              duration: 500,
              loop: true,
              perPage: {
                500 : Math.min(collections.items.length, 1),
                800 : Math.min(collections.items.length, 2),
                1000: Math.min(collections.items.length, 3)
              }
            }"
          >
            <homepage-collection
              v-for="(feature, i) in collections.items"
              :key="i"
              :tour="{
                title: feature.title,
                description: feature.description,
                image: feature.media,
              }"
              :route-name="feature.type"
              size="slider"
            />
          </f-slider>
        </nav>
      </div>

      <div
        id="feefo-service-review-carousel-widgetId"
        class="feefo-review-carousel-widget-service"
      />

    </div>
  </div>
</template>

<script>
import FHero from '../components/global/Hero'
import FSlider from '../components/global/Slider'
import HomeFilter from '../components/homeFilter'

import TourSimplePreview from '../components/tours/TourSimplePreview'
import WhyFlexitreks from '../components/global/WhyFlexitreks'
import FeefoRating from '../components/global/FeefoRating'
import FInformationBox from '../components/global/FInformationBox'
import HomepageCollection from '../components/global/HomePageCollection'

export default {
  async asyncData({ route, store }, callback) {
    try {
      const page = await store.dispatch('getPage', { slug: 'home', section: null })
      const inspiration = page.meta && page.meta.inspiration ? page.meta.inspiration[0] : {};
      callback(null, { page, inspiration })
    } catch(e) {
      callback({ statusCode: 404, message: 'Page not found' })
    }
  },

  components: {
    FHero,
    FSlider,
    HomeFilter,
    TourSimplePreview,
    WhyFlexitreks,
    FeefoRating,
    FInformationBox,
    HomepageCollection
  },

  computed: {
    collections () {
      return this.$store.state.collections
    },
  },

  async mounted() {
    await this.$store.commit('resetFilters')
    let feefoScript = document.createElement('script')
    feefoScript.setAttribute('src', 'https://api.feefo.com/api/javascript/flexitreks')
    feefoScript.async = true
    document.head.appendChild(feefoScript)
  },

  head () {
    const title = this.page.seo_title || this.page.title
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

<style>
.home-primary h2 {
  margin: 15px 0;
}

@media (min-width: 1200px) {
  .home-primary h2 {
    margin: 15px 0 35px;
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.hero {
  .home & {
    height: auto;
  }

  h4 {
    margin-bottom: 7px;
    color: #FFF;
  }

  h1 {
    margin-bottom: 15px;
    color: #FFF;
  }

  &__content {
    position: relative;
    z-index: 10;
  }

  .feefo-rating {
    color: #FFF;
    font-size: 14px;
    margin-top: 30px;

    .qualifier {
      display: none;
    }

    @media (min-width: 450px) {
      .qualifier {
        display: inline;
      }

      strong {
        display: none;
      }
    }

    img {
      margin-right: 10px;
      display: inline-block;
    }
  }

  @include mq(40em, 'true') {
    .wrap  {
      padding-top: 50px;
    }
  }

  @include mq(40em) {
    .wrap  {
      padding-top: 100px;
    }
  }

  @media (min-width: 800px) {
    .wrap  {
      padding-top: 200px;
    }
  }

  @media (min-width: 1000px) {
    .wrap  {
      padding-top: 250px;
    }
  }
}

.overflow {
  overflow: hidden;
  padding-top: 20px;
}

main {
  background: #FFF;
  box-shadow: 0 0 40px 30px #FFF;
  padding-top: 30px;
  max-width: 530px;

  .orange-link {
    font-size: 16px;
  }
}

.home-bg {
  @include mq(60em) {
    // padding-bottom: 30px;
    background: url('~/assets/images/contours.svg') center -60px /100% auto no-repeat,
              url('~/assets/images/bg.jpg') right bottom /auto no-repeat;
  }
}

.home-primary {
  margin-bottom: 5%;
}

.featured {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  margin-top: 30px;
}

.temp {
  background: #CFCFD2;
  padding: 30px;
}

.featured-slider {
  margin: 450px -15px 40px;

  .tour-simple {
    margin: 0 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

.feefo-review-carousel-widget-service {
  margin: auto;
  width: 100%;
  max-width: 1148px;
}
.slider-view {
  width: 50%;
  margin-left: 10px;
    @media (max-width: 65em) {
      width: 97%;
    }
}

@media screen and (min-width: 40em) {
  .home {
    margin-top: -60px;
  }
}

@include mq(750px) {
  main {
    width: 50%;
    float: right;
  }

  .featured {
    width: 45%;
    float: left;
    max-width: 626px;
    position: relative;
    z-index: 1;
  }
}

@include mq(1000px) {
  main {
    margin-right: 25px;
    width: 530px;
    padding-top: 30px;

    h2 {
      margin-bottom: 35px;
    }

    p {
      line-height: 1.45;
    }

    .orange-link {
      display: inline-block;
      margin-top: 10px;
    }
  }

  .featured {
    width: calc(100% - 590px);
    margin-top: -30px;
  }
}

@include mq(1050px) {
  main {
    padding-top: 70px;
  }

  .featured {
    margin-top: -60px;
  }
}
</style>
