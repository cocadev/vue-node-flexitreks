<template>
  <booking-select
    :id="id"
    :value="value"
    label="Country"
    required="true"
    @change="$emit('change', $event)"
    @input="$emit('input', $event)"
  >
    <option value="">Pick a country</option>
    <option value="GB">United Kingdom</option>
    <option value="US">United States</option>
    <option value="AU">Australia</option>
    <option value="NZ">New Zealand</option>
    <option value="CA">Canada</option>
    <option value="IE">Ireland</option>
    <option value="ZA">South Africa</option>
    <option value="">---</option>
  </booking-select>
</template>

<script>
import BookingSelect from '@/components/bookings/BookingSelect'
export default {
  components: {
    BookingSelect
  },

  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    }
  }
}
</script>
