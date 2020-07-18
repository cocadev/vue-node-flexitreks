<template functional>
  <div class="sub-columns">
    <div
      v-for="(person, i) in props.booking.party"
      :key="i"
      class="person"
    >
      <div>
        <strong class="sub-columns__heading">Person {{ i + 1 }}</strong>
        <span />
      </div>

      <div>
        <strong>Name</strong>
        <span>{{ person.title }} {{ person.first_name }} {{ person.last_name }}</span>
      </div>

      <div>
        <strong>Room</strong>
        <span>{{ person.booking_room_id }}</span>
      </div>

      <div>
        <strong>Date of birth</strong>
        <span>{{ props.dob(person.date_of_birth) }}</span>
      </div>

      <div v-if="person.height">
        <strong>Height</strong>
        <span>{{ person.height }}cm ({{ props.ft(person.height) }})</span>
      </div>

      <div v-if="person.tour_bike || (person.tour_bike_id && props.meta.bikes.length)">
        <strong>Bike</strong>
        <span>{{ person.tour_bike ? person.tour_bike.short_name : props.meta.bikes.find(b => b.id === Number(person.tour_bike_id)).name }}</span>
      </div>

      <div>
        <strong>Dietary requirements</strong>
        <span>{{ person.dietary || 'None' }}</span>
      </div>

      <div
        v-if="person.extras.length"
      >
        <strong>Extras</strong>
        <span
          v-for="extra in person.extras"
          :key="`${i}_${extra.tour_party_extra_variation_id}`"
        >
          {{ extra.name || props.meta.party_extras[extra.tour_party_extra_variation_id] }}
        </span>
      </div>

    </div>
  </div>
</template>
