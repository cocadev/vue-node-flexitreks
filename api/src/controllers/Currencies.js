import Controller from './Controller';
import str from '../schema/string';
import ExchangeRatesController from './ExchangeRates';

class CurrenciesController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.symbol = str('Supply a currency symbol', false, false);
    return schema;
  }

  static async getAll(id) {
    const currencies = await super.getAll(id);
    if (!currencies.length) return [];
    
    const rates = await ExchangeRatesController.getAll();
    currencies.forEach(currency => {
      currency.rates = rates.filter(x => x.currency_id === currency.id);
    });

    return currencies;
  }

  static async get(id) {
    const currency = await super.get(id);
    if (!currency) return null;

    currency.rates = await ExchangeRatesController.get_seasons(id);

    return currency;
  }
}

export default CurrenciesController;
