<template>
  <article
    :style="{
      'background-image': `url(${tour.image ? tour.image.url + ($store.state.sizes[size === 'slider' ? 'small' : 'inspiration_large']) : ''})`
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
  background-position: center;
  background-color: $lightest;
  background-repeat: no-repeat;
  text-align: center;
  color: #FFF;

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
      background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(40,40,40,0) 100%);
    }
  }
  
  * {
    color: inherit;
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
