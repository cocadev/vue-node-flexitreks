<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season && seasonData">
      <div v-if="!seasonData.model">
        <router-link :to="{ name: 'tour-seasons', params: { id: tour.id }, query }">Click here to add a pricing model for this season</router-link>
      </div>
      <div v-else>
        <header>
          <h3>Model {{ seasonData.model.name }} <span v-if="seasonData.currency">- {{ seasonData.currency.name }} &times;{{ seasonData.currency.rate }}</span></h3>
        </header>
        <template v-if="seasonData.model && seasonData.currency">
          <find-and-replace :markupType="markupType" :rates="seasonData.model.rates" @adjustCommission="adjustCommission" @submit="findAndReplace" @adjustPrices="adjustPrices" />

          <form @submit.prevent="save" id="tour-form" ref="form">
            <div class="clear save-container save-top">
              <scary-button
                @click="save"
              />
            </div>
            <tour-pricing
              :value="groups"
              :rooms="rooms"
              :ac="ac"
              :boats="boats"
              :routes="tour.routes"
              :decks="decks"
              :seasonData="seasonData"
              :errorPriceId="errorPriceId"
              @addPrice="addPrice"
              @removePrice="removePrice"
              @addGroup="addGroup"
              @removeCategories="removeCategories"
              @duplicateGroup="duplicateGroup"
              @addCategory="addCategory"
            />
            <div class="clear save-container save-bottom">
              <scary-button
                @click="save"
              />
            </div>
          </form>

          <hr>
          <form @submit.prevent="duplicateRows" class="duplicate">
            <input v-model="duplicate" type="number" min="1">
            <input type="submit" class="button" value="Duplicate Multiple Groups">
          </form>
          <copy-from @change="copyFromSeason" pageType="pricing" />
        </template>
        <template v-else>
          <p class="error">Error: Missing 'Model' or 'Currency' data for this season</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import FindAndReplace from '@/components/FindAndReplace'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import TourPricing from '@/components/tours/TourPricing'
import CopyFrom from '@/components/tours/CopyFrom'
import Thyme from '@trys/thyme'
import ScaryButton from '@/components/ScaryButton'

