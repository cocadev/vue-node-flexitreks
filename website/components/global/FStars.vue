<template functional>
  <span class="stars">
    <figure>
      <span
        :style="{
          width: `${props.score * 20 - 1}%`
        }"
      />
    </figure>
    {{ props.score }}/5
  </span>
</template>

<script>
export default {
  name: 'FStars',

  score: {
    type: Number,
    default: 0
  }
}
</script>
