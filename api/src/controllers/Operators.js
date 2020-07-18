import db from '../utils/db';
import ToursController from './Tours';
import Controller from './Controller';
import content from '../schema/content';

class OperatorsController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.contact = content('Supply contact details');
    return schema;
  }

  static async getAll(settings) {
    let query = db.select('id', 'name')
    if (settings && settings.order) query = query.orderBy(settings.order, settings.order_dir || 'ASC')
    query = query.from('operators');
    return await query
  }

  static async get(id) {
    const operator = await super.get(id);
    if (!operator) return null;
    operator.tours = await ToursController.get_tours_for_operator(id);
    return operator;
  }
}

export default OperatorsController;
