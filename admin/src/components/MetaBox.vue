<template>
  <form class="mb" @submit.prevent="$emit('submit', $event)">
    <header class="mb__header">
      <h1>{{ title || `Edit ${type}` }}</h1>
      <router-link
        v-if="link"
        :class="{ mb__cancel: !button, button }"
        :to="link"
      >{{ link_title || 'Back' }}</router-link>
      <f-button v-if="edit" type="submit">Save</f-button>
    </header>
    <div class="mb__content">
      <slot />
    </div>
  </form>
</template>

<script>
import FButton from './FButton'
export default {
  props: {
    id: Number,
    type: String,
    title: String,
    button: Boolean,
    link: {
      type: [Object, String]
    },
    link_title: String,
    edit: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },

  components: {
    FButton
  }
}
</script>

<style lang="scss">
@import '../assets/scss/settings';

.mb {
  background: $light;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid $line;
  padding: 20px;
  margin: 0 0 30px;

  &__content > :last-child {
    margin-bottom: 0;
  }

  &__cancel {
    font-size: 12px;
  }

  &__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 15px;
    margin-bottom: 15px;

    h1 {
      margin: 0 0 10px;
      line-height: 1.1;
    }
  }

  @media screen and (min-width: 500px) {
    padding: 30px;

    &__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: 55px;

    h1 {
      margin: 0 auto 0 0;
    }

    > * {
      margin: 0 10px;
    }
  }
  }
}
</style>
