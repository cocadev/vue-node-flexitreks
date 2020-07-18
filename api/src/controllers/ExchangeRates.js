import LinkController from './LinkController';
import db from '../utils/db';
import float from '../schema/float';
import PriceCalculation from './PriceCalculation';

class ExchangeRatesController extends LinkController {
  static table() { return 'exchange_rates'; }

  static schema() {
    return {
      rate: float('Supply an exchange rate')
    };
  }

  static get_rate(currency_id, season_id) {
    return db(this.table())
      .where({ season_id, currency_id })
      .first();
  }

  static async update(instance) {
    const query = {
      currency_id: instance.currency_id,
      season_id: instance.season_id
    };

    await db.transaction(trx => {
      return trx
        .where(query)
        .update(instance)
        .into(this.table())
        .returning('*')
        .then(rows => rows[0]);
    });

    await PriceCalculation.update_where({ currency_id: instance.currency_id });
  }

  static async get_seasons(currency_id) {
    return db(this.table()).where({ currency_id });
  }
}

export default ExchangeRatesController;
