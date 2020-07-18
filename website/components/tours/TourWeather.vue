<template>
  <div
    class="weather"
  >
    <div class="wrap center">
      <h3>Average weather</h3>
      <ul>
        <li
          v-for="month in months"
          :key="month.month"
        >
          <h4>{{ ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month.month] }}</h4>
          <strong>{{ month.temperature }}&deg;C</strong>
          <h5>Avg. Rain: {{ month.rainfall }}mm</h5>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    months: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.weather {
  background: $lightest url('~/assets/images/contours.svg') center /100% auto no-repeat;
  padding: 30px 0;
  margin: 0 0 30px;
  
  ul {
    font-size: 0;
    margin: -15px;
    padding-top: 30px;
  }

  strong {
    font-size: 2.666em;
    font-weight: 400;
    line-height: 1;
  }

  h4 {
    text-transform: uppercase;
  }

  h5 {
    font: 400 italic 14px 'Libre Baskerville', serif;
    margin: 10px 0;
  }

  li {
    list-style: none;
    font-size: 16px;
    width: calc(50% - 30px);
    margin: 15px;
    background: #FFF;
    padding: 20px 10px;
    display: inline-block;

    @include mq(30em) {
      width: calc(33.333% - 30px);
    }

    @include mq(40em) {
      font-size: 18px;
    }

    @include mq(45em) {
      width: calc(25% - 30px);
    }

    @include mq(60em) {
      width: calc(20% - 30px);
    }

    @include mq(75em) {
      width: calc(16.666% - 30px);
    }
  }

  @include mq(40em) {
    padding: 63px 0;
  }
}
</style>
