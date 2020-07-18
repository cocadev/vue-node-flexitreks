import db from '../utils/db';
import LinkController from './LinkController';

class TourMetaController extends LinkController {
  /**
   * Convert a meta array into an key/value object
   * 
   * @param {int} tour_id 
   */
  static async get(tour_id) {
    const meta = await db
      .from('tour_meta')
      .where({ tour_id });

    if (!meta.length) return {};
    return meta.reduce((c, m) => {
      c[m.key] = m.value;
      return c;
    }, {});
  }

  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {array} request 
   */
  static async handle_links(tour_id, request) {
    const current = await db
      .from('tour_meta')
      .where({ tour_id });
  
    request.forEach(instance => {
      const update = current.find(m => m.key === instance.key);
      if (update) instance.id = update.id;
    });

    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'id',
      'tour_meta'
    );
  }
}

export default TourMetaController;
