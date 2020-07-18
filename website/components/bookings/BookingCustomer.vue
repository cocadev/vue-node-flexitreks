<template functional>
  <div class="sub-columns">
    <div>
      <strong>Name</strong>
      <span>{{ props.booking.customer.title }} {{ props.booking.customer.first_name }} {{ props.booking.customer.last_name }}</span>
    </div>
    <div>
      <strong>Email address</strong>
      <span>{{ props.booking.customer.email_address }}</span>
    </div>
    <div>
      <strong>Telephone number</strong>
      <span>{{ props.booking.customer.telephone_number }}</span>
    </div>
    <div>
      <strong>Alternative number</strong>
      <span>{{ props.booking.customer.alternative_telephone_number }}</span>
    </div>
    <div>
      <strong>Address</strong>
      <span>{{ props.booking.customer.address_line_1 }}</span>
      <span v-if="props.booking.customer.address_line_2">{{ props.booking.customer.address_line_2 }}</span>
      <span>{{ props.booking.customer.town }}</span>
      <span>{{ props.booking.customer.county }}</span>
      <span>{{ props.booking.customer.postcode }}</span>
      <span>{{ props.booking.customer.country }}</span>
    </div>
  </div>
</template>
