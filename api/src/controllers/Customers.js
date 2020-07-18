import db from '../utils/db';
import Controller from './Controller';
import str from '../schema/string';
import email from '../schema/email';
import tel from '../schema/tel';

class CustomersController extends Controller {
  static schema() {
    return {
      title: str('Supply a customer salutation'),
      first_name: str('Supply a customer first name'),
      last_name: str('Supply a customer last name'),
      email_address: email(),
      telephone_number: tel('Supply a telephone number'),
      alternative_telephone_number: tel('Supply a telephone number', false),
      country: str('Supply a country'),
      address_line_1: str('Supply an address'),
      address_line_2: str('Supply a second line', false),
      town: str('Supply a town'),
      county: str('Supply a county'),
      postcode: str('Supply a Postcode'),
    };
  }

  static async get(id) {
    return await this.get_customer_by_id(id);
  }

  static get_customer_by_id(id) {
    return db
      .select(
        'id',
        'title',
        'first_name',
        'last_name',
        'email_address',
        'telephone_number',
        'alternative_telephone_number',
        'country',
        'address_line_1',
        'address_line_2',
        'town',
        'county',
        'postcode'
      )
      .from('customers')
      .where({ id })
      .first();
  }
}

export default CustomersController;
