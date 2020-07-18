<template>
  <header role="banner">

    <div class="wrap">
      <nuxt-link
        to="/"
        class="logo"
      >
        <svg
          width="180"
          height="36"
          viewBox="0 0 180 36"
          xmlns="http://www.w3.org/2000/svg">
          <g
            fill="none"
            fill-rule="evenodd">
            <path
              fill="#FFF"
              d="M0 .72v34.35h6.39V21h10.6v-5.93H6.4V6.64H17.5V.72zM19 35.07h6.23V.72H19zM33.37 19.46h14.06a6.04 6.04 0 0 0-2.24-3.89 7.4 7.4 0 0 0-4.61-1.72 7.66 7.66 0 0 0-4.69 1.75 7 7 0 0 0-2.52 3.86m20.44 1.8c0 .9-.12 1.93-.36 3.1H33.47a7.32 7.32 0 0 0 2.55 4.4 6.79 6.79 0 0 0 4.3 1.52c2.47 0 4.4-1.12 5.77-3.35h6.8a12.23 12.23 0 0 1-4.7 6.46 12.21 12.21 0 0 1-7.66 2.45 12.72 12.72 0 0 1-9.63-3.89 13.26 13.26 0 0 1-3.97-9.7c0-3.85 1.32-7.14 3.97-9.87a12.84 12.84 0 0 1 9.58-4.1c3.63 0 6.77 1.34 9.4 4 2.62 2.66 3.93 5.65 3.93 8.98"
            />
            <path
              fill="#FFF"
              d="M59.79 35.07h-7.37l9.17-13.3L53.6 9.33h6.9l4.73 7.77 4.7-7.77h6.9l-8 12.46 9.28 13.29h-7.37l-5.5-8.81zM77.55 4.11c0-.92.33-1.71.98-2.37a3.17 3.17 0 0 1 2.32-.97 3.28 3.28 0 0 1 3.3 3.35c0 .92-.32 1.71-.96 2.36-.64.66-1.42.98-2.34.98-.9 0-1.67-.32-2.32-.98a3.23 3.23 0 0 1-.98-2.37"/>
            <path
              fill="#FFF"
              d="M77.96 35.07h6.18V9.32h-6.18z"/>
            <path
              fill="#00B3F0"
              d="M94.8 35.07h-6.23V14.93h-3.04V9.32h3.04V.72h6.23v8.6h3.65v5.6H94.8zM104.84 35.07h-6.18V20.65c-.28-8.1 3.48-12.18 11.28-12.21.17 0 .32.02.46.05v5.98c-3.7.13-5.56 2.18-5.56 6.12v14.48z"/>
            <path
              d="M115.45 19.46h14.05a6.04 6.04 0 0 0-2.24-3.89 7.4 7.4 0 0 0-4.6-1.72 7.66 7.66 0 0 0-4.7 1.75 7 7 0 0 0-2.51 3.86m20.44 1.8c0 .9-.12 1.93-.36 3.1h-19.98a7.32 7.32 0 0 0 2.55 4.4 6.79 6.79 0 0 0 4.3 1.52c2.47 0 4.4-1.12 5.77-3.35h6.8a12.23 12.23 0 0 1-4.7 6.46 12.21 12.21 0 0 1-7.67 2.45 12.72 12.72 0 0 1-9.63-3.89 13.26 13.26 0 0 1-3.96-9.7c0-3.85 1.32-7.14 3.96-9.87a12.84 12.84 0 0 1 9.58-4.1c3.64 0 6.77 1.34 9.4 4 2.63 2.66 3.94 5.65 3.94 8.98M143.92 35.07h-6.23V.72h6.23v20.7l8.22-12.1h7.13L150 21.93l10.45 13.14h-7.75L143.92 23z"
              fill="#00B3F0"/>
            <path
              d="M158.34 26.98h5.72c.58 2.2 2.23 3.3 4.94 3.3 1.55 0 2.59-.25 3.12-.75.53-.5.8-1.12.8-1.88 0-.75-.3-1.35-.9-1.8-.6-.44-2.49-.96-5.64-1.54-2.27-.76-3.88-1.56-4.85-2.42a6.95 6.95 0 0 1-2.31-5.46c0-2.23.83-4.12 2.5-5.67 1.66-1.54 4.04-2.31 7.13-2.31 3.05 0 5.39.75 7 2.26a7.91 7.91 0 0 1 2.58 5.61h-6.08c-.28-1.47-1.46-2.21-3.55-2.21-1.38 0-2.29.2-2.73.62-.45.41-.67.93-.67 1.54 0 1.03 1.22 1.82 3.65 2.37l2.89.57c2.3.75 3.88 1.5 4.73 2.21a6.87 6.87 0 0 1 2.43 5.51c0 2.48-.92 4.6-2.76 6.36-1.84 1.77-4.29 2.17-7.6 2.14-2.6-.02-5.03-.2-6.53-1.12a7.89 7.89 0 0 1-2.84-3.15 11.78 11.78 0 0 1-1.03-4.18"
              fill="#00B3F0"/>
          </g>
        </svg>
      </nuxt-link>
      <p class="strapline">The best cycling holidays in Europe.</p>

      <div
        v-show="!mobileMenuOpen"
        class="mobile-search-icon"
        @click="searchOpen = true">
        <img src="~/assets/images/search.svg">
      </div>

      <f-navicon
        :active="mobileMenuOpen"
        @click="$store.commit('toggleMenu')"
      />

      <div
        :class="{
          secondary: true,
          mobile: true,
          inactive: !mobileMenuOpen
        }"
      >
        <div
          v-for="category in ['destinations', 'categories', 'special offers', 'information']"
          :key="category"
          class="top-nav-container"
        >
          <p
            class="category-title"
            @click="mobilevar_category === category ? mobilevar_category = '' : mobilevar_category = category"
          >{{ category }}</p>
          <div
            v-for="column in ['column_1', 'column_2', 'column_3']"
            v-show="mobilevar_category === category"
            :key="column"
            class="category-column"
          >
            <div
              v-show="navigations[category][column].title"
              class="category-column-title"
              @click="onMobileBar(category, column)"
            >{{ navigations[category][column].title }}
            </div>
            <div
              v-for="item in navigations[category][column].links"
              :key="item.title"
            >
              <nuxt-link
                :to="item.url"
                class="link-item"
              >
                <img
                  src="/images/position.png"
                  class="map-icon"
                >
                <p class="meganav-title">{{ item.title }}</p>
              </nuxt-link>
            </div>
          </div>
        </div>

        <div
          v-for="contact in contactList"
          :key="contact.country"
          :class="['contact-info', {'email-info': contact.type === 'mailto'}, {'phone-info': contact.type === 'tel'}]"
        >
          <div
            class="contact-title"
            style="color: #00B3F0"
          > {{ contact.title }} </div>
          <a
            :href="`${contact.type}:${contact.link}`"
            :class="['contact-link', contact.country]"
            style="color: white"
          >{{ contact.link }}</a>
        </div>
      </div>
      <div
        :class="{
          secondary: true,
          desktop: true,
          inactive: !mobileMenuOpen
        }"

        @click="menuItemClicked"
        @mouseleave="mouseLeave"
      >

        <div class="search">
          <div class="search-content">
            <div class="search-container">
              <p
                class="parent-title"
                @mouseover="mouseOver('destinations')"
              >Destinations</p>
              <p
                class="parent-title"
                @mouseover="mouseOver('categories')"
              >Categories</p>
              <p
                class="parent-title"
                @mouseover="mouseOver('special offers')"
              >Special Offers</p>
              <p
                class="parent-title"
                @mouseover="mouseOver('information')"
              >Information</p>
            </div>
            <div class="search-form-container">
              <f-search />
            </div>
            <nuxt-link
              v-show="showShortlist"
              :to="{ name: 'shortlist' }"
              class="shortlist"
            >
              <small>({{ shortlist }})</small> Shortlisted tour{{ shortlist === 1 ? '' : 's' }}
            </nuxt-link>
          </div>

        </div>

        <div
          v-show="active && navigations"
          class="meganav">
          <div class="clear">
            <div class="column-titles">
              <div
                v-for="column in ['column_1', 'column_2', 'column_3']"
                :key="column"
                class="col-title"
              >
                <span v-show="active && navigations[active][column].title !== 'null'">{{ active && navigations[active][column].title }}</span>
              </div>
            </div>
            <div class="column-content">
              <div
                v-for="column in ['column_1', 'column_2', 'column_3']"
                :key="column"
                class="column-container"
              >
                <div
                  v-for="range in [0, 10]"
                  :key="range"
                  style="flex: 1"
                >
                  <div
                    v-for="item in active && navigations[active][column].links.slice(range, range + 10)"
                    :key="item.title"
                  >
                    <div @click="active = null">
                      <nuxt-link
                        :to="item.url"
                        class="link-item"
                      >
                        <img
                          src="/images/position.png"
                          class="map-icon"
                        >
                        <p class="meganav-title">{{ item.title }}</p>
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav>
          <div class="feefo">
            <a
              href="https://www.feefo.com/reviews/flexitreks"
              target="_blank"
            >
              <img
                alt="Feefo logo"
                border="0"
                src="https://api.feefo.com/api/logo?merchantidentifier=flexitreks"
                title="See what our customers say about us"
              >
            </a>
          </div>

          <div
            v-tap-menu
            v-popover:foo.bottom
            class="contact-us"
          >
            <button
              type="button"
              class="button button--blue"
            >Contact us</button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Mobile search -->
    <div
      v-show="!mobileMenuOpen"
      :class="{
        mobile: true,
        'mobile-search-bar': true,
        active: !mobileMenuOpen && searchOpen
      }"
    >
      <div>
        <f-search v-show="searchOpen"/>
        <img
          v-show="searchOpen"
          src="~/assets/images/close.png"
          class="close-btn"
          @click="searchOpen = false"
        >
      </div>
    </div>

    <popover
      v-show="contactsOpen"
      :pointer="false"
      name="foo"
    >
      <div
        v-show="contactsOpen"
        :class="{
          'contact-us-form': true,
          'tap-menu-open': true
        }"
      >
        <div
          v-for="contact in contactList"
          :key="contact.country"
          :class="['contact-info', {'email-info': contact.type === 'mailto'}, {'phone-info': contact.type === 'tel'}]"
        >
          <div class="contact-title"> {{ contact.title }} </div>
          <a
            :href="`${contact.type}:${contact.link}`"
            :class="['contact-link', contact.country]">{{ contact.link }}</a>
        </div>
      </div>
    </popover>

  </header>
