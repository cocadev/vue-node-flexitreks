<template>
  <article
    :style="{
      'background-image': `url(${tour.image ? 'https://flexitreks-new.imgix.net/' + tour.image + ($store.state.sizes[size === 'slider' ? 'small' : 'inspiration_large']) : ''})`
    }"
    :class="{
      'tour-simple': true,
      'tour-simple--large': size === 'large',
      'tour-simple--slider': size === 'slider'
    }"
  >
    <div class="sizer">
      <div>
        <h4 v-if="tour.destinations && tour.destinations.length">{{ tour.destinations[0].name }}</h4>
        <h3>
          {{ tour.name_short || tour.name }}
        </h3>
      </div>
      <a
        v-if="size === 'slider'"
        :href="resolve({
          name: routeName,
          params: {
            slug: tour.slug
          }
        })"
      />
      <nuxt-link
        v-else
        :to="{
          name: routeName,
          params: {
            slug: tour.slug
          }
        }"
      />
    </div>
    <div class="category">
      <h2>{{ tour.title }}</h2>
      <div class="description"> {{ tourDescription }} </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    tour: {
      type: Object,
      required: true
    },
    routeName: {
      type: String,
      default: 'tours-slug'
    },
    size: {
      type: String,
      default () {
        return ''
      }
    }
  },

  computed: {
    tourDescription() {
      if (! this.tour.description) {
        return ''
      }
      const maxChars = 200
      if (this.tour.description.length <= maxChars) {
        return this.tour.description
      }
      return this.tour.description.slice(0, maxChars) + '...'
    }
  },

  methods: {
    resolve (args) {
      const route = this.$router.resolve(args)
      return route && route.href ? route.href : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.tour-simple {
  background-size: cover;
  background-position: top;
  background-color: $lightest;
  background-repeat: no-repeat;
  background-size: 100% 63%;
  text-align: center;
  color: #FFF;
  @include mq(50em, 'true') {
      background-size: 100% 93%;
  }

  h3 {
    margin: 0;
  }

  .sizer {
    position: relative;
    height: 0;
    padding-bottom: 72.4%;
    display: block;
    transition: 300ms opacity;

    &:hover {
      opacity: 0;
    }

    div {
      position: absolute;
      z-index: 1;
      height: 100%;
      width: 100%;
      padding: 20px;
      left: 0;
      top: 0;

      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    &:after {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      // background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(40,40,40,0) 100%);
    }
  }

  * {
    color: inherit;
  }

  .category {
    height: 200px;
    background: #ccf0fc;
    color: #111;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-size: 15px;
    .description {
      color: #6695a7
    }
    @include mq(50em, 'true') {
      background: #fff;
      height: 50px;
      padding-top: 40px;
      width: 120%;
      margin-left: -10%;
      .description {
        display: none;
      }
    }
  }
}

a {
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.tour-simple--large {
  @include mq(45em, 49em) {
    font-size: 0.9em;
  }

  h4 {
    font-size: 1em;
  }

  h3 {
    font-size: 1.375em;
  }

  .sizer {
    padding-bottom: 90.3%;
  }
}

.tour-simple--slider {
  .sizer {
    padding-bottom: 56.565%;
  }
}

</style>
