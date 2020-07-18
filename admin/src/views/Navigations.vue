<template>
  <div>
    <header class="header">
      <h1>Navigations</h1>
    </header>
    <form v-if="navigations" @submit.prevent="submit">
      <input type="submit" class="button button--blue" value="Save" />
      <div
        v-for="(nav, key) in navs"
        :key="key"
      >
        <div class="title"> {{ nav }} </div>
        <div class="row">
          <f-navigation
            v-for="(column, index) in columns"
            :key="index"
            :title="navigations[nav][column].title"
            :links="navigations[nav][column].links"
            @input="title => navigations[nav][column].title = title"
            @push="data => navigations[nav][column].links.push(data)"
            @remove="index => navigations[nav][column].links.splice(index, 1)"
            @list_title="data => navigations[nav][column].links[data.index].title = data.value"
            @list_url="data => navigations[nav][column].links[data.index].url = data.value"
            @replace="data=>swap(navigations[nav][column].links, data.oldIndex, data.newIndex)"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import FInput from '@/components/FInput'
import FNavigation from '@/components/FNavigation'

export default {
  components: {
    FInput,
    FNavigation
  },

  data () {
    return {
      options: null,
      navigations: null,
      columns: ['column_1', 'column_2', 'column_3'],
      navs: ['destinations', 'categories', 'special offers', 'information']
    }
  },

  created () {
    this.axios.get('navigations')
      .then(navigations => {
        this.navigations = JSON.parse(JSON.stringify(navigations.data))
      })
  },

  methods: {
    submit () {
      const navigations = JSON.parse(JSON.stringify(this.navigations))
      this.axios.post('navigations', navigations)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },
    swap (arr, from, to) {
      arr.splice(from, 1, arr.splice(to, 1, arr[from])[0])
    }
  }
}

</script>

<style scoped>
@media (min-width: 40em) {
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .title {
    margin: 9px;
    margin-bottom: 12px;
    margin-top: 50px;
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
