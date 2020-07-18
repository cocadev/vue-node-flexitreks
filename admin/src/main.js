import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueQuillEditor from 'vue-quill-editor'
import Toasted from 'vue-toasted'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'v-slim-dialog/dist/v-slim-dialog.css'
import SlimDialog from 'v-slim-dialog'
import Sticky from 'vue-sticky-directive'
import vClickOutside from 'v-click-outside'

Vue.config.productionTip = false
// axios.defaults.baseURL = 'https://api.flexitreksapi.com/api/v1/'
axios.defaults.baseURL = 'http://localhost:8080/api/v1/'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('flexitreks_jwt')

axios.interceptors.response.use(null, function (error) {
  if (error.response.status === 401) {
    localStorage.removeItem('flexitreks_jwt')
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

Vue.use(VueAxios, axios)

Vue.use(Toasted, {
  duration: 3000,
  position: 'top-right'
})

Vue.use(VueQuillEditor, {
  modules: {
    toolbar: [
      ['bold', 'italic'],
      ['blockquote'],
      [{ 'header': [2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean'],
      ['link', 'image']
    ]
  }
})

Vue.use(SlimDialog)

Vue.use(Sticky)

Vue.use(vClickOutside)

router.beforeEach((to, from, next) => {
  if (to && to.name === 'login') {
    localStorage.removeItem('flexitreks_jwt')
    return next()
  }

  const token = localStorage.getItem('flexitreks_jwt')
  if (!token) return next({ name: 'login' })

  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
