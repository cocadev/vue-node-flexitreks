<template>
  <div
    :style="{'background-color': page.ksp_bg_hex}"
    class="container-fluid search"
  >
    <div class="main">
      <f-html :data="page.ksp_content" />
      <p
        v-show="page.ksp_button_title && page.ksp_button_url"
        :style="{'color': page.ksp_bg_hex}"
        class="btn"
      > {{ page.ksp_button_title }} </p>
    </div>
  </div>
</template>

<script>
import FHtml from './FHtml'

export default {
  components: {
    FHtml
  },
  props: {
    page: {
      type: Object,
      required: true
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

 .search {
    background: $light-blue;
    position: absolute;
    width: 100%;
    left: 0;
    color: white;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-self: center;
    flex-direction: column;
    text-align: center;
 }
 .btn {
   width: 200px;
   height: 50px;
   border-radius: 5px;
   background: white;
   color: $light-blue;
   display: flex;
   justify-content: center;
   align-items: center;
   justify-self: center;
   text-align: center;
 }
 .btn:hover {
   cursor: pointer;
 }
 .title {
   font-weight: 600;
   font-size: 30px;
   margin: -20px 0 10px
 }
 .main {
   width: 60%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   justify-self: center;
   margin-top: 20px;
 }
 .ksp-content{
   color: white;
 }

  @media (max-width: 800px) {
    .search {
      padding: 20px;
    }
    .main {
      width: 100%;
    }
    .title {
      font-weight: 600;
      font-size: 20px;
    }
    .btn {
      width: 160px;
      height: 40px;
      border-radius: 5px;
      background: white;
    }
  }
</style>
