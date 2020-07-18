<template>
  <FForm
    v-model="value"
    route="destinations"
    title="Destination"
    columns="2"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name',
        column: 1,
      },
      {
        component: 'FInput',
        key: 'slug',
        label: 'Slug',
        column: 1,
      },
      {
        component: 'FEditor',
        key: 'description',
        label: 'Description',
        column: 1,
      },
      {
        component: 'FInput',
        key: 'currency',
        label: 'Currency',
        column: 1,
      },
      {
        component: 'FMediaPicker',
        key: 'media_id',
        label: 'Image',
        column: 2,
      },
      {
        component: 'FGalleryPicker',
        key: 'gallery_id',
        label: 'Image',
        column: 2,
      },
      {
        component: 'FCheckboxList',
        key: 'regions',
        label: 'Regions',
        items: regions,
        column: 2,
      },
      {
        component: 'FEditor',
        key: 'tipping',
        label: 'Tipping',
        column: 1,
      },
      {
        component: 'FInput',
        key: 'order',
        label: 'Order',
        column: 1,
        domProps: {
          type: 'number',
          step: 1
        }
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

  data () {
    return {
      regions: []
    }
  },

  components: {
    FForm
  },

  created () {
    this.axios.get('regions')
      .then(res => {
        this.regions = res.data
      })
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

      if (value.regions && value.regions.length) {
        value.regions = value.regions.map(r => {
          return {
            region_id: r.id
          }
        })
      }

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
