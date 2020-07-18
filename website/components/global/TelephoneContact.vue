<template>
  <address>
    <strong>{{ opening }} <small v-if="clarifier">({{ clarifier }})</small></strong>
    <a :href="`tel:${number}`"><small v-if="region">{{ region }}</small>{{ number }}</a>
  </address>
</template>

<script>
export default {
  props: {
    opening: {
      type: String,
      required: true
    },
    clarifier: {
      type: [String, Boolean],
      default() {
        return false
      }
    },
    region: {
      type: [String, Boolean],
      default() {
        return false
      }
    },
    number: {
      type: String,
      required: true
    }
  }
}
</script>


<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
address {
  font-size: 14px;
  font-style: normal;
  color: $mid-blue;
  margin: 13px 0;
}

strong small {
  margin-left: 5px;
  font-weight: 300;
  font-size: 1em;
}

a {
  color: $light-blue;
  font-size: 1.287em;
  display: block;

  small {
    font-weight: 500;
    font-size: 9px;
    margin-right: 10px;
  }
}
</style>

