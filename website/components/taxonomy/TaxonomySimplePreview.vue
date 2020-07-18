<template>
  <article
    :style="{
      'background-image': taxonomy.image ? `url(${taxonomy.image.url}${$store.state.sizes.taxonomy})` : ''
    }"
  >
    <nuxt-link :to="url">
      <h4>{{ taxonomy.name }}</h4>
    </nuxt-link>
  </article>
</template>

<script>
export default {
  props: {
    taxonomy: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    offer: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  data () {
    const url = { name: `${this.type}s-slug`, params: { slug: this.taxonomy.slug } }
    if (this.offer) url.query = { offer: true }

    return {
      url
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

article {
  background-color: $grey;
  color: #FFF;
  position: relative;

  a {
    height: 0;
    padding-bottom: 56.375%;
    display: block;

    .two-col & {
      padding-bottom: 72.481%;
    }
  }

  h4 {
    position: absolute;
    color: inherit;
    background: linear-gradient(rgba(0, 0, 16, 0), rgba(0, 0, 0, 0.6));
    width: 100%;
    padding: 20px;
    margin: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
