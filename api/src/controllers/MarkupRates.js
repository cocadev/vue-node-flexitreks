import db from '../utils/db';

class MarkupRatesController {
  static table() { return 'markup_rates'; }

  static get_rates_for_models(ids) {
    return db(this.table())
      .whereIn('markup_model_id', ids)
      .orderBy('commission', 'DESC');
  }

  static get_rates_for_model(markup_model_id) {
    return db(this.table())
      .where({ markup_model_id })
      .orderBy('commission', 'DESC');
  }
}

export default MarkupRatesController;
