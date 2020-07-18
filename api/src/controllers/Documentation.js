import db from '../utils/db';
import MediaController from './Media';
import Controller from './Controller';
import int from '../schema/int';
import content from '../schema/content';

class TourDocumentationController extends Controller {
  static table() { return 'tour_documentation'; }

  static schema() {
    return {
      map_id: int('Supply a map', false),
      arrival: content('Supply arrival content'),
      luggage: content('Supply luggage content'),
      food: content('Supply food content'),
      bike_details: content('Supply bike content'),
      id: int('Supply the documentation id', false)
    };
  }

  static async get(tour_id) {
    const documentation = await this.get_documentation_for_tour(tour_id);
    if (!documentation) return null;
    const map = documentation.map_id;
    documentation.map = map ? await MediaController.get_media_by_id(map) : null;
    return documentation;
  }

  static get_documentation_for_tour(tour_id) {
    return db
      .from('tour_documentation')
      .where({ tour_id })
      .first();
  }
}

export default TourDocumentationController;
