import db from '../utils/db';
import LinkController from './LinkController';

class DestinationRegionsController extends LinkController {
  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   destination_id
   * @param {array} request 
   */
  static async handle_links(destination_id, request) {
    const current = await db('destination_regions').where({ destination_id });
    return super.handle_tour_link_tables(
      destination_id,
      request,
      current,
      'region_id',
      'destination_regions',
      'destination_id',
      'region_id'
    );
  }
}

export default DestinationRegionsController;
