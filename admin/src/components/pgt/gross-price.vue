<template>
  <td class="pgt-gross-price">
    <div class="pgt-inner-table">
      <div>
        <div class="pgt-formula">
          <input
            :value="formula | fixSlashes"
            class="pgt-formula__input"
            @focus="focus"
            @blur="blur"
            @input="$emit('formula', $event.target.value)" type="text"
            ref="formula"
          >
          <span
            v-if="focused && formattedFormula"
            class="pgt-formula__number"
            v-html="formattedFormula"
          />
        </div>
        <div>
          <input :value="value" @input="$emit('input', $event.target.value)" :disabled="!!formula" type="number">
        </div>
      </div>
    </div>
  </td>
</template>

<script>
export default {
  props: {
    formula: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    idx: {
      type: Number,
      required: true
    },
    prices: Array
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    _formula () {
      let formula = this.formula
      if (!formula) return ''

      const regex = /\[(\d*)\]/gm
      let m

      while ((m = regex.exec(formula)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        m.forEach((idx, groupIndex) => {
          if (groupIndex !== 0) return
          const price = this.prices.find(x => x.idx === idx)
          const search = new RegExp('\\[' + idx + '\\]', 'g')

          if (price && idx !== this.idx) {
            formula = formula.replace(search, price.gross)
          } else {
            formula = formula.replace(search, 0)
          }
        })
      }

      return formula
    },

    _gross () {
      if (!this._formula) return 0

      try {
        // eslint-disable-next-line
        return eval('1 * ' + this._formula)
      } catch (e) {
        return 0
      }
    },

    formattedFormula () {
      let formula = this.formula
      if (!formula) return ''

      // eslint-disable-next-line
      formula = formula.replace(/([\+\-\*\/])/gm, '<strong>$1</strong>')
      formula = formula.replace(/\[/gm, '<em>[')
      formula = formula.replace(/\]/gm, ']</em>')
      formula = formula.replace(/\(/gm, '<b>(</b>')
      formula = formula.replace(/\)/gm, '<b>)</b>')

      return formula
    }
  },

  filters: {
    fixSlashes: function (val) {
      if (!val) return ''
      let newVal = val
      if (!newVal) return ''

      newVal = newVal.replace(/amp;/g, '')
      newVal = newVal.replace(/&#x2F;/g, '/')
      return newVal
    }
  },

  watch: {
    _gross (n) {
      this.$emit('input', n)
    }
  },

  beforeDestroy () {
    this.focused = false
    const el = document.querySelector('.js-pgt')
    if (el) el.removeEventListener('click', this.idClicker)
  },

  methods: {
    focus () {
      this.focused = true
      document.querySelector('.js-pgt').addEventListener('click', this.idClicker)
    },

    blur () {
      setTimeout(() => {
        this.focused = false
        document.querySelector('.js-pgt').removeEventListener('click', this.idClicker)
      }, 100)
    },

    idClicker (e) {
      if (!e.target.classList.contains('pgt-id')) return true
      this.$emit('formula', (this.formula || '') + `[${e.target.textContent}]`)
      this.$refs.formula.focus()
      setTimeout(() => {
        this.focused = true
        document.querySelector('.js-pgt').addEventListener('click', this.idClicker)
      }, 150)
    }
  }
}
</script>

<style>
.pgt-formula {
  position: relative;
  font: 0.8em "SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace;
}

.pgt-formula__input {
  background: transparent!important;
  border: none;
  border-bottom: 1px solid #CCC;
  font: inherit;
  font-size: 1em!important;
  padding-left: 0!important;
}

.pgt-gross-price {
  padding-right: 10px;
  padding-left: 10px;
}

.pgt-formula__number {
  position: absolute;
  background: #FFF;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
  padding: 5px;
  left: 0;
  top: 100%;
  margin: 2px 0 0;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 700;
}

.pgt-formula__number em {
  font-style: normal;
  color: #e74c3c;
}

.pgt-formula__number strong {
  color: #2980b9;
}

.pgt-formula__number  b {
  color: #8e44ad;
}
</style>
