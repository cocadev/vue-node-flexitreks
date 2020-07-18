<template>
  <footer role="contentinfo">
    <div class="wrap">
      <nav class="clear">
        <div>
          <h3>Information</h3>
          <nuxt-link to="/foreign-travel-advice">Foreign Travel Advice</nuxt-link>
          <nuxt-link to="/financial-protection">Financial Protection</nuxt-link>
          <nuxt-link to="/terms-conditions">Booking Conditions</nuxt-link>
        </div>

        <div>
          <h3>Useful links</h3>
          <nuxt-link to="/contact">Contact</nuxt-link>
          <nuxt-link to="/about">About Flexitreks</nuxt-link>
          <nuxt-link to="/faqs">FAQs</nuxt-link>
        </div>

        <div class="social">
          <h3>Connect with us</h3>
          <a
            href="https://www.facebook.com/flexitreksltd/"
            target="_blank"
          >
            <img
              src="@/assets/images/facebook.svg"
              alt="Facebook logo"
            >
          </a>
          <a
            href="https://twitter.com/flexitreks"
            target="_blank"
          >
            <img
              src="@/assets/images/twitter.svg"
              alt="Twitter logo"
            >
          </a>
        </div>
      </nav>

      <div class="newsletter">
        <h3>Don't miss out</h3>
        <p>Keep up to date with our special offers, news and information</p>
        <div
          v-if="success"
        >
          <br>
          <h3>Thanks for signing up to the Flexitreks newsletter!<br
          >We've sent you a confirmation email.</h3>
        </div>
        <form
          v-else
          @submit.prevent="submit"
        >
          <h3
            v-if="error"
            class="error"
          >{{ error }}</h3>
          <div class="clear">
            <p>
              <label
                class="screen-reader-only"
                for="fname"
              >First name</label>
              <input
                id="news_fname"
                v-model="signup.first_name"
                type="text"
                placeholder="First name"
                name="fname"
                class="small-input"
                required
              >
            </p>
            <p>
              <label
                class="screen-reader-only"
                for="lname"
              >Last name</label>
              <input
                id="news_lname"
                v-model="signup.last_name"
                type="text"
                placeholder="Last name"
                name="lname"
                class="small-input"
                required
              >
            </p>
          </div>
          <p>
            <label
              class="screen-reader-only"
              for="email"
            >Email</label>
            <input
              id="news_email"
              v-model="signup.email_address"
              type="email"
              placeholder="Email address"
              name="email"
              class="small-input"
              required
            >
          </p>
          <input
            :disabled="sent"
            type="submit"
            class="button button--grey"
            value="Sign me up"
          >
        </form>
      </div>
      <small>
        <img
          src="/images/abta.png"
          alt="ABTA protected - travel with confidence"
          width="110"
        >
        &copy; Copyright {{ new Date().getFullYear() }} Flexitreks Ltd. <a href="https://www.tomango.co.uk">Designed by Tomango</a>
      </small>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      sent: false,
      error: false,
      success: false,
      signup: {
        email_address: '',
        first_name: '',
        last_name: ''
      }
    }
  },

  methods: {
    async submit () {
      this.error = false
      if (!this.signup.first_name) this.error = 'Please supply your first name'
      if (!this.signup.last_name) this.error = 'Please supply your last name'
      if (!this.signup.email_address) this.error = 'Please supply your email address'
      if (!/.+\@.+\..+/.test(this.signup.email_address)) this.error = 'Please supply a valid email address'
      if (this.error) return

      this.sent = true
      try {
        await this.$axios.post('newsletter', this.signup)
        this.sent = false
        this.success = true
      } catch (e) {
        this.error = e.response.data.error;
        this.sent = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

footer {
  background: $dark-blue;
  padding: 40px 0;
  color: #FFF;
  clear: both;

  a {
    transition: 300ms color;
  }

  a:hover {
    color: $light-blue;
  }
}

footer h3 {
  margin-bottom: 17px;
  color: inherit;
}

footer nav {
  max-width: 600px;

  div {
    margin: 0 0 30px;
  }

  a {
    display: block;
    font-size: 14px;
    margin: 0 0 8px;
  }
}

.social a {
  display: inline-block;
  border: 1px solid #00466D;
  height: 35px;
  width: 35px;
  border-radius: 100%;
  position: relative;
  margin: 0 9px 0 0;
  transition: 300ms opacity;

  img {
    position: absolute;
    transform: translate3d(-50%, -50%, 0);
    width: 20px;
    left: 50%;
    top: 50%;
  }

  &:hover {
    opacity: 0.5;
  }
}

.newsletter {
  max-width: 450px;

  @include mq(45em, 50em) {
    max-width: 100%;
  }

  h3 {
    margin-bottom: 7px;
  }

  form {
    margin-top: 22px;
  }

  p {
    margin: 0 0 10px;
    font-size: 14px;
  }

  [disabled] {
    opacity: 0.2;
  }

  h3.error {
    color: #ff3c3c;
  }

  input {
    margin: 0;
  }

  .button {
    min-width: 120px;
    width: auto;
    font-size: 14px;
    padding: 8px 10px 10px;
    margin: 17px 0 0;
  }
}

small {
  display: block;
  clear: both;
  padding-top: 30px;
  font-size: 12px;

  img {
    margin-bottom: 24px;
  }
}

@include mq(400px) {
  footer nav > * {
    width: 50%;
    float: left;
  }

  .newsletter .clear {
    p:first-child,
    p:nth-child(2) {
      width: calc(50% - 5px);
      float: left;
    }

    p:nth-child(2) {
      margin-left: 10px;
    }
  }
}

@include mq(550px, 799px) {
  footer nav > * {
    width: 32%;
    float: left;

    &:first-child {
      width: 40%;
    }

    &:last-child {
      width: 28%;
    }
  }
}

@include mq(800px) {
  .newsletter {
    float: right;
    width: 40%;
  }

  nav {
    float: left;
    width: 60%;
  }

  small {
    padding-top: 0;
  }
}

@include mq(1000px) {
  footer nav > * {
    width: 32%;
    float: left;

    &:first-child {
      width: 40%;
    }

    &:last-child {
      width: 28%;
    }
  }
}


</style>
