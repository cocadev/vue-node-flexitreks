<template>
  <FForm
    v-model="value"
    route="pages"
    title="Page"
    columns="2"
    :submit="submit"
    :schema="[
      [
        {
          component: 'FInput',
          key: 'title',
          label: 'Title',
          column: 1
        },
        {
          component: 'FInput',
          key: 'subtitle',
          label: 'Subtitle',
          column: 1
        }
      ],
      [
        {
          component: 'FInput',
          key: 'slug',
          label: 'Slug',
          column: 1
        },
        {
          component: 'FInput',
          key: 'section',
          label: 'Section',
          column: 1
        }
      ],
      {
        component: 'FEditor',
        key: 'content',
        label: 'Content',
        column: 1
      },
      {
        component: 'FEditor',
        key: 'ksp_content',
        label: 'KSP Content',
        column: 1
      },
      {
        component: 'FInput',
        key: 'ksp_bg_hex',
        label: 'KSP Panel Background Colour (Hex)',
        column: 1
      },
      [
        {
          component: 'FInput',
          key: 'ksp_button_title',
          label: 'KSP Button Title',
          column: 1
        },
        {
          component: 'FInput',
          key: 'ksp_button_url',
          label: 'KSP Button URL',
          column: 1
        }
      ],
      {
        component: 'FEditor',
        key: 'overview',
        label: 'Overview',
        column: 1
      },
      {
        component: 'FCheckboxList',
        key: 'related_tours',
        label: 'Related Tours',
        items: tours,
        column: 1,
      },
      {
        component: 'FSelect',
        key: 'destination_id',
        label: 'Destination',
        items: destinations,
        column: 1,
      },
      {
        component: 'FSelect',
        key: 'style',
        label: 'Style',
        items: styles,
        column: 1,
      },
      {
        component: 'FMediaPicker',
        key: 'media_id',
        label: 'Featured Image',
        column: 2,
      },
      {
        component: 'FMediaPicker',
        key: 'banner_id',
        label: 'Banner',
        column: 2,
      },
      {
        component: 'FMediaPicker',
        key: 'overview_image_id',
        label: 'Overview Image',
        column: 2,
      }
    ]"
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
      tours: [],
      destinations: [],
      styles: [
        {
          id: '',
          name: 'Default'
        }, {
          id: 'minimal',
          name: 'Minimal'
        }
      ]
    }
  },

  components: {
    FForm
  },

  created () {
    this.axios.get('tours/all')
      .then(res => {
        this.tours = res.data
      })

    this.axios.get('destinations')
      .then(res => {
        this.destinations = res.data
        this.destinations.unshift({
          id: 0,
          name: 'None'
        })
      })
  },

  methods: {
    submit (e, {
      method,
      endpoint,
      value,
      redirect,
      route
    }) {
      event.preventDefault()

      if (value.related_tours && value.related_tours.length) {
        value.related_tours = value.related_tours.map(t => t.id)
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
