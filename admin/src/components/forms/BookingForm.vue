<template>
  <form class="edit-booking" @submit.prevent="$emit('submit')">
    <div>
      <h2>Edit contact information</h2>
      <f-input v-model="booking.customer.title" name="booking_title" label="Title" />
      <f-input v-model="booking.customer.first_name" name="booking_first_name" label="First name" />
      <f-input v-model="booking.customer.last_name" name="booking_last_name" label="Last name" />
      <f-input v-model="booking.customer.email_address" name="booking_email_address" label="Email address" />
      <f-input v-model="booking.customer.telephone_number" name="booking_telephone_number" label="Telephone number" />
      <f-input v-model="booking.customer.alternative_telephone_number" name="booking_telephone_number_alt" label="Telephone number 2" />
      <f-input v-model="booking.customer.address_line_1" name="booking_address_line_1" label="Address Line 1" />
      <f-input v-model="booking.customer.address_line_2" name="booking_address_line_2" label="Address Line 2" />
      <f-input v-model="booking.customer.town" name="booking_town" label="Town" />
      <f-input v-model="booking.customer.county" name="booking_county" label="County" />
      <f-input v-model="booking.customer.postcode" name="booking_postcode" label="Postcode" />
      <f-input v-model="booking.customer.country" name="booking_country" label="Country" />
      <h2>Selected Filters</h2>
      <dl>
        <template v-if="booking.filter_boat !== null"><dt>Boat:</dt> <dd>{{ booking.filter_boat }}</dd></template>
        <template v-if="booking.filter_from !== null"><dt>From:</dt> <dd>{{ booking.filter_from }}</dd></template>
        <template v-if="booking.filter_guided !== null"><dt>Guided:</dt> <dd>{{ booking.filter_guided }}</dd></template>
        <template v-if="booking.filter_nights !== null"><dt>Nights:</dt> <dd>{{ booking.filter_nights }}</dd></template>
      </dl>
      <input type="submit" class="button button--blue" value="Save">
    </div>
    <div>

      <f-select v-model="booking.status" name="booking_status" label="Status">
        <option value="pending">Pending payment</option>
        <option value="on-hold">On Hold</option>
        <option value="deposit-paid">Deposit paid</option>
        <option value="payment-started">Awaiting balance</option>
        <option value="payment-completed">Paid in full</option>
        <option value="not-requested">Payment completed</option>
        <option value="awaiting-supplier">Awaiting supplier conf</option>
        <option value="send-conf-inv">Send conf inv</option>
        <option value="ticketed">Ticketed</option>
        <option value="supplier-cancelled">Supplier Cancelled</option>
        <option value="cancelled">Customer Cancelled</option>
        <option value="sent-to-feefo">Sent to Feefo</option>
        <option value="prepared">Prepared</option>
        <option value="checked">Checked</option>
      </f-select>

      <f-input v-model="booking.booking_reference" name="booking_reference" label="Reference" />

      <hr>

      <h2>Rooms</h2>
      <div v-for="room in booking.rooms" :key="'room_' + room.id">
        <h3>Room #{{ room.id }} - {{ room.name }} - {{ room.category }}: £{{ room.cost }}</h3>
        <template v-if="room.extras.length">
          <h4>Extras for room #{{ room.id }}</h4>
          <dl
            v-for="extra in room.extras"
            :key="'extra_' + extra.id"
          >
            <dt>Name:</dt> <dd>{{ extra.post ? 'Post holiday' : 'Pre holiday' }} - {{ extra.name }}</dd>
            <dt>Cost:</dt> <dd>£{{ extra.cost }}</dd>
            <dt>Nights:</dt> <dd>{{ extra.quantity }}</dd>
            <dt>Type:</dt> <dd>{{ extra.room_name }} - {{ extra.category }}</dd>
          </dl>
        </template>
        <hr>
      </div>

      <h2>Party</h2>
      <div v-for="(person, i) in booking.party" :key="'person_' + person.id">
        <h3>Person {{ i + 1 }}</h3>
        <f-input v-model="person.title" :name="`person_${i}_title`" label="Title" />
        <f-input v-model="person.first_name" :name="`person_${i}_first_name`" label="First name" />
        <f-input v-model="person.last_name" :name="`person_${i}_last_name`" label="Last name" />
        <f-input v-model="person.height" :name="`person_${i}_height`" label="Height" />
        <f-date-of-birth v-model="person.date_of_birth" :id="`person_${i}_height`" />
        <f-select v-if="bikes.length" v-model="person.tour_bike_id" :name="`person_${i}_tour_bike_id`" label="Bike">
          <option value="">Pick a bike</option>
          <option v-for="bike in bikes" :key="bike.id" :value="bike.id" v-html="bike.name" />
        </f-select>
        <f-textarea v-model="person.dietary_requirements" :name="`person_${i}_dietary_requirements`" label="Dietary requirements" />
        <f-select v-model="person.booking_room_id" :name="`person_${i}_tour_bike_id`" label="Room">
          <option value="">Pick a room</option>
          <option v-for="room in booking.rooms" :key="'booking_room_' + room.id" :value="room.id">Room #{{ room.id }} - {{ room.name }} - {{ room.category }}</option>
        </f-select>
        <template v-if="person.extras.length">
          <h3>Extras for {{ person.first_name }} {{ person.last_name }}</h3>
          <dl
            v-for="extra in person.extras"
            :key="'extra_' + extra.id"
          >
            <dt>Name:</dt> <dd>{{ extra.name }}</dd>
            <dt>Cost:</dt> <dd>£{{ extra.cost }}</dd>
          </dl>
        </template>
        <hr>
      </div>
      <input type="submit" class="button button--blue" value="Save">

    </div>
  </form>
</template>

<script>
import FInput from '@/components/FInput'
import FSelect from '@/components/FSelect'
import FDateOfBirth from '@/components/FDateOfBirth'
import FTextarea from '@/components/FTextarea'

export default {
  components: {
    FInput,
    FSelect,
    FDateOfBirth,
    FTextarea
  },

  props: {
    booking: {
      type: Object,
      required: true
    },
    bikes: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-booking {
  display: grid;
  grid-gap: 100px;

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      height: 100%;
      border-left: 1px solid #D5DDE2;
      left: 50%;
      top: 0;
    }
  }
}
</style>
