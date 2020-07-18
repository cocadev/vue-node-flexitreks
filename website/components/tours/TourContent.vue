<template>
  <div class="content">
    <div v-html="main" />
    <button
      v-if="more"
      :class="{ active: active }"
      type="button"
      class="read-more-content"
      @click="active = !active"
    >{{ active ? 'Read less' : 'Read more' }}</button>
    <div v-html="more" />
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default () {
        return ''
      }
    }
  },

  data() {
    return {
      active: false,
      main: '',
      more: ''
    }
  },

  watch: {
    content: {
      immediate: true,
      handler (content) {
        const p = content.replace(
          /<p>{{ youtube (.*) }}<\/p>/gm,
          `<div class="embed-container"><div class="embed"><iframe height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></div>`
        ).split('</p>')

        this.main = p.slice(0, 3).join('</p>');
        this.more = p.slice(3).join('</p>')
      }
    }
  }
}
</script>
