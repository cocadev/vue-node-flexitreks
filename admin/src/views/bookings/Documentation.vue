<template>
  <div>
    <img src="/header.png" alt="" class="logo">
    <h1>Your Cycling Holiday Document</h1>
    <header class="print-header">www.flexitreks.com | +44 (0)1273 410550 | info@flexitreks.com</header>

    <template v-if="docs">
      <dl>
        <dt>Tour: </dt><dd>{{ docs.booking.tour.name }}</dd>
        <dt>Name: </dt><dd>{{ docs.booking.customer.title }} {{ docs.booking.customer.first_name }} {{ docs.booking.customer.last_name }}</dd>
        <dt>Reference: </dt><dd>{{ docs.booking.booking_reference }}</dd>
      </dl>
      <p>The information below provides all the necessary detail about your cycling holiday. Please read it at your earliest convenience and contact us if you have any queries.</p>

      <hr>

      <h2>Passports | Visas | Travel Insurance</h2>
      <h3>British citizens</h3>
      <p>Your passport must be valid for the duration of your stay. Please note that certain countries require your passport to be valid for at least 3 or 6 months from the date of return. Please check with the relevant embassy or consulate of the country/countries you are visiting as passport/visa regulations can change at any time and it is your responsibility to comply with the up-to-date requirements.</p>

      <h3>Non-British citizens</h3>
      <p>You will need to check with your embassy or consulate for up to date requirements. Please note that it is your responsibility to make sure you comply with any passport/visa regulations governing the country/countries you visit.</p>
      <h5><strong>Important note:</strong> If your passport or visa is not in order and you are denied travel, you will be liable for cancellation charges as per our terms and conditions. If you are not permitted to travel, due to your documents not being in order or lost, no refund will be given.</h5>
      <h3>Travel Insurance</h3>
      <p>Please note that it is your responsibility to ensure you have adequate travel insurance in place before you travel.</p>

      <h2>Local Assistance &amp; Contact during your holiday</h2>
      <p>Your trip has been arranged in conjunction with our local partner, <strong>{{ docs.operator.name }}</strong>, who will be your point of contract during your trip.</p>
      <p>Should you have a problem during your holiday it is important that you call our local partner to give them the opportunity to solve the matter locally for you. They will do their best to resolve the matter to your satisfaction so that you can continue to enjoy your trip.</p>
      <p>Failure to comply with this procedure would deprive us and our local supplier of the opportunity to rectify the situation locally and this could subsequently affect your rights in accordance with our booking conditions.</p>
      <p>Use these numbers should you experience any issues during your trip.</p>
      <div v-html="docs.operator.contact"></div>

      <hr>

      <h2>Documentation &amp; Bike Handover</h2>
      <h3>This document is your official travel document.</h3>
      <div v-html="docs.documentation_details.bike_details"></div>

      <img v-if="!docs.documentation_details.map_id && docs.documentation_details.map" :src="docs.documentation_details.map.url">
      <div v-html="docs.documentation_details.arrival"></div>

      <hr>
      <h2>Your Accommodation</h2>
      <ul v-if="docs.hotels.length">
        <li v-for="hotel in docs.hotels" :key="hotel.name">
          <h3>{{ hotel.name }}</h3>
          <div v-html="hotel.content"></div>
        </li>
      </ul>

      <h3>Local taxes</h3>
      <p>Some cities charge a local tourist tax. These taxes are not included in the sale price of the tour and must be paid directly by you at check-in or checkout at the hotels. This fee varies but is usually ranges between €1 - €4 per person per night.</p>
      <h3>Diets and allergies</h3>
      <p>If you are vegetarian, gluten-intolerant, allergic to some specific ingredients or if you suffer from any other kind of allergies you must have advised us of this at the time of booking.</p>

      <hr>
      <h2>Electricity</h2>
      <p>In Europe, the electricity is 220V - 50Hz.  European plugs are 2 pinned and round. Remember to take adaptors so you can use your electrical devices.</p>

      <hr>
      <h2>Luggage &amp; Packing</h2>
      <div v-html="docs.documentation_details.luggage"></div>

      <h2>Packing suggestions</h2>
      <div class="list">
        <p>(this is a generic list and so some items may not apply)</p>
        <h4>Essentials</h4>
        <p>Passport or Identity card</p>
        <p>Money, credit/debit cards &amp; travel document Personal health insurance</p>
        <p>Personal medication</p>
        <h4>Cycling wear</h4>
        <p>Helmet – we suggest you bring your own and always wear one when cycling.</p>
        <p>Layers – this is key when cycling! Wear thin layers during the day, which can be taken off quite easily. The outer layer should be wind and waterproof.</p>
        <p>(A breathable cycle top is great as it helps prevent you from getting cold). Cotton tops may absorb sweat but they also release it again)!</p>
        <p>A fleece or sweater</p>
        <p>Waterproof/windproof jacket – just in case!</p>
        <p>Shorts not restricting your movements - cycling or shorts with padded seat</p>
        <p>Gloves – not essential, but they do keep your hands less sweaty and protect them on longer rides.</p>
        <p>Trainers/sneakers/shoes - stiff-soled and with good tread (If you are on a bike and boat trip only rubber soles should be worn on board)</p>
        <p>Water &amp; water bottle, unless included in your rental package</p>
        <h4>Miscellaneous</h4>
        <p>A hat/cap to protect you from the sun.</p>
        <p>Sun cream, sun glasses, swim wear, beach towel</p>
        <p>Toiletries, first aid kit</p>
        <p>Tissues/wipes – invaluable for so many occasions!</p>
        <p>Insect repellent spray or cream (depending on the season)</p>
        <p>A small language book – not essential but why not give it a go!</p>
        <p>Lunch box – great if you are having a packed lunch</p>
        <p>Snacks/Nibbles/Energy bars – while we know you can buy all these things locally, we all have our favourites</p>
        <p>Scarf – sometimes you may need to visit a religious site and be asked to cover up your shoulders, so this is a good article to carry</p>
        <p>Notebook and pen – in case you want to detail your trip</p>
        <p>Camera/video</p>
      </div>

      <template v-if="docs.documentation_details.food || docs.restaurants.length">
        <hr>
        <h2>Dining &amp; Eating Out</h2>
        <div v-html="docs.documentation_details.food"></div>

        <template v-if="docs.restaurants.length">
          <div v-for="restaurant in docs.restaurants" :key="restaurant.name">
            <h4>{{ restaurant.name }}</h4>
            <div v-html="restaurant.content"></div>
          </div>
        </template>
      </template>

      <hr>
      <h2>On the Road</h2>
      <div class="list">
        <h4>Locking your bike</h4>
        <p>We remind you that you are responsible for the rental bikes and the accessories during the whole tour. Bicycles must be always locked and possibly secured to something immoveable, even for short periods.</p>
        <h4>Mechanical Problems</h4>
        <p>It is wise to familiarise yourself with the procedure for repairing and/or changing an inner tube before commencing your cycling holiday. If you have a flat tyre you are expected to repair it yourself and you will be provided with a repair kit when you pick up your bike. For other mechanical problems please call Papagayo Bike immediately and they will decide how best to assist.</p>
        <h4>Riding</h4>
        <p>Wear a helmet – it is compulsory</p>
        <p>Cycle in a single file</p>
        <p>Make sure you signal any manoeuvres clearly</p>
        <p>Use cycle paths if they are available</p>
        <p>Please remember to cycle on the right-hand side of the road!</p>
        <p>Before you set off in the morning give your bike a quick check and, if necessary, inflate the tyres (important to prevent punctures!)</p>
        <h4>Tour programme variations</h4>
        <p>Every now and then weather conditions or local authority works, result in temporary route changes. As such, you may need to follow deviations, as a result of road works for example, and in such instances, we ask you to use common sense.</p>
      </div>

      <hr>
      <h2>Currency &amp; money matters</h2>
      <div>
        <p>You can pay nearly everywhere with credit cards or debit cards. ATMs can be found in most towns along the route.
        Travellers checks can be cashed at post offices, banks and exchange offices during regular business hours.</p>

        <div v-for="place in docs.destinations" :key="place.name">
          <h4>{{ place.name }}</h4>
          <p>The currency in {{ place.name }} is the {{ place.currency }}.</p>
          <p v-for="place in docs.destinations" :key="place.name" v-html="place.tipping" />
        </div>
      </div>

      <hr>
      <h2>Useful Telephone Numbers</h2>
      <h3>Emergency Number</h3>
      <p>112 - All emergencies</p>
      <p>This is a Pan-European emergency number which can be called in any emergency from any telephone (landline and mobile phone). Calls are free. As it's a Europe-wide number, you can also ask to be connected to an English-speaking operator.</p>

      <template v-if="docs.tour_meta.weather">
        <hr>
        <h2>Weather</h2>
        <p>You may find it useful to have an idea of weather conditions, both prior to travel and during your trip.</p>
        <div v-html="docs.tour_meta.weather"></div>
      </template>

      <template v-if="docs.itinerary.length">
        <hr>
        <h2>About your cycle trip</h2>
        <ul>
          <li v-for="day in docs.itinerary" :key="day.title">
            <h3>{{ day.title }}</h3>
            <div v-html="day.content"></div>
          </li>
        </ul>
      </template>

      <hr>

      <footer class="print-footer">www.flexitreks.com | +44 (0)1273 410550 | info@flexitreks.com</footer>

    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      docs: null
    }
  },
  props: {
    id: {
      type: [String, Number]
    }
  },
  mounted () {
    this.axios.get(`bookings/${this.id}/documentation`)
      .then(res => {
        if (!res.data.documentation_details) res.data.documentation_details = {}
        this.docs = res.data
      })
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/settings.scss';

.route-documentation {
  &#app {
    background: #FFF;
    font-size: 12pt;
  }

  .logo {
    max-width: 500px;
    margin: 0 auto 30px;
    display: block;
  }

  [role="banner"],
  .main-nav {
    display: none;
  }

  .container {
    display: block;
    max-width: 720px;
    margin: 0 auto;
    min-height: 100vh;
  }

  h1 {
    border-top: 1px solid $line;
    border-bottom: 1px solid $line;
    text-align: center;
    font-size: 18pt;
    padding: 20pt 0;
    margin-bottom: 0;
  }

  hr,
  h1 {
    margin-left: -20px;
    margin-right: -20px;
  }

  h2 {
    font-size: 16pt;
    color: $dark;
  }

  h3,
  h4 {
    margin-bottom: 15px;
    font: italic 14pt 'Libre Baskeville', serif;
  }

  h4 {
    color: $light-blue;
  }

  h5 {
    font-size: inherit;
    font-weight: 400;
    color: #11324F;
  }

  h5,
  p {
    line-height: 1.5;
  }

  a {
    color: $orange;
  }

  ul,
  ol {
    margin-bottom: 30px;
    padding: 0;
  }

  li p {
    margin-bottom: 0;
  }

  .print-header,
  .print-footer {
    text-align: center;
    background: #FFF;
    font-size: 9pt;
  }

  .print-header {
    border-bottom: 1px solid $line;
    margin: 0 -20px 40px;
    padding: 15pt;
  }

  .print-footer {
    margin: 60px 0 0;
  }

  .list {
    margin: 0 0 20px;

    h4 {
      margin-top: 30px;
    }

    p {
      margin: 0 0 4px;
    }
  }

  @page {
    size: auto;
    margin: 20mm 0;
  }
}

</style>