</template>

<script>
import FNavicon from './Navicon'
import FSearch from './Search'

export default {
  name: 'FHeader',
  async asyncData({ store }) {
    await store.dispatch('getNavigations')
  },
  components: {
    FNavicon,
    FSearch
  },

  data () {
    return {
      destinationsMenuOpen: false,
      contactsOpen: false,
      active: null,
      mobilevar_category: '',
      mobilevar_column: '',
      searchOpen: false,
      contactList: [
        {
          type: 'mailto',
          title: 'Email',
          link: 'info@flexitreks.com',
          country: 'all'
        },
        {
          type: 'tel',
          title: 'Call 9AM to 10PM today',
          link: '+44 (0)1273 410 550',
          country: 'britain'
        },
        {
          type: 'tel',
          title: 'Call toll free from 9am EST',
          link: '1-800-1234-5678',
          country: 'usa'
        },
        {
          type: 'tel',
          title: 'Call toll free to Australia',
          link: '1-800-1234-5678',
          country: 'australia'
        }
      ]
    }
  },

  computed: {
    navigations () {
      return this.$store.state.navigations
    },

    mobileMenuOpen () {
      return this.$store.state.menu
    },

    shortlist () {
      return this.$store.state.shortlist ? this.$store.state.shortlist.length : 0
    },

    destinations () {
      return this.$store.state.global.destinations
    },

    showShortlist () {
      return this.shortlist && this.$route.name !== 'shortlist'
    },

    hideSearch () {
      return ['index', 'booking', 'booking-review'].includes(this.$route.name)
    }
  },

  watch: {
    '$route': function () {
      this.$store.commit('closeMenu')
    }
  },

  mounted () {
    this.$store.commit('primeShortlist')
    this.contactsOpen = true
  },

  methods: {
    menuItemClicked (event) {
      if (event.target.nodeName === 'A' && this.mobileMenuOpen) this.$store.commit('closeMenu')
    },
    mouseOver: function(x){
      this.active = x
    },
    mouseLeave: function(){
        this.active = null
    },
    onMobileBar(category, column) {
      if(this.mobilevar_category === category && this.mobilevar_column === column){
        this.mobilevar_column = 0
      }else {
        this.mobilevar_category = category;
        this.mobilevar_column = column
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

[role=banner] {
  background: $dark-blue;
  position: fixed;
  will-change: transform;
  color: #FFF;
  width: 100%;
  z-index: 100;
  left: 0;
  top: 0;
}

.wrap {
  padding-top: 16px;
  padding-bottom: 9px;

  @include mq(40em) {
    padding-top: 11px;
    padding-bottom: 4px;
  }
}

.logo {
  width: 120px;
  height: 24px;
  display: inline-block;

  svg {
    width: 100%;
    height: auto;
  }
}

.button,
.strapline {
  display: none;
}

.orange-link {
  font-size: 1em;
}

hr {
  margin: 20px -15px;
}

.mobile-search-icon {
  width: 32px;
  float: right;
  margin-right: 40px;
  margin-top: 3px;
  cursor: pointer;

  img {
    margin: auto;
  }

  @include mq(40em) {
    display: none;
  }
}

.mobile.mobile-search-bar {
  display: none;

  &.active {
    display: inline-block;

    @include mq(40em) {
      display: none;
    }
  }
}

.top-nav-container {
  margin-top: 12px;

  .category-title {
    color: #00B3EF;
    font-weight: 600;
    text-transform: capitalize;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .category-column {
    flex: 1;
    font-weight: 700;

    .category-column-title {
      font-size: 15px;
      color: orange;
      margin-bottom: 10px;
    }

    .link-item {
      display: flex;
      flex-direction: row;
    }
  }
}

.secondary {
  background: #FFF;
  position: absolute;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 11px 15px 14px;
  z-index: 100;
  color: $copy;
  width: 100%;
  left: 0;
  top: 100%;
  transition: 300ms opacity, 300ms visibility;

  &.inactive {
    opacity: 0;
    visibility: hidden;
  }
}

.destinations__dropdown {
  display: block;
  margin-top: 10px;

  div {
    display: none;

    @include mq(40em) {
      &.tap-menu-open {
        display: block;
      }
    }
  }

  &--up {
    margin-top: -22px;
  }
}

.shortlist {
  float: right;
  color: #FFF;
  background: $light-blue;
  font-size: 0.722em;
  font-weight: 400;
  padding: 0.25em 1.2em;
  margin-top: 16px;
  border-radius: 3px;

  small {
    margin-right: 4px;
  }
}

@include mq(40em, 'true') {
  .search-inputs {
    box-shadow: 0 0 0 1px $line;
    border-radius: 3px;
    margin-top: 4px;
  }
}

@include mq(40em) {
  [role=banner] {
    padding: 11px 0;
  }

  .logo {
    width: 180px;
    height: 36px;
  }

  .secondary {
    position: static;
    box-shadow: none;
    background: none;
    padding: 0;
    width: auto;
    float: right;

    &.inactive {
      opacity: 1;
      visibility: visible;
    }

    .contact-us,
    .contact-us .button {
      display: inline-block;
    }
  }

  nav {
    position: relative;
  }

  hr {
    display: none;
  }

  .navicon {
    display: none;
  }

  .search {
    background: $light-blue;
    position: absolute;
    height: 61px;
    width: 100%;
    left: 0;
    top: 100%;

    > div {
      max-width: 1310px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 15px;
      padding-right: 15px;
    }

    form {
      float: left;
      width: 100%;
      max-width: 407px;
      position: relative;
      margin-top: 9px;
    }

    .search-content {
      display: flex;

      .search-container {
        display: flex;
        flex:1;
        margin-top: 20px ;
        justify-content: space-around;

        .parent-title {
          color: white;
          flex: 1;

          img {
            float: left;
            margin-right: 10px;
          }

          @include mq(60em, 'true') {
            font-size: 14px;
          }

          @include mq(50em, 'true') {
            font-size: 13px;
          }

          @include mq(45em, 'true') {
            font-size: 12px;
          }
        }
      }

      .search-form-container {
        width: 355px;

        @include mq(60em, 'true') {
          width: 250px;
        }
      }
    }
  }

  .shortlist {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.3em 1.2em;
    margin-top: 18px;
  }

  .contact-us-form,
  .destinations__dropdown div {
    display: none;
    position: absolute;
    background: #FFF;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    right: 0;
    transition: 300ms opacity, 300ms visibility;
    white-space: nowrap;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 5px;
      background: transparent;
      bottom: 100%;
      left: 0;
    }
  }

  .orange-link {
    color: #FFF;
    border: none;
    font-size: 13px;
    font-weight: 400;
    margin-right: 30px;
  }

  .destinations__dropdown {
    display: inline-block;
    position: relative;
    margin-top: 0;

    & > a {
      position: relative;
      padding-right: 22px;

      &:after {
        content: '';
        position: absolute;
        right: 2px;
        top: 2px;
        width: 9px;
        height: 9px;
        border-bottom: 2px solid $light-blue;
        border-right: 2px solid $light-blue;
        transform: rotate(45deg);
        transition: 300ms transform;
      }
    }

    div {
      font-size: 14px;
      width: 50vw;
      max-width: 591px;
      padding: 20px 23px;
      margin: 13px 0 0 0;

      h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 28px;
      }

      &::before {
        height: 13px;
      }

      img {
        vertical-align: middle;
        margin-right: 5px;
        display: inline;
      }

      ul {
        margin: 0;
        column-count: 2;
        column-gap: 20px;

        @include mq(70em) {
          column-gap: 80px;
        }
      }

      li {
        list-style: none;
        break-inside: avoid;
        margin: 0 0 14px;
      }

      a {
        transition: 300ms color;
      }

      a:hover {
        color: $light-blue;
      }
    }

    &.tap-menu-open > a:after {
      transform: translateY(4px) rotate(-135deg);
    }
  }
}

@include mq(60em) {
  .strapline {
    display: inline-block;
    margin: 0 0 0 48px;
    position: relative;
    font-size: 16px;
    top: -9px;
  }

  .destinations__dropdown div {
    padding: 40px 43px 35px;
  }
}

.contact-us {
  @include mq(40em, 'true') {
    display: none;
  }
  .button {
    font-weight: 700;
    font-size: 14px;
    width: 156px;
  }
}

.contact-us-form {
  width: 330px;
  padding: 18px 22px;
  margin: 17px 0 0 0;
  font-size: 16px;

  @include mq(40em) {
    &.tap-menu-open {
      display: block;
    }
  }
}

.contact-info {
  padding-left: 42px;
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 5px;
  }

  &.email-info {
    margin-top: 30px;
    background: url('~/assets/images/email.svg') left bottom no-repeat;
  }

  &.phone-info {
    background: url('~/assets/images/phone.svg') left bottom no-repeat;
    a.contact-link {
      padding-left: 44px;
      background-position: left center;
      background-repeat: no-repeat;
      &.britain {
        background-image: url('~/assets/images/britain-flag.svg');
        padding-left: 37px;
      }
      &.usa {
        background-image: url('~/assets/images/usa-flag.svg');
      }
      &.australia {
        background-image: url('~/assets/images/australia-flag.svg');
      }
    }
  }
  .contact-title {
    font-size: 14px;
    color: #52869b;
    font-weight: 700;
    line-height: 26px;
  }
  a.contact-link {
    display: block;
    color: $light-blue;
    font-size: 18px;
    font-weight: 300;
    line-height: 18px;
    transition: 300ms color;
    margin-top: 2px;
    &:hover {
      color: $light-blue;
    }
  }
}

.feefo {
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
  @include mq(40em, 'true') {
    display: none;
  }
}

.desktop {
  display: inline-block;
  @include mq(40em, 'true') {
    display: none;
  }
}

.mobile {
  display: none;
  background-color: #003150;
  color: #fff;

  &.secondary {
    background-color: #003150;
  }

  @include mq(40em, 'true') {
    display: inline-block;
    background-color: #00A8EC;
    padding: 10px 15px;
    width: 100%;
  }
}

.search-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 12px;

  img {
    margin-left: 8px;
  }

  span {
    margin-left: 12px;
  }
}

.meganav {
    position: absolute;
    height: 390px;
    width: 100%;
    left: 0;
    top: 140px;
    background: #edf4f6;

    > div {
      max-width: 1310px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 15px;
      padding-right: 15px;
    }
  }

  .column-titles {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    .col-title {
      flex: 1;
      margin-top: 20px;
      font-weight: 700;
    }
  }

  .column-content {
    display: flex;
    flex:1;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 20px;

    .column-container {
      color: #44687f;
      flex: 1;
      flex-direction: row;
      display: flex;

      .link-item {
        display: flex;
        flex-direction: row;
      }
    }
  }

  .meganav-title {
    line-height: 8px;
    @include mq(40em, 'true') {
      font-size: 13px;
      font-weight: 300;
      margin-top: -2px;
    }
  }
  .map-icon {
    width: 12px;
    height: 18px;
    margin-top: -6px;
    margin-right: 6px;
    @include mq(40em, 'true') {
      width: 10px;
      height: 15px;
    }
  }
  .row {
    display: flex;
    flex-direction: row
  }

.close-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 24px;
  bottom: 20px;
}

[data-popover='foo'] {
  background:transparent;
  margin-top: -5px;
}

</style>
