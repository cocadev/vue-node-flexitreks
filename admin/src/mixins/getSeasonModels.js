// Create season models object, so models can only be chosen for correct season
export default {
  methods: {
    getSeasonModels (models) {
      return models.reduce(function (seasonObj, model) {
        let key = 'season_' + model.season_id.toString()
        seasonObj[key] = seasonObj[key] || [{ name: 'Pick a model', id: null }]
        seasonObj[key].push(model)
        return seasonObj
      }, Object.create(null))
    }
  }
}
