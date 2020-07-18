<template>
  <button
    type="button"
    class="button"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
