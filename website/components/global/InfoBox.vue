<template>
  <div class="info">
    <slot
      v-bind="{ open, toggle }"
      name="toggle"
    >
      <a
        class="info-toggle"
        @click="toggle"
      >i</a>
    </slot>
    <basic-lightbox
      v-if="open"
      :open="open"
      mini
      @close="open = false"
    >
      <div class="info-content">
        <slot />
      </div>
    </basic-lightbox>
  </div>
</template>

<script>
import BasicLightbox from './BasicLightbox'

export default {
  components: {
    BasicLightbox
  },

  data () {
    return {
      open: false
    }
  },

  methods: {
    toggle () {
      this.open = !this.open
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.info {
  display: inline-block;
}

.info-toggle {
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  margin: 0 10px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  border-radius: 9px;
  background: $orange;
  color: #fff;
}

.info /deep/ .info-content {
  font-size: 14px;
  line-height: 1.375;

  h5 {
    font-size: 15px;
    margin: 0;
  }

  p {
    margin: 3px 0 15px;
  }

  :first-child {
    margin-top: 0;
  }

  :last-child {
    margin-bottom: 0;
  }
}
</style>
