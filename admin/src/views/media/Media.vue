<template>
  <div>
    <header class="header">
      <h1>Media</h1>
    </header>
    <media-container :editable="true" />
  </div>
</template>

<script>
import MediaContainer from '@/components/MediaContainer'
export default {
  components: {
    MediaContainer
  }
}
</script>
