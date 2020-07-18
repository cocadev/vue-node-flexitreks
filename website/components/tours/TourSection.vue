<template functional>
  <div class="tour-section">
    <h2>{{ props.title }}</h2>
    <div
      class="content"
      v-html="props.content"
    />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }
}
</script>
