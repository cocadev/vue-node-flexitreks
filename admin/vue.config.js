module.exports = {
  devServer: {
    open: false,
    port: 4000,
    proxy: {
      '/api': {
        target: 'https://api.flexitreksapi.com'
      }
    }
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,

  css: {
    extract: false
  }
}
