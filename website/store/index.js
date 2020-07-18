import Vue from 'vue'

export default {
  state() {
    return {
      tours: [],
      detailedTours: [],
      foundShortlistSlugs: [],
      shortlist: null,
      tour: null,
      destinations: [],
      categories: [],
      navigations: null,
      collections: [],
      pages: [],
      offers: [],
      regions: [],
      menu: false,
      destinationTours: {},
      destination: '',
      taxonomy_titles: [],
      search_records: [],
      search_defaults: [],
      form_errors: [],
      search_term: '',
      build: false,
      global: false,
      filters: {
        difficulty: '',
        nights: '',
        guidance: '',
        bike_and_boat: '',
        offers: '',
        countries: []
      },
      sizes: {
        taxonomy: '?fit=crop&w=550&h=400&auto=format',
        tour: '?fit=crop&w=300&h=250',
        inspiration: '?w=600',
        inspiration_large: '?w=800&h=800&fit=crop',
        small: '?w=400',
        itinerary: '?fit=crop&w=400&h=266&crop=edges',
        hero: '?fit=crop&w=1600&h=600&auto=format&q=65'
      }
    }
  },

  getters: {
    currentTours (state) {

      let tourIds = flatten(state.filters.countries.map(t => state.destinationTours['cycling-holidays-' + t.toLowerCase()]))
      tourIds = tourIds.filter(function( element ) {
        return element !== undefined;
      });

      if (!tourIds || !tourIds.length) return []

      const tours = tourIds.map(id => state.tours.find(t => t.id === id))
      return tours.filter(tour => {
        const guidance = state.filters.guidance
        if (guidance) {
          if (guidance === 'self-guided' && tour.guidance === 1) return false
          if (guidance === 'guided' && tour.guidance === 0) return false
        }

        const boat = state.filters.bike_and_boat
        if (boat) {
          if (boat === 'hotel' && tour.bike_and_boat === true) return false
          if (boat === 'boat' && tour.bike_and_boat === false) return false
        }

        const difficulty = state.filters.difficulty
        if (difficulty && tour.difficulty && !tour.difficulty.includes(difficulty)) return false

        if (state.filters.offers && (!tour.offers || !tour.offers.length)) return false

        const nights = state.filters.nights
        if (nights && tour.nights) {
          if (nights === '1-4' && !tour.nights.find(n => [1, 2, 3, 4].includes(n))) return false
          if (nights === '5-8' && !tour.nights.find(n => [5, 6, 7, 8].includes(n))) return false
          if (nights === '9-14' && !tour.nights.find(n => [9, 10, 11, 12, 13, 14].includes(n))) return false
        }

        return true
      })
    },

    shortlistTours (state) {
      if (!state.foundShortlistSlugs.length) return []
      return state.foundShortlistSlugs.map(slug => state.tours.find(t => t.slug === slug)).filter(t => t)
    },

    search_results (state) {
      const term = state.search_term.toLowerCase()
      if (!term) return state.search_defaults
      const primary_points = {
        'destination': 6,
        'region': 5,
        'tour': 3
      }

      const bonus = [3, 2, 1]

      return state.search_records
        .map(record => {
          let points = 0
          const index = record.primary.indexOf(term)
          points += index !== -1 ? (primary_points[record.type] + (bonus[index] || 0) ) : 0
          points += record.secondary && Array.isArray(record.secondary) ? (record.secondary.find(r => r.indexOf(term) !== -1) ? (record.type === 'tour' ? 2 : 1) : 0) : 0
          record.points = points
          return record
        })
        .filter(r => r.points)
        .sort((a, b) => b.points - a.points)
    }
  },

  actions: {
    async nuxtServerInit(store) {
      await store.dispatch('getGlobal')
      await store.dispatch('getNavigations')
      await store.dispatch('getCollections')
    },

    async nuxtClientInit(store) {
      await store.dispatch('getGlobal')
    },

    async getGlobal({ state, commit }) {
      if (state.global) return state.global
      let data

      if (process.server && process.static) {
        const { join, dirname } = require('path')
        const { readFileSync, existsSync } = require('fs')
        const path = join(process.env.dataDir, '/api/v1/global.json')
        if (existsSync(path)) data = JSON.parse(readFileSync(path, 'utf8'))
      }

      if (!data) {
        const res = await this.$axios.get('global')
        data = res.data
      }

      commit('addPopularRecords', data.options.popular_searches)
      commit('addGlobal', data)
      return data
    },

    async getToursForDestination ({ state, commit }, { slug, route = 'destinations' }) {

      if (state.destinationTours[slug]) {
        commit('changeDestination', slug)
        return
      }

      const { data } = await this.$axios.get(`${route}/${slug}`)

      commit('addTours', data.tours)
      commit('changeDestination', slug)
      commit('addTaxonomyTitle', { slug, title: data.name || data.title })
      commit('addDestinationTours', {
        slug,
        tours: data.tours.map(t => t.id)
      })
      return data.tours
    },

    async getToursForCategory ({ state, commit }) {
      let arr = await state.global.destinations.map(i=>i.slug)
      let slugs = await arr.filter(function(elem, index, self) {
        if(elem.includes('cycling-holidays-')){
          return index === self.indexOf(elem);
        }
      });
      await Promise.all(slugs.map(async slug => {
        let tours = await this.$axios.get(`destinations/${slug}`)
        tours = tours.data.tours
        commit('addTours', tours)
        commit('addDestinationTours', { slug, tours: tours.map(t => t.id)})
      }));
    },

    async getTour ({ state, commit }, slug) {
      const detailed = state.detailedTours.find(t => t.slug === slug)
      if (detailed) return commit('setCurrentTour', detailed)

      const standard = state.tours.find(t => t.slug === slug)
      if (standard) {
        commit('setCurrentTour', standard)
        this.$axios.get(`tours/${slug}`)
          .then(({ data }) => {
            commit('addDetailedTour', data)
            commit('setCurrentTour', data)
          });
      } else {
        const { data } = await this.$axios.get(`tours/${slug}`)
        commit('addDetailedTour', data)
        commit('setCurrentTour', data)
      }
    },

    async getDetailedTour ({ state, commit }, slug) {
      const { data } = await this.$axios.get(`tours/${slug}`)
      commit('addDetailedTour', data)
      commit('setCurrentTour', data)
    },

    async getDestinations ({ state, commit }) {
      if (state.destinations.length) return state.destinations

      const { data } = await this.$axios.get('destinations/live')
      commit('addDestinations', data)
      return data
    },

    async getCategories ({ state, commit }) {
      if (state.categories.length) return state.categories

      const { data } = await this.$axios.get('categories')
      commit('addCategories', data)
      return data
    },

    async getNavigations ({ state, commit }) {
      const { data } = await this.$axios.get('navigations')
      commit('addNavigations', data)
      return data
    },

    async getCollections ({ state, commit }) {
      const { data } = await this.$axios.get('homepage-collections')
      commit('addCollections', data)
      return data
    },

    async getRegions ({ state, commit }) {
      if (state.regions.length) return state.regions

      const { data } = await this.$axios.get('regions')
      commit('addRegions', data)
      return data
    },

    async getBuild ({ state, commit }) {
      if (state.build) return state.build
      let data

      if (process.server && process.static) {
        const { join, dirname } = require('path')
        const { readFileSync, existsSync } = require('fs')
        const path = join(process.env.dataDir, '/api/v1/build.json')
        if (existsSync(path)) data = JSON.parse(readFileSync(path, 'utf8'))
      }

      if (!data) {
        const res = await this.$axios.get('build')
        data = res.data
      }

      commit('addBuild', data)
      return data
    },

    async getRecords ({ state, commit }) {
      if (state.search_records.length) return
      const { data } = await this.$axios.get('search')
      data.forEach(record => {
        if (record.primary === 'holland') {
          record.secondary.push('netherlands', 'the netherlands');
        }
      });
      commit('addRecords', data)
    },

    async getPage ({ state, commit }, { slug, section }) {
      if (state.pages[slug]) return state.pages[slug]

      const { data } = await this.$axios.get(`pages/${section ? section + '/' : '' }${slug}`)
      commit('addPage', { slug, data })

      return data
    },

    async getOffer ({ state, commit }, { slug }) {
      if (state.offers[slug]) {
        return state.offers[slug]
      }

      const { data } = await this.$axios.get(`offers/${slug}`)
      commit('addOffer', { slug, data })

      return data
    },

    async getShortlistTours ({ state, commit }) {
      if (!state.shortlist || !state.shortlist.length) return

      const shortlist = state.shortlist.map(String)
      const toFind = shortlist.filter(slug => !state.tours.find(t => t.slug === slug));
      const found = shortlist.filter(slug => state.tours.find(t => t.slug === slug));
      if (!toFind.length) return commit('updateFoundShortlistSlugs', shortlist)

      toFind.forEach(slug => {
        this.$axios.get(`tours/${slug}`)
          .then(res => {
            commit('addTours', [res.data])
            commit('addToFoundShortlistSlugs', slug)
          })
          .catch(e => {
            commit('removeFromFoundShortlistSlugs', slug)
          })
      })
    },

    async checkBooking (store, booking) {
      const { data } = await this.$axios.post('bookings/check', booking)
      return data
    },

    async book (store, booking) {
      const { data } = await this.$axios.post('bookings', booking)
      return data
    }
  },

  mutations: {
    addTours (state, tours) {
      tours.forEach(tour => {
        if (state.tours.find(t => t.id === tour.id)) return
        state.tours.push(tour)
      })
    },

    addDestinationTours (state, { slug, tours }) {
      Vue.set(state.destinationTours, slug, tours)
    },

    addDetailedTour (state, tour) {
      state.detailedTours.push(tour)
    },

    changeDestination (state, destination) {
      state.destination = destination
    },

    setCurrentTour (state, tour) {
      state.tour = tour
    },

    addDestinations (state, destinations) {
      state.destinations = destinations
    },

    addCategories (state, categories) {
      state.categories = categories
    },

    addNavigations (state, navigations) {
      state.navigations = navigations
    },

    addCollections (state, collections) {
      state.collections = collections
    },

    addRegions (state, regions) {
      state.regions = regions
    },

    toggleMenu (state) {
      state.menu = !state.menu
    },

    closeMenu (state) {
      state.menu = false
    },

    changeFilter (state, { type, value }) {
      state.filters[type] = value
    },

    primeShortlist (state) {
      const current = window ? window.localStorage.getItem('holiday_shortlist') : ''
      state.shortlist = current ? current.split(',').map(String) : []
    },

    updateShortlist (state, shortlist) {
      state.shortlist = shortlist
    },

    toggleShortlist (state, slug) {
      if (state.shortlist === null) state.shortlist = []
      if (state.shortlist.includes(slug)) state.shortlist.splice(state.shortlist.indexOf(slug), 1);
      else state.shortlist.push(slug)

      window && window.localStorage.setItem('holiday_shortlist', state.shortlist)
    },

    updateFoundShortlistSlugs (state, slugs) {
      state.shortlist = slugs
      state.foundShortlistSlugs = slugs
    },

    addToFoundShortlistSlugs (state, slug) {
      state.foundShortlistSlugs.push(slug)
    },

    removeFromFoundShortlistSlugs (state, slug) {
      if (state.shortlist.includes(slug)) state.shortlist.splice(state.shortlist.indexOf(slug), 1);
      if (state.foundShortlistSlugs.includes(slug)) state.foundShortlistSlugs.splice(state.foundShortlistSlugs.indexOf(slug), 1);
    },

    addPopularRecords (state, popular) {
      state.search_defaults = popular
    },

    addRecords (state, records) {
      state.search_records = records
    },

    changeSearch (state, term) {
      state.search_term = term
    },

    addBuild (state, data) {
      state.build = data
    },

    addGlobal (state, data) {
      state.global = data
    },

    addFormErrors (state, errors) {
      state.form_errors = errors
    },

    addPage (state, { slug, data }) {
      Vue.set(state.pages, slug, data)
    },

    addOffer (state, { slug, data }) {
      Vue.set(state.offers, slug, data)
    },

    addTaxonomyTitle (state, { slug, title }) {
      Vue.set(state.taxonomy_titles, slug, title)
    },

    resetFilters (state) {
      const filterKeys = Object.keys(state.filters)
      filterKeys.forEach(key => {
        state.filters[key] = ''
      })
    }
  }
}

function flatten(arr){
  let newArray = [];
  for(let i=0; i< arr.length; i++){
      if(Array.isArray(arr[i])){
        newArray =  newArray.concat(flatten(arr[i]))
      }else{
        newArray.push(arr[i])
      }
  }
return newArray;
}
