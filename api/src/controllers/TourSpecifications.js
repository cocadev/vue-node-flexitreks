import db from '../utils/db';
import Controller from './Controller';
import content from '../schema/content';

class TourSpecificationsController extends Controller {
  static table() { return 'tour_specifications'; }

  static schema() {
    return {
      price_includes: content('Supply price includes'),
      price_excludes: content('Supply price excludes')
    };
  }

  static get_specifications(tour_id, seasons) {
    return db
      .from(this.table())
      .where({ tour_id })
      .whereIn('tour_season_id', seasons);
  }
}

export default TourSpecificationsController;
