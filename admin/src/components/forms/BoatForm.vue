<template>
  <FForm
    v-model="value"
    route="boats"
    title="Boat"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name',
        required: true
      },
      {
        component: 'FInput',
        key: 'description',
        label: 'Description',
        required: true
      },
      {
        component: 'FGalleryPicker',
        key: 'gallery_id',
        label: 'Image',
        column: 2,
      },
    ]"
    :submit="submit"
  />
</template>

<script>
import FForm from '@/components/FForm'
export default {
  props: {
    value: Object
  },

  components: {
    FForm
  },

  methods: {
    async submit (e, {
      method,
      endpoint,
      value,
      redirect,
      route
    }) {
      e.preventDefault()
      if (value.gallery_id) {
        try {
          await this.axios.put(`galleries/${value.gallery_id}`, {
            media: value.gallery
          })
        } catch (e) {}
      }

      this.axios[method](endpoint, value)
        .then(() => {
          this.$toasted.success('Saved')
          this.$router.push({ name: redirect || route })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
