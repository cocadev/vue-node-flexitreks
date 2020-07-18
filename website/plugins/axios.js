export default function ({ $axios, redirect, isStatic, env }) {
  $axios.onRequest(config => {
    const isOutgoing = config.method === 'post' || config.method === 'put' || config.url.indexOf('bookings/reference') === 0;

    if (isStatic && process.browser && !isOutgoing) {
      config.baseURL = '/data/api/v1/'
      config.url += '.json'
    }

    return config
  })

  if (process.server && process.static) {
    const mkdirp = require('mkdirp-promise')
    const { join, dirname } = require('path')
    const { writeFileSync } = require('fs')

    $axios.interceptors.response.use(
      async function (response) {
        const path = join(env.dataDir, response.request.path + '.json')
        await mkdirp(dirname(path))
        writeFileSync(path, JSON.stringify(response.data))
        return response
      }, function (error) {
        return Promise.reject(error)
      }
    )
  }

}