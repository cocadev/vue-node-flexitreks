<template functional>
  <div>
    <div
      v-for="(room, i) in props.rooms"
      :key="i"
      class="sub-columns"
    >
      <div class="sub-columns__span">
        <strong class="sub-columns__heading">{{ props.boat ? 'Cabin' : 'Room' }} {{ room.room_id }}</strong>
        <span />
      </div>

      <div>
        <strong>Type</strong>
        <span>
          {{ room.name || props.build.rooms.find(r => r.id === room.price.room_type_id).name }} -
          {{ room.category || props.build.accommodation.find(a => a.id === room.price.accommodation_category_id).name }}
          <template v-if="room.price.deck_id !== undefined">- {{ props.build.decks.find(d => d.id === room.price.deck_id).name }} deck</template>
        </span>
      </div>
      <div
        v-if="room.extras.length"
      >
        <strong>Extra nights</strong>
        <span
          v-for="(extra, j) in room.extras"
          :key="`${i}_${j}`"
        >
          <span>{{ extra.name }} x{{ extra.quantity }}</span>
          <span>{{ extra.room_name || props.build.rooms.find(r => r.id === extra.room_type_id).name }} {{ extra.category || extra.accommodation_category_id ? '-' : '' }} {{ extra.category || (extra.accommodation_category_id ? props.build.accommodation.find(a => a.id === extra.accommodation_category_id).name : '') }}</span>
          <br>
        </span>
      </div>
    </div>
  </div>
</template>
