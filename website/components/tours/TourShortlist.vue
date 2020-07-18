<template>
  <button
    :class="{
      'add-to-shortlist': true,
      active
    }"
    :aria-label="`${active ? 'Remove from' : 'Add to'} shortlist`"
    type="button"
    @click="$store.commit('toggleShortlist', slug)"
  >
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :fill="active ? '#F88F2B' : 'transparent'"
        d="M13 1a4.26 4.26 0 0 0-4 2.48A4.26 4.26 0 0 0 5 1C2.5 1 1 3.15 1 5.24c0 2.14 1.33 4.42 3.96 6.79A24.38 24.38 0 0 0 9 15c1.4-.82 2.75-1.8 4.04-2.97C15.67 9.66 17 7.38 17 5.23 17 3.16 15.5 1 13 1z"
        fill-rule="nonzero"
        stroke="#F88F2B"
      />
    </svg>
  </button>
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      required: true
    }
  },

  computed: {
    active () {
      return this.$store.state.shortlist && this.$store.state.shortlist.includes(this.slug)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

button {
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  position: absolute;
  width: 18px;
  height: 16px;
  right: -3px;
  top: 0;
  padding: 0;
  box-shadow: none;
  background: none;
  margin: 0;
  border: none;
  outline: none;
}

path {
  transition: fill 300ms;
}
</style>