export default {
  data () {
    return {
      tour: null,
      groups: [],
      rooms: [],
      ac: [],
      boats: [],
      decks: [],
      removedCategories: [],
      duplicate: 5,
      seasonData: null,
      models: [],
      currencies: [],
      markupType: 'markup',
      errorPriceId: null,
      noSaving: false
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    FindAndReplace,
    TourNav,
    TourPricing,
    FButton,
    CopyFrom,
    ScaryButton
  },

  watch: {
    season () {
      this.fetchSeason()
    }
  },

  computed: {
    season () {
      return Number(this.$route.query.season) || ''
    },

    query () {
      if (!this.$route.query || !this.$route.query.season) return ''
      return { season: this.$route.query.season }
    }
  },

  created () {
    this.fetchSeason()

    const tour = this.axios.get(`tours/${this.id}`)
    const rooms = this.axios.get('room-types')
    const ac = this.axios.get('accommodation-categories')
    const boats = this.axios.get('boats')
    const decks = this.axios.get('decks')
    const currencies = this.axios.get('currencies')
    const models = this.axios.get('models')

    Promise.all([tour, rooms, ac, boats, decks, currencies, models])
      .then(([tour, rooms, ac, boats, decks, currencies, models]) => {
        this.tour = tour.data
        this.rooms = rooms.data
        this.ac = ac.data
        this.boats = boats.data
        this.decks = decks.data
        this.currencies = currencies.data
        this.models = models.data
      })
  },

  methods: {
    prepareGroups (categories) {
      let result = categories.reduce((collector, cat) => {
        let relatedCat = {
          start: cat.start,
          end: cat.end,
          category_id: cat.id
        }
        let copyPrices = JSON.parse(JSON.stringify(cat.prices))
        delete cat['id']
        delete cat['start']
        delete cat['end']
        delete cat['createdAt']
        cat.prices = cat.prices.map((price, idx) => {
          delete price['id']
          delete price['category']
          delete price['createdAt']
          price['idx'] = idx
          return price
        })
        let catStr = JSON.stringify(cat)
        let idx = collector.catStrs.indexOf(catStr)
        if (idx !== -1) {
          collector.catGroups[idx].relatedCats.push(relatedCat)
          if (relatedCat.category_id) {
            collector.catGroups[idx].prices = collector.catGroups[idx].prices.map((price, idx) => {
              let copyPrice = copyPrices[idx]
              price['ids'][relatedCat.category_id] = copyPrice.id
              return price
            })
          }
        } else {
          collector.catStrs.push(catStr)
          cat.relatedCats = [relatedCat]
          if (relatedCat.category_id) {
            cat.prices = cat.prices.map((price, idx) => {
              let copyPrice = copyPrices[idx]
              price['ids'] = {}
              price['ids'][relatedCat.category_id] = copyPrice.id
              return price
            })
          }
          collector.catGroups.push(cat)
        }
        return collector
      }, { catStrs: [], catGroups: [] })
      return result.catGroups
    },

    groupFromCategory (cat) {
      let relatedCat = {
        start: cat.start,
        end: cat.end,
        category_id: cat.id
      }
      delete cat['id']
      delete cat['start']
      delete cat['end']
      cat.relatedCats = [relatedCat]
      cat.prices = cat.prices.map((price, idx) => {
        if (relatedCat.category_id) {
          price['ids'] = {}
          price['ids'][relatedCat.category_id] = price.id
        }
        delete price['id']
        delete price['category']
        delete price['createdAt']
        price['idx'] = idx
        return price
      })
      return cat
    },

    categoryfromGroup (groupIdx, catIdx) {
      let result = {
        id: this.groups[groupIdx].relatedCats[catIdx].category_id,
        start: this.groups[groupIdx].relatedCats[catIdx].start,
        end: this.groups[groupIdx].relatedCats[catIdx].end,
        ...this.groups[groupIdx]
      }
      delete result['relatedCats']
      let copyPrices = JSON.parse(JSON.stringify(result.prices))
      result.prices = copyPrices.map(price => {
        if (result.id) {
          if (price.ids && price.ids[result.id]) {
            price['id'] = price.ids[result.id]
          }
        }
        delete price['ids']
        delete price['idx']
        return price
      })
      return result
    },

    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-pricing/${this.id}/${this.season}`)
          .then((res) => {
            this.groups = this.prepareGroups(res.data.map(this.formatCategory))
          })

        this.seasonData = null
        this.axios.get(`tour-seasons/${this.id}/${this.season}`)
          .then((res) => {
            this.seasonData = res.data
          })
      }
    },

    formatCategory (cat) {
      if (cat.restricted_dates === null) cat.restricted_dates = []
      if (cat.restricted_days === null) cat.restricted_days = []
      if (cat.specific_dates === null) cat.specific_dates = []

      cat.restricted_dates = cat.restricted_dates.map(d => new Thyme(d))
      cat.specific_dates = cat.specific_dates.map(d => new Thyme(d))

      if (cat.start) cat.start = new Thyme(cat.start).toString()
      if (cat.end) cat.end = new Thyme(cat.end).toString()

      cat.prices.forEach(price => {
        if (price.category) delete price.category
      })

      return cat
    },

    addCategory (groupIdx) {
      let cats = this.groups[groupIdx].relatedCats
      let start = cats[cats.length - 1].end
      this.groups[groupIdx].relatedCats.push({
        start: start,
        end: ''
      })
    },

    addGroup () {
      const prev = this.groups.length ? this.groups[this.groups.length - 1] : {}
      const selSeason = this.tour.allSeasons.filter(s => s.id === this.season)[0].name
      let start = new Thyme(selSeason + '-05-01')
      let prevEnd = prev.relatedCats ? prev.relatedCats[prev.relatedCats.length - 1].end : null
      if (prevEnd) {
        const d = new Thyme(prevEnd)
        d.add(1)
        start = d.toString()
      }

      let nights = prev.nights || null
      let boat_id = prev.boat_id || null
      let tour_route_id = prev.tour_route_id || null
      let guided = prev.guided || prev.guided === false ? prev.guided : null
      let prices = []
      let restricted_days = []

      if (prev.prices && prev.prices.length) {
        prices = prev.prices.map((p, i) => {
          return {
            cost: 0,
            room_type_id: p.room_type_id,
            accommodation_category_id: p.accommodation_category_id,
            deck_id: p.deck_id,
            formula: '',
            gross: null,
            non_com: 0,
            markup_rate_id: p.markup_rate_id,
            net: null,
            adjustment: 0,
            idx: i
          }
        })
      }

      if (prev.restricted_days && prev.restricted_days.length) restricted_days = [...prev.restricted_days]
      const group = {
        relatedCats: [{ start: start, end: start }],
        nights,
        boat_id,
        tour_route_id,
        guided,
        prices,
        specific_dates: [],
        restricted_dates: [],
        restricted_days
      }

      this.groups.push(group)
      this.noSaving = true
    },

    duplicateGroup (idx) {
      let prev = this.groups[idx]
      let clone = JSON.parse(JSON.stringify(prev))
      delete clone['id']
      delete clone['tour_season_id']
      clone.relatedCats = clone.relatedCats.map(cat => {
        delete cat['category_id']
        return cat
      })
      if (prev.prices && prev.prices.length) {
        clone.prices = prev.prices.map((p, i) => {
          return {
            cost: 0,
            room_type_id: p.room_type_id,
            accommodation_category_id: p.accommodation_category_id,
            deck_id: p.deck_id,
            formula: '',
            gross: null,
            non_com: 0,
            markup_rate_id: p.markup_rate_id,
            net: null,
            adjustment: 0,
            idx: i
          }
        })
      }
      this.groups.push(clone)
      this.noSaving = true
    },

    removeCategory (groupIdx, catIdx) {
      let removedCat = this.categoryfromGroup(groupIdx, catIdx)
      if (removedCat.id) this.removedCategories.push(removedCat)
      this.noSaving = true
    },

    removeCategories (groupIdx, catIdx) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (this.groups[groupIdx] && !catIdx && catIdx !== 0) {
              this.groups[groupIdx].relatedCats.map((cat, idx) => {
                this.removeCategory(groupIdx, idx)
              })
              this.groups.splice(groupIdx, 1)
            }
            if (this.groups[groupIdx] && this.groups[groupIdx].relatedCats[catIdx]) {
              this.removeCategory(groupIdx, catIdx)
              this.groups[groupIdx].relatedCats.splice(catIdx, 1)
              if (!this.groups[groupIdx].relatedCats.length) {
                this.groups.splice(groupIdx, 1)
              } else {
                this.$set(this.groups, groupIdx, this.groups[groupIdx])
              }
            }
          }
        })
    },

    addPrice (index) {
      const group = this.groups[index]
      if (!group) return
      const prev = group.prices.length ? group.prices[group.prices.length - 1] : {}
      const accommodation_category_id = prev.accommodation_category_id || null
      const deck_id = prev.deck_id || null
      const markup_rate_id = prev.markup_rate_id || this.seasonData.model.rates[0].id

      let room_type_id = Number(prev.room_type_id) || null
      if (room_type_id < 5) room_type_id++
      if (room_type_id === null) room_type_id = 1

      let formula = null
      let gross = 0
      let net = null
      let adjustment = 0
      let non_com = 0
      let cost = 0

      if (room_type_id === 2) {
        formula = prev.formula || ''
        gross = prev.gross || 0
        net = prev.net || null
        adjustment = prev.adjustment || 0
        non_com = prev.non_com || 0
        cost = prev.cost || 0
      }

      const price = {
        cost,
        room_type_id,
        accommodation_category_id,
        deck_id,
        formula,
        gross,
        non_com,
        markup_rate_id,
        net,
        adjustment,
        idx: group.prices.length
      }
      this.groups[index].prices.push(price)
      this.noSaving = true
    },

    removePrice ({ group, price }) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (!this.groups[group]) return
            this.groups[group].prices.splice(price, 1)
            this.noSaving = true
          }
        })
    },

    findAndReplace ({ find, replace, column }) {
      this.groups.forEach(group => {
        group.prices.forEach(price => {
          if (column === 'gross' && price.formula) return
          price[column] = Number(price[column].toString().replace(find, replace))
        })
      })
      this.noSaving = true
    },

    adjustPrices (val) {
      this.groups.forEach(group => {
        group.prices.forEach(price => {
          price.adjustment += val
        })
      })
      this.noSaving = true
    },

    adjustCommission (val) {
      this.groups.forEach(group => {
        group.prices.forEach(price => {
          price.markup_rate_id = val
        })
      })
      this.noSaving = true
    },

    duplicateRows () {
      const groups = []
      for (let index = 1; index <= this.duplicate; index++) {
        if (this.groups[index - 1]) {
          groups.push(this.groups[index - 1])
        }
      }

      if (groups.length) {
        const newGroups = JSON.parse(JSON.stringify(groups))
        newGroups.forEach(group => {
          group.relatedCats = group.relatedCats.map(cat => {
            delete cat['category_id']
            return cat
          })
          group.restricted_dates = group.restricted_dates.map(d => new Thyme(d))
          group.specific_dates = group.specific_dates.map(d => new Thyme(d))
          group.prices.forEach(price => {
            delete price.ids
          })
        })
        this.groups = this.groups.concat(newGroups)
      }
    },

    copyFromSeason ({ season_id, tour_id }) {
      this.axios.get(`tour-pricing/${tour_id}/${season_id}`)
        .then((res) => {
          let cats = res.data.map(cat => {
            cat = this.formatCategory(cat)
            delete cat.id
            return cat
          })
          this.groups = this.groups.concat(this.prepareGroups(cats))
        })
    },

    getIdFromError (res) {
      let id = res.match(/\(id\)=\((.*?)\)/i)
      if (id) id = id[0].match(/[0-9]{1,10}/)
      if (id) id = id[0]
      return id || null
    },

    save () {
      this.removedCategories.forEach(cat => {
        let id = cat.id
        this.axios.delete(`tour-pricing/${this.tour.id}/${this.season}/${id}`)
          .then(() => {
            this.$toasted.success(`Deleted category ${id}`)
            this.removedCategories.splice(this.removedCategories.indexOf(id), 1)
            this.removedCategories = this.removedCategories.filter(item => item.id !== id)
          })
          .catch(e => {
            let id = this.getIdFromError(e.response.data.error)
            if (id) this.errorPriceId = id
            this.groups.push(this.groupFromCategory(cat))
            this.removedCategories = this.removedCategories.filter(item => item.id !== id)
            this.$store.dispatch('error', e.response.data.error)
          })
      })
      this.errorPriceId = null
      this.groups.forEach((group, groupIdx) => {
        if (group.guided === '') group.guided = null
        if (group.specific_dates === null) group.specific_dates = []
        if (group.restricted_dates === null) group.restricted_dates = []
        if (group.restricted_days === null) group.restricted_days = []
        group.relatedCats.forEach((cat, catIdx) => {
          let catFromGroup = this.categoryfromGroup(groupIdx, catIdx)
          if (!catFromGroup.id) {
            this.axios.post(`tour-pricing/${this.tour.id}/${this.season}`, catFromGroup)
              .then(res => {
                cat.category_id = res.data.id
                this.$toasted.success(`Created category ${res.data.id}`)
              })
              .catch(e => this.$store.dispatch('error', e.response.data.error))
          } else {
            this.axios.put(`tour-pricing/${this.tour.id}/${this.season}/${catFromGroup.id}`, catFromGroup)
              .then(res => {
                this.$toasted.success(`Updated category ${res.data.id}`)
              })
              .catch(e => {
                let id = this.getIdFromError(e.response.data.error)
                if (id) {
                  this.errorPriceId = id
                }
                this.$store.dispatch('error', e.response.data.error)
              })
          }
        })
      })
      this.noSaving = false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.noSaving) {
      const options = { title: 'Are you sure you want to leave the page?', cancelLabel: 'No', okLabel: 'Yes' }
      return this.$dialogs.confirm('Any unsaved data will be lost!', options)
        .then(res => {
          if (res.ok) {
            next()
          }
        })
    } else {
      return next()
    }
  }
}
</script>

<style>
.duplicate {
  width: 400px;
}

.duplicate .button {
  display: inline-block;
}

.duplicate [type=number] {
  width: 60px;
  display: inline-block;
  margin: 0 15px 0 0;
}

.save-container button {
  float: right;
  background-color: #298FE0;
}
.save-container.save-top button {
  margin-top: -70px;
}

.category__prices .room-select.room {
    width: 200px;
}
p.error {
  color: red;
}
</style>
