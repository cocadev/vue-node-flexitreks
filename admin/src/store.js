import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    operators: [],
    regions: [],
    destinations: [],
    hotels: [],
    restaurants: [],
    room_types: [],
    accommodation_categories: [],
    decks: [],
    tours: [],
    images: [],
    sizes: {
      'thumbnail': '?fit=crop&w=300&h=300'
    }
  },

  actions: {
    async getDestinations ({ state, commit }) {
      if (state.destinations.length) return state.destinations
      const { data } = await Vue.axios.get('/destinations')
      commit('addDestinations', data)
      return data
    },

    async getRegions ({ state, commit }) {
      if (state.regions.length) return state.regions
      const { data } = await Vue.axios.get('/regions')
      commit('addRegions', data)
      return data
    },

    async getOperators ({ state, commit }) {
      if (state.operators.length) return state.operators
      const { data } = await Vue.axios.get('/operators')
      commit('addOperators', data)
      return data
    },

    async getHotels ({ state, commit }) {
      if (state.hotels.length) return state.hotels
      const { data } = await Vue.axios.get('/hotels')
      commit('addHotels', data)
      return data
    },

    async getRestaurants ({ state, commit }) {
      if (state.restaurants.length) return state.restaurants
      const { data } = await Vue.axios.get('/restaurants')
      commit('addRestaurants', data)
      return data
    },

    async getRoomTypes ({ state, commit }) {
      if (state.room_types.length) return state.room_types
      const { data } = await Vue.axios.get('/room-types')
      commit('addRoomTypes', data)
      return data
    },

    async getAccommodationCategories ({ state, commit }) {
      if (state.room_types.length) return state.room_types
      const { data } = await Vue.axios.get('/accommodation-categories')
      commit('addAccommodiationCategories', data)
      return data
    },

    async getDecks ({ state, commit }) {
      if (state.decks.length) return state.decks
      const { data } = await Vue.axios.get('/decks')
      commit('addDecks', data)
      return data
    },

    async getTours ({ state, commit }) {
      if (state.tours.length) return state.tours
      const { data } = await Vue.axios.get('/tours')
      commit('addTours', data)
      return data
    },

    error ({ commit }, e) {
      if (Array.isArray(e)) {
        e.forEach(error => Vue.toasted.error(error.msg))
      } else {
        if (typeof e === 'object') {
          Object.keys(e).forEach(key => Vue.toasted.error(e[key].msg))
        } else {
          Vue.toasted.error(e)
        }
      }
    }
  },

  mutations: {
    addDestinations (state, destinations) {
      state.destinations = destinations
    },

    addRegions (state, regions) {
      state.regions = regions
    },

    addOperators (state, operators) {
      state.operators = operators
    },

    addHotels (state, hotels) {
      state.hotels = hotels
    },

    addRestaurants (state, restaurants) {
      state.restaurants = restaurants
    },

    addRoomTypes (state, room_types) {
      state.room_types = room_types
    },

    addAccommodiationCategories (state, accommodation_categories) {
      state.accommodation_categories = accommodation_categories
    },

    addDecks (state, decks) {
      state.decks = decks
    },

    addTours (state, tours) {
      state.tours = tours
    },

    addImages (state, images) {
      images.forEach(i => {
        if (state.images.find(s => s.id === i.id)) return
        state.images.push(i)
      })
    }
  }
})
