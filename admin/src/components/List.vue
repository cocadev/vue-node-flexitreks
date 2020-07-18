<template>
  <ul>
    <li v-for="instance in data" :key="instance.name">
      <h3>
        <router-link :to="{ name: link, params: { id: instance.id } }">
          {{ instance.name }}
        </router-link>
      </h3>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: Array,
    link: String
  }
}
</script>
