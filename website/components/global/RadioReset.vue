<template>
  <div class="radio-reset">
    <label
      v-for="option in options"
      :key="option.value"
    >
      <input
        :name="name"
        :value="option.value"
        :checked="option.value === value"
        type="radio"
        @change="$emit('change', option.value)"
      > <span>{{ option.label }}</span>
    </label>
    <label>
      <input
        :name="name"
        :checked="'' === value"
        value=""
        type="radio"
        @change="$emit('change', '')"
      >Reset
    </label>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    
    name: {
      type: String,
      required: true
    },

    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.radio-reset {
    border: 1px solid $filter;
    border-radius: 3px;
    color: $copy;
    font-family: inherit;
    font-size: 11px;
    font-weight: 400;
    position: relative;
    display: inline-flex;
    
    input {
        clip: rect(1px, 1px, 1px, 1px);
        position: absolute !important;
    }
    
    :focus + span {
        outline: 2px solid #CCC;
    }
    
    :checked + span {
        background: $filter;
        pointer-events: none;
        outline: none;
        color: $copy;
    }
    
    label {
        padding: 0;
        pointer-events: none;
        font: inherit;
        display: inline-block;
        margin: 0;

        span {
            padding: 8px 15px;
            display: block;
            cursor: pointer;
            pointer-events: all;
        }
        
        & + label {
            border-left: 1px solid #B8C5CA;
        }
    }
    
    & > * {
        position: relative;
        z-index: 1;
    }
    
    label:last-child {
        pointer-events: all;
        position: absolute;
        cursor: pointer;
        padding: 0;
        z-index: 0;
        opacity: 0;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    @include mq(1050px) {
      font-size: 13px;

      label span {
        padding: 10px 25px;
      }
    }
}

</style>
