<template>
  <div class="home">
    <div
      v-show="!((openCountry || openLevel) && mobile)"
      class="filter"
    >
      <div
        v-tap-menu
        v-popover:country.right
        class="filter-item"
        @click="triggerCountry()"
      >
        <span class="title">{{ countryLabel }}</span>
        <img
          :src="`/images/orange-down.png`"
          class="mt-8"
          style="height: 10px;"
        >
      </div>
      <div
        class="filter-item mt-0"
        @click="triggerBoat()"
      >
        <span class="title">Bike or boat</span>
        <img
          :src="bike_and_boat === 'boat' ? `/images/select.png` : `/images/unselect.png`"
          class="icon"
          alt="check icon"
        >
      </div>
      <div
        class="filter-item"
        @click="triggerHotel()"
      >
        <span class="title">Bike or hotel</span>
        <img
          :src="bike_and_boat === 'hotel' ? `/images/select.png` : `/images/unselect.png`"
          class="icon"
          alt="check icon"
        >
      </div>
      <div
        v-tap-menu
        v-popover:level.right
        class="filter-item mt-0"
        @click="triggerLevel()"
      >
        <span class="title">{{ levelLabel }}</span>
        <img
          :src="`/images/orange-down.png`"
          class="mt-8"
          style="height: 10px;"
        >
      </div>
      <nuxt-link :to="link" >
        <input
          :style="selectedCountries.length === 0 && 'opacity: 0.5'"
          type="submit"
          class="button button--grey"
          value="View Tours"
        >
      </nuxt-link>
    </div>
    <div
      v-show="openCountry && mobile"
      class="filter"
      style="overflow: hidden;"
    >
      <div
        class="filter-item"
        style="background: #f88f2b;"
        @click="triggerCountry()"
      >
        <span
          class="title"
          style="color: white"> {{ selectedCountries.length }} Countries selected</span>
        <img
          :src="`/images/white-down.png`"
          class="mt-8"
          style="height: 10px;"
        >
      </div>
      <div class="gradient1"/>
      <div class="gradient2"/>
      <div class="filter-item-2" >
        <div
          v-for="(country, i) in destinations"
          :key="i"
          class="filter-item-view"
          style="height: 35px"
          @click="pushCountry(country.name)">
          <h3
            class="title"
            style="margin-top: 14px; margin-left: 10px"> {{ country.name }} </h3>
          <img
            :src="selectedCountries.includes(country.name) ? `/images/check.png` : `/images/uncheck.png`"
            class="icon mr-12"
            alt="check icon"
          >
        </div>
      </div>
    </div>
    <popover
      v-show="!mobile"
      :pointer="false"
      name="country"
      class="none-1"
    >
      <div
        v-show="popover"
        class="popup-custom"
      >
        <div class="arrow-left" />
        <div style="display: flex; flex-direction: row; margin-top: -5px">
          <div style="flex: 1.2">
            <div
              v-for="(country, i) in destinations.slice(0, 10)"
              :key="i"
              class="country-item"
              @click="pushCountry(country.name)"
            >
              <img
                :src="selectedCountries.includes(country.name) ? `/images/check.png` : `/images/uncheck.png`"
                class="icon mr-12"
                alt="check icon"
              >
              <h3 class="title"> {{ country.name }} </h3>
            </div>
          </div>
          <div style="flex: 1">
            <div
              v-for="(country, i) in destinations.slice(10, 20)"
              :key="i"
              class="country-item"
              @click="pushCountry(country.name)"
            >
              <img
                :src="selectedCountries.includes(country.name) ? `/images/check.png` : `/images/uncheck.png`"
                class="icon mr-12"
                alt="check icon"
              >
              <h3 class="title"> {{ country.name }} </h3>
            </div>
          </div>
        </div>
      </div>
    </popover>

    <popover
      v-show="!mobile"
      :pointer="false"
      name="level"
      class="none-2"
    >
      <div
        v-show="popover"
        class="popup-custom"
      >
        <div class="arrow-left-2 mb-0" />
        <div
          v-for="level in levels"
          :key="level.name"
          class="country-item"
          @click="selectLevel(level.name)"
        >
          <img
            :src="difficulty === level.name ? `/images/select.png` : `/images/unselect.png`"
            class="icon mr-12"
            alt="check icon"
          >
          <h3 class="title"> {{ level.name }} </h3>
        </div>
        <button
          class="reset"
          @click="clearLevel()"
        >
          Reset
        </button>
      </div>
    </popover>

    <div
      v-show="openLevel && mobile"
      class="filter"
      style="overflow: hidden;"
    >
      <div
        class="filter-item"
        style="background: #f88f2b;"
        @click="triggerLevel()"
      >
        <span
          class="title"
          style="color: white"> {{ difficulty }} selected</span>
        <img
          :src="`/images/white-down.png`"
          class="mt-8"
          style="height: 10px;"
        >
      </div>
      <div class="gradient1"/>
      <div class="gradient2"/>
      <div class="filter-item-2">
        <div
          v-for="level in levels"
          :key="level.name"
          class="filter-item-view"
          @click="selectLevel(level.name)"
        >
          <h3
            class="title"
            style="margin-top: 4px; margin-left: 10px"> {{ level.name }} </h3>
          <img
            :src="difficulty === level.name ? `/images/select.png` : `/images/unselect.png`"
            class="icon mr-12"
            alt="check icon"
          >
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "HomeFilter",
  components: {},
  data() {
    return {
      openCountry: false,
      openLevel: false,
      bike_and_boat: '',
      mobile: false,
      selectedCountries: [],
      difficulty: '',
      link: '',
      popover: false,
      levels: [
        { name: 'Easy' },
        { name: 'Leisurely' },
        { name: 'Moderate' },
        { name: 'Challenging' },
      ]
      }
  },
  computed: {
    countryLabel() {
      if(this.selectedCountries.length > 0) {
        return this.selectedCountries.join(', ')
      }
      return 'Select Country'
    },
    levelLabel() {
      if('' == this.difficulty) {
        return 'Any Level'
      }
      return this.difficulty
    },
    destinations() {
      return this.$store.state.global.destinations
    }
  },
  mounted() {
    let manualName =  this.$store.state.filters.countries.length > 0 && this.$store.state.filters.countries[this.$store.state.filters.countries.length - 1].toLowerCase();
    this.link = manualName ? "destinations/cycling-holidays-" + manualName : '';
    this.popover = true;
    window.onresize = () => {
      this.mobile = window.innerWidth > 700 ? false : true;
    }
  },
  methods: {
    pushCountry(country){
      let data = [];
      if(!this.selectedCountries.includes(country)){
        this.selectedCountries.push(country)
      } else{
        this.selectedCountries.splice(this.selectedCountries.indexOf(country), 1)
      }

      let manualName =  this.selectedCountries.length > 0 && this.selectedCountries[this.selectedCountries.length - 1].toLowerCase();

      data = this.selectedCountries.slice(0);
      this.link = manualName ? "destinations/cycling-holidays-" + manualName : '';
      this.$store.commit('changeFilter', { type: 'countries', value: data });
    },
    selectLevel(level){
      this.difficulty = level;
      this.$store.commit('changeFilter', { type: 'difficulty', value: level });
    },
    clearLevel(){
      this.difficulty = '';
      this.$store.commit('changeFilter', { type: 'difficulty', value: '' });
    },
    triggerCountry() {
      this.openCountry = !this.openCountry;
      this.openLevel = false
    },
    triggerLevel() {
      this.openLevel = !this.openLevel;
      this.openCountry = false;
    },
    triggerBoat() {
      this.bike_and_boat = 'boat';
      this.$store.commit('changeFilter', { type: 'bike_and_boat', value: 'boat' });
    },
    triggerHotel() {
      this.bike_and_boat = 'hotel';
      this.$store.commit('changeFilter', { type: 'bike_and_boat', value: 'hotel' });
    },
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';
.home {
  display: flex;
  flex-direction: row;
  margin-top: 0;
}
.filter {
  max-width: 320px;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  margin-top: -140px;
  padding: 20px;
  z-index: 100;
  height: 375px;
  @media (max-width: 1000px) {
    margin-top: -85px;
  }
  @media (max-width: 800px) {
    margin-top: -18px;
    max-width: none
  }
  @media (max-width: 600px) {
    margin-top: 10px;
    max-width: none
  }
  @media (max-width: 376px) {
    margin-top: 20px;
    max-width: none
  }
}
.filter-item {
  height: 50px;
  background: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 13px;
  justify-content: space-between;
}
.filter-item-2 {
  background: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 13px;
  padding: 0;
  flex-direction: column;
  overflow-y: scroll;
  height: 285px;
}
.orange-link {
  margin-right: 25px;
}
.title {
  color: #52869b;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mt-0 {
  margin-top: 30px;
}
.button {
  background: #F88F2B;
  margin-top: 30px;
}
.popup {
  max-width: 400px;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  margin-top: -140px;
  padding: 30px;
  margin-left: 22px;
  max-height: 370px;
  @media (max-width: 1000px) {
    margin-top: -85px;
  }
  @media (max-width: 800px) {
    margin-top: -25px;
  }
  @media (max-width: 376px) {
    margin-top: -35px;
  }
}

.popup-custom {
  padding: 26px 10px 10px 10px
}
.arrow-left {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right:10px solid white;
  position: absolute;
  margin-left: -25px;
  margin-top: 6px;
}
.arrow-left-2 {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right:10px solid white;
  position: absolute;
  margin-left: -25px;
  bottom: 110px;
}
.icon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}
.mb-0 {
  margin-top: 215px;
}
.mr-12 {
  margin-right: 12px;
}
.mt-8 {
   margin-top: 8px;
}
.country-item {
  display: flex;
  flex-direction: row;
  flex: 1
}
.filter-item,
.filter-item-2,
.country-item:hover{
  cursor: pointer;
}
.filter-item-view {
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 35px
}
.gradient1 {
  position: absolute;
  width: 160px;
  height: 80px;
  background-image: linear-gradient(white, transparent);
}
.gradient2 {
  position: absolute;
  bottom: 80px;
  width: 160px;
  height: 80px;
  background-image: linear-gradient(transparent, white);
}
button.reset {
  color: $light-blue;
  font: inherit;
  font-size: 12px;
  padding: 0;
  text-decoration: underline;
  display: inline-block;
  margin-left: 25px;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
}
.none-1 {
  margin-top: 62px;
  margin-left: 40px;
  width: 300px!important
}
.none-2 {
  margin-top: -60px;
  margin-left: 40px;
  width: 300px!important
}
</style>
