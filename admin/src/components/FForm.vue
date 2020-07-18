<script>
import FInput from './FInput'
import FEditor from './FEditor'
import FCheckboxList from './FCheckboxList'
import FMediaPicker from './MediaPicker'
import FGalleryPicker from './GalleryPicker'
import FSelect from './FSelect'

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    title: String,
    schema: Array,
    route: String,
    url: String,
    redirect: String,
    submit: Function,
    columns: String
  },

  components: {
    FInput,
    FEditor,
    FCheckboxList,
    FMediaPicker,
    FSelect,
    FGalleryPicker
  },

  computed: {
    isEdit () {
      return !!this.value.id
    },

    endpoint () {
      return this.url || (this.isEdit ? `${this.route}/${this.value.id}` : this.route)
    },

    method () {
      return this.isEdit ? 'put' : 'post'
    }
  },

  render (h) {
    let gallery = []
    if (this.value.image) this.$store.commit('addImages', [this.value.image])
    if (this.value.gallery) {
      this.$store.commit('addImages', this.value.gallery)
      gallery = this.value.gallery
    }
    if (this.value.gallery_details) {
      this.$store.commit('addImages', this.value.gallery_details)
    }
    const component = (field) => {
      if (Array.isArray(field)) {
        return h(
          'div',
          {
            class: 'field-group'
          },
          field.map(component)
        )
      }

      const domProps = field.domProps || {}
      return h(
        field.component,
        {
          props: {
            label: field.label,
            value: this.value[field.key],
            name: field.key,
            required: field.required || false,
            items: field.items || [],
            gallery,
            domProps
          },
          on: {
            input: (event) => {
              this.value[field.key] = event
            },
            change: (event) => {
              this.value[field.key] = event
            },
            changeGallery: (event) => {
              this.value['gallery'] = event
            }
          }
        }
      )
    }

    const footer = h(
      'footer',
      [
        h(
          'input',
          {
            domProps: {
              className: 'button button--blue',
              type: 'submit',
              value: 'Save'
            }
          }
        )
      ]
    )

    let fields
    if (this.columns === '2') {
      fields = h(
        'div',
        {
          class: 'form-columns'
        },
        [
          h('div', this.schema.filter(f => Array.isArray(f) || f.column === 1).map(component).concat(footer)),
          h('aside', this.schema.filter(f => f.column === 2).map(component))
        ]
      )
    } else {
      fields = h('div', this.schema.map(component).concat(footer))
    }

    const form = h(
      'form',
      {
        class: 'form-build ' + (this.columns ? 'form-build--' + this.columns : 'form-build--auto'),
        on: {
          submit: (event) => {
            if (this.submit) {
              return this.submit(event, {
                method: this.method,
                endpoint: this.endpoint,
                value: this.value,
                redirect: this.redirect,
                route: this.route
              })
            }

            event.preventDefault()
            this.axios[this.method](this.endpoint, this.value)
              .then(() => {
                this.$toasted.success('Saved')
                this.$router.push({ name: this.redirect || this.route })
              })
              .catch(e => this.$store.dispatch('error', e.response.data.error))
          }
        }
      },
      [
        fields
      ]
    )

    if (this.title) {
      return h(
        'div',
        [
          h(
            'header',
            {
              class: 'header'
            },
            [
              h(
                'h1',
                `${Object.keys(this.value).length ? 'Edit' : 'Create'} ${this.title}`
              )
            ]
          ),
          form
        ]
      )
    } else {
      return form
    }
  }
}
</script>
