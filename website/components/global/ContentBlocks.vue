<template>
  <div class="blocks">
    <div class="wrap">
      <div
        v-for="block in blocks"
        :key="block.id"
        class="block clear"
      >
        <figure v-if="block.media">
          <img
            :src="block.media.url + $store.state.sizes.inspiration"
            :alt="block.media.alt"
          >
        </figure>
        <div class="block-content clear">
          <div
            class="content"
            v-html="block.content"
          />
        </div>
      </div>
      <div
        v-for="block in blocks"
        :key="block.id + 1"
        class="block clear"
      >
        <figure v-if="block.media">
          <img
            :src="block.media.url + $store.state.sizes.inspiration"
            :alt="block.media.alt"
          >
        </figure>
        <div class="block-content clear">
          <div
            class="content"
            v-html="block.content"
          />
        </div>
      </div>

      <footer class="center">
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
      </footer>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    blocks: {
      type: Array,
      required: true
    },
    location: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.blocks {
  background: $lightest;
  padding: 40px 0;
}

.button {
  margin-top: 30px;
}

.block {
  img {
    margin: 0 0 30px;
  }

  &-content {
    max-width: 600px;
  }
}

@include mq(45em) {
  .blocks {
    background: $lightest url('~/assets/images/contours.svg') center /100% auto no-repeat;
    padding: 80px 0;
  }
  
  .block {
    padding-bottom: 40px;

    .block-content {
      margin: 0 auto;
    }

    figure {
      margin: 0 30px 0 0;
    }

    figure + .block-content {
      max-width: none;
      margin: 0;
    }

    figure + .block-content,
    figure {
      width: calc(50% - 15px);
      float: left;
    }

    figure + .block-content .content {
      max-width: 515px;
      margin-right: 30px;
      float: right;
    }

    &:nth-child(2n) {
      figure {
        float: right;
      }

      figure + .block-content .content {
        float: left;
        margin-right: none;
        margin-left: 30px;
      }
    }
  }
}

@include mq(60em) {
  .blocks {
    padding: 100px 0 80px;
  }

  .block .content {
    padding-top: 40px;
  }
}

@include mq(80em) {
  .blocks {
    padding: 136px 0 80px;
  }

  .block .content {
    padding-top: 65px;
  }
}
</style>
