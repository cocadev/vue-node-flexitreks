import db from '../utils/db';
import LinkController from './LinkController';
import array_of_object from '../schema/array_of_object';

class TourRoutesController extends LinkController {
  static schema() {
    return {
      routes: array_of_object('Supply a list of routes', {
        name: {
          required: true,
          type: String
        },
        tour_season_id: {
          required: true,
          type: Number
        },
        id: {
          required: false,
          type: Number
        }
      })
    };
  }

  static get_routes(tour_id, tour_seasons) {
    return db
      .from('tour_routes')
      .select('id', 'name')
      .where({ tour_id })
      .whereIn('tour_season_id', tour_seasons)
      .orderBy('id');
  }

  static get_routes_for_season(tour_id, tour_season_id) {
    return db
      .from('tour_routes')
      .select('id', 'name')
      .where({ tour_id, tour_season_id })
      .orderBy('id');
  }

  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {int}   tour_season_id
   * @param {array} request 
   */
  static async handle_links(tour_id, tour_season_id, request) {
    const current = await this.get_routes_for_season(tour_id, tour_season_id);

    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'id',
      'tour_routes'
    );
  }
}

export default TourRoutesController;
