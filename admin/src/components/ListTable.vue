<template>
  <table>
    <thead>
      <tr>
        <slot name="thead"></slot>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="instance in data"
        :key="instance.id"
      >
        <slot v-bind:instance="instance" />
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    data: Array
  }
}
</script>
