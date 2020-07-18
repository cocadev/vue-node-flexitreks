<template>
  <div class="wrap pad-top pad-bottom">
    <header class="center pad-bottom">
      <h4>Contact</h4>
      <h1>If you have any queries or questions please get in touch</h1>
      <div v-html="$store.state.global.options.contact_content || ''" />
    </header>

    <div
      v-if="thanks"
      class="center thanks"
    >
      <h2>Thanks for getting in touch</h2>
      <p>A member of our team will be in touch shortly</p>
    </div>
    <form
      v-else
      class="form-style"
      novalidate
      @submit.prevent="submit"
    >
      <h3
        v-if="major"
        class="center"
      >There was a problem submitting your enquiry, please try again.<br><br></h3>

      <f-input
        id="contact_name"
        v-model="contact.name"
        label="Your name"
      />
      <f-input
        id="contact_email"
        v-model="contact.email"
        label="Email address"
        type="email"
      />
      <f-input
        id="contact_telephone"
        v-model="contact.telephone"
        label="Telephone number"
        type="tel"
      />

      <br><br>

      <tour-picker
        v-model="contact.tours"
        @addTour="contact.tours.push({ destination: '', tour: '' })"
        @removeTour="contact.tours.splice($event, 1)"
      />

      <br>

      <div class="validation">
        <label>Validation field, please leave blank
          <input
            v-model="contact.address"
            type="text"
            name="address"
          >
        </label>
      </div>

      <f-textarea
        id="contact_message"
        v-model="contact.message"
        label="Your enquiry"
      />

      <p class="group">
        <button
          type="submit"
          class="button button--dark button--large"
        >Submit</button>
      </p>
    </form>
  </div>
</template>

<script>
import FInput from '@/components/bookings/BookingInput'
import FTextarea from '@/components/bookings/BookingTextarea'
import TourPicker from '@/components/global/TourPicker'

export default {
  components: {
    FInput,
    FTextarea,
    TourPicker
  },

  data () {
    return {
      sent: false,
      thanks: false,
      major: false,
      contact: {
        name: '',
        email: '',
        telephone: '',
        tours: [{
          destination: '',
          tour: ''
        }],
        postcode: '',
        message: '',
        address: ''
      }
    }
  },

  async mounted () {
    if (!this.$route.query.destination || !this.$route.query.tour) return
    const destination = this.$store.state.global.destinations.find(x => x.slug === String(this.$route.query.destination))
    if (!destination) return

    this.contact.tours[0].destination = destination.slug
    await this.$store.dispatch('getToursForDestination', { slug: destination.slug })

    setTimeout(() => { this.contact.tours[0].tour = String(this.$route.query.tour)}, 100)
  },

  methods: {
    async submit () {
      if (this.sent) return

      const errors = []
      if (!this.contact.name) errors.push('contact_name')
      if (!this.contact.email) errors.push('contact_email')
      if (!/.+\@.+\..+/.test(this.contact.email)) errors.push('contact_email')
      if (!this.contact.telephone) errors.push('contact_telephone')

      this.$store.commit('addFormErrors', errors);
      if (errors.length) return this.scrollTo('form .error')

      this.sent = true;

      try {
        await this.$axios.post('enquiries', this.contact);
        this.thanks = true;
        this.sent = false;
        this.contact = {
          name: '',
          email: '',
          telephone: '',
          message: '',
          address: '',
          tours: [{
            destination: '',
            tour: ''
          }]
        }

        this.scrollTo('.thanks')
      } catch (e) {
        this.sent = false;
        if (e.response && e.response.data && e.response.data) {
            const api_errors = e.response.data.error || {}
            if (api_errors === 'Validation failed') {
              this.major = true;
              this.contact = {
                name: '',
                email: '',
                telephone: '',
                message: '',
                address: '',
                tours: [{
                  destination: '',
                  tour: ''
                }]
              }
            }

            const new_errors = []

            if (api_errors.name) errors.push('contact_name')
            if (api_errors.email) errors.push('contact_email')
            if (api_errors.telephone) errors.push('contact_telephone')
            if (api_errors.message) errors.push('contact_message')

            this.$store.commit('addFormErrors', errors);
            if (errors.length) return this.scrollTo('form .error')
        }
      }

    },

    scrollTo (selector = 'form .error') {
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          const pos = el.getBoundingClientRect()
          const headerOffset = Number(window.getComputedStyle(document.body).paddingTop.replace('px', ''))
          const change = headerOffset - pos.top + 20
          if (change === 0) return

          const newTop = window.pageYOffset - change;
          window.scrollTo.length ? window.scrollTo({
            top: newTop,
            behavior: 'smooth'
          }) : window.scrollTo(0, newTop)
        }
      }, 100)
    }
  },

  head () {
    const title = 'Contact'
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  max-width: 854px;
  margin: 0 auto;

  .validation {
    display: none;
  }
}

header {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
</style>
