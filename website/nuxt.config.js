const pkg = require('./package')

// const API_URL = 'https://api.flexitreksapi.com/api/v1/'
const API_URL = 'http://localhost:8080/api/v1/'

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | Flexitreks` : 'Flexitreks';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Flexitreks offers over 160 cycling holidays in Europe. Self Guided and guided options as well as bike & boat holidays and short breaks.' },
      { hid: 'og:description', property: 'og:description', content: 'Flexitreks offers over 160 cycling holidays in Europe. Self Guided and guided options as well as bike & boat holidays and short breaks.' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Flexitreks offers over 160 cycling holidays in Europe. Self Guided and guided options as well as bike & boat holidays and short breaks.' },
      { name: 'apple-mobile-web-app-title', content: 'Flexitreks' },
      { name: 'application-name', content: 'Flexitreks' },
      { name: 'msapplication-TileColor', content: '#003150' },
      { name: 'theme-color', content: '#003150' },
      { property: 'og:site_name', content: 'Flexitreks' },
      { property: 'og:locale', content: 'en_GB' },
      { property: 'article:publisher', content: 'https://www.facebook.com/flexitreksltd' },
      { name: 'twitter:site', content: '@flexitreks' },
      { name: 'twitter:creator', content: '@flexitreks' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image:alt', content: 'Flexitreks' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:image', content: 'https://flexitreks.netlify.com/images/og.jpg' },
      { name: 'twitter:image', content: 'https://flexitreks.netlify.com/images/og.jpg' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Libre+Baskerville:400i|Montserrat:300,400,500,600' },
      { rel: 'stylesheet', type: 'text/css', href: '/print.css', media: 'print' },
      { rel: 'icon', type: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
    ],
    script: [
      { type: 'text/javascript', src: 'https://polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,Object.entries', async: true }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  router: {
    fallback: true,

    extendRoutes(routes, resolve) {
      routes.push({
        name: 'explore-slug',
        path: '/explore/:slug',
        component: resolve(__dirname, 'pages/_slug.vue')
      })
    }
  },

  /*
  ** Global CSS
  */
  css: [
    {
      src: '~/assets/scss/global/global.scss',
      lang: 'scss'
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-siema', ssr: false },
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
    { src: '~/plugins/tap-menu.js', ssr: false },
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/popover.js', ssr: false}
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: API_URL
  },

  /**
   * Environment variables
   *
   * https://nuxtjs.org/api/configuration-env
   */
  env: {
    dataDir: './dist/data'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.node = {fs: 'empty'}
    },

    extractCSS: true

  },

  generate: {
    fallback: '404.html',
    interval: 100,
    routes: async () => {
      const axios = require('axios')
      const mkdirp = require('mkdirp-promise')
      const { join, dirname } = require('path')
      const { writeFileSync } = require('fs')

      const routes = []
      const [pages, destinations, regions, search, tours, offers, categories] = await Promise.all([
        axios.get(API_URL + 'pages'),
        axios.get(API_URL + 'destinations/live'),
        axios.get(API_URL + 'regions'),
        axios.get(API_URL + 'search'),
        axios.get(API_URL + 'tours'),
        axios.get(API_URL + 'offers/public'),
        axios.get(API_URL + 'categories'),
      ])

      pages.data.forEach(page => routes.push({
        route: `${page.section ? '/' + page.section : ''}/${page.slug}`
      }))

      destinations.data.forEach(destination => routes.push({
        route: `destinations/${destination.slug}`
      }))

      regions.data.forEach(region => routes.push({
        route: `regions/${region.slug}`
      }))

      tours.data.forEach(tour => routes.push({
        route: `tours/${tour.slug}`
      }))

      offers.data.forEach(offer => routes.push({
        route: `offers/${offer.slug}`
      }))

      categories.data.forEach(category => routes.push({
        route: `categories/${category.slug}`
      }))

      const path = `dist/data/api/v1/search.json`
      mkdirp(dirname(path)).then(() => {
        writeFileSync(path, JSON.stringify(search.data))
      })

      return routes
    }
  },

  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => {
        if (type === 'script') {
          if ([
            'pages/shortlist.js',
            'pages/regions/index.js',
            'pages/booking/review.js',
            'pages/booking/pick.js',
            'pages/booking/success.js',
            'pages/offers/_slug.js',
            'pages/payments/failure.js',
            'pages/payments/success.js',
            'pages/regions/_slug.js',
            'pages/contact.js',
            'pages/destinations/index.js',
            'pages/categories/index.js',
            'pages/payments/index.js',
            'pages/booking/failure.js',
            'pages/payments/success.js'
          ].includes(file)) {
            return false
          }
        }
        return true
      }
    }
  }
}
