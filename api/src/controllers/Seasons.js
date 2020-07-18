import db from '../utils/db';
import Controller from './Controller';

class SeasonsController extends Controller {
  static get_tour_seasons_for_tour(tour_id) {
    return db
      .from('tour_seasons')
      .innerJoin('seasons', 'tour_seasons.season_id', 'seasons.id')
      .where({ 'tour_id': tour_id })
      .select('tour_seasons.id', 'seasons.id as season_id', 'tour_id', 'name', 'live', 'deposit', 'currency_id', 'markup_model_id')
      .orderBy('seasons.name', 'DESC');
  }
}

export default SeasonsController;
