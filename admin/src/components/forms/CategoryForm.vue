<template>
  <FForm
    v-model="value"
    route="categories"
    title="Category"
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
        component: 'FSelect',
        key: 'filter_id',
        label: 'Filter',
        column: 1,
        items: filters,
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
      }
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
      filters: [
        {
          id: '',
          name: 'None'
        },
        {
          id: 'bike',
          name: 'Bike & Hotel'
        },
        {
          id: 'bike_boat',
          name: 'Bike & Boat'
        },
        {
          id: 'self_guided',
          name: 'Self Guided'
        },
        {
          id: 'guided',
          name: 'Guided'
        },
        {
          id: 'easy',
          name: 'Level - Easy'
        },
        {
          id: 'leisurely',
          name: 'Level - Leisurely'
        },
        {
          id: 'moderate',
          name: 'Level - Moderate'
        },
        {
          id: 'challenging',
          name: 'Level - Challenging'
        },
        {
          id: '1_4_nights',
          name: 'Nights - 1 to 4'
        },
        {
          id: '5_8_nights',
          name: 'Nights - 5 to 8'
        },
        {
          id: '9_14_nights',
          name: 'Nights - 9 to 14'
        },
        {
          id: 'offers',
          name: 'Offers'
        }
      ]
    }
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
