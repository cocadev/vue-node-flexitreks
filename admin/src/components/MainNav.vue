<template>
  <nav class="main-nav">
    <router-link to="/">
      <img src="/bookings.svg"> Bookings
    </router-link>
    <router-link to="/tours/">
      <img src="/tours.svg"> Tours
    </router-link>
    <router-link to="/global/">
      <img src="/globe.svg">  Global
    </router-link>
  </nav>
</template>

<style lang="scss">
.main-nav {
  background: #EDF4F6;
  font-weight: 700;
  font-size: 14px;
  padding: 9px 30px 30px 0;

  a {
    border-bottom: 1px solid #D5DDE2;
    padding: 40px 0;
    display: block;
  }

  img {
    vertical-align: middle;
    transform: translateY(-1px);
    margin-right: 5px;
    display: inline;
  }

  @media (max-width: 599px) {
    display: table;
    width: calc(100% + 40px);
    text-align: center;
    padding: 0;
    margin: 0 0 20px -20px;

    img {
      display: block;
      width: 19px;
      margin: 0 auto;
    }

    a {
      display: table-cell;
      padding: 10px 5px;
    }
  }
}

</style>
