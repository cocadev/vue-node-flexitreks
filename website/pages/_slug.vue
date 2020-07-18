<template>
  <div class="page-container">
    <f-hero
      v-if="page.banner"
      :image="page.banner.url"
    />
    <main class="wrap insulate">
      <div
        :class="{
          'page-content': true,
          'has-overview': !!page.overview
        }"
      >
        <h4 v-if="page.subtitle">{{ page.subtitle }}</h4>
        <h1>{{ page.title }}</h1>
        <div
          class="content"
          v-html="page.content"
        />
      </div>
      <aside
        v-if="page.overview || page.overview_image"
        class="overview"
      >
        <img
          v-if="page.overview_image"
          :src="page.overview_image.url"
          :alt="page.overview_image.alt"
        >
        <div
          v-else
          class="clear"
        >
          <div
            class="content"
            v-html="page.overview"
          />
        </div>
      </aside>
    </main>

    <div
      v-if="page.related && page.related.length"
      class="related wrap center"
    >
      <h2>Discover tours{{ location ? ' in ' + location.entity.name : '' }}</h2>
      <div class="clear three-col">
        <tour-simple-preview
          v-for="relatedTour in page.related"
          :key="relatedTour.id"
          :tour="relatedTour"
        />
      </div>
      <nuxt-link
        v-if="location"
        :to="{
          name: location.type,
          params: {
            slug: location.entity.slug
          }
        }"
        class="button button--grey"
      >
        Explore all tours in {{ location.entity.name }}
      </nuxt-link>
    </div>

    <content-blocks
      v-if="page.blocks && page.blocks.length"
      :blocks="page.blocks"
      :location="location"
    />

    <why-flexitreks v-if="page.style !== 'minimal'" />

  </div>
</template>

<script>
import FHero from '@/components/global/Hero'
import TourSimplePreview from '@/components/tours/TourSimplePreview'
import ContentBlocks from '@/components/global/ContentBlocks'
import WhyFlexitreks from '../components/global/WhyFlexitreks'

export default {
  async asyncData({ route, store }, callback) {
    try {
      const page = await store.dispatch('getPage', { slug: route.params.slug, section: route.path.indexOf('/explore/') === 0 ? 'explore' : null })
      callback(null, { page })
    } catch(e) {
      callback({ statusCode: 404, message: 'Page not found' })
    }
  },

  components: {
    FHero,
    TourSimplePreview,
    ContentBlocks,
    WhyFlexitreks
  },

  computed: {
    location () {
      if (!this.page.destination || this.page.region) return null
      return {
        type: this.page.destination ? 'destinations-slug' : 'regions-slug',
        entity: this.page.destination || this.page.region
      }
    }
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

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.page-container {
  overflow: hidden;
}

.insulate {
  padding-top: 30px;
  padding-bottom: 30px;
  margin-bottom: 60px;
}

.page-content {
  max-width: 800px;
}

.overview {
  background: $lightest;
  position: relative;
  padding: 15px 0 15px 15px;

  .clear {
    padding-top: 5px;
  }

  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 0;
    width: 50vw;
    height: 100%;
    background: $lightest;
  }
}

h1 {
  line-height: 1.218;
}

.related {
  margin-top: 50px;
  margin-bottom: 40px;

  h2 {
    margin-bottom: 40px;
  }
}

@include mq(55em) {
  .overview {
    width: 41%;
    max-width: 516px;
    float: right;
    padding: 30px 10px 30px 30px;

    .clear {
      padding: 10px 0 0;
    }

    .content {
      max-width: 440px;
      width: 100%;
      float: right;
    }
  }

  .page-content {
    width: 51%;
    float: left;
  }

  .has-overview {
    max-width: 625px;
  }

  .related {
    margin-top: 75px;
    margin-bottom: 90px;
  }
}

@include mq(65em) {
  .overview .clear {
    padding: 35px 0 0 0;
  }
}

</style>
