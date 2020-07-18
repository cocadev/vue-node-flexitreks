import db from '../utils/db';
import Controller from './Controller';
import GalleriesController from './Galleries';
import MediaController from './Media';
import content from '../schema/content';
import str from '../schema/string';
import int from '../schema/int';

class BikesController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.short_name = str('Supply a short name', false, false);
    schema.content = content();
    schema.gallery_id = int('Supply a gallery', false);
    schema.default_order = int('Supply an order', false);
    return schema;
  }

  /**
   * Get tour bikes for a tour/season combo
   *
   * @param {int}   tour_id
   * @param {array} tour_seasons array of tour_seasons ids
   */
  static async get_tour_bikes(tour_id, tour_seasons) {
    const bikes = await db
      .from('bikes')
      .innerJoin('tour_bikes', 'bikes.id', 'tour_bikes.bike_id')
      .where({ tour_id })
      .whereIn('tour_season_id', tour_seasons)
      .orderBy('order', 'ASC')
      .select('tour_bikes.id', 'bikes.id as bike_id', 'name', 'short_name', 'content', 'bikes.gallery_id as bike_gallery_id', 'tour_bikes.gallery_id as tour_bike_gallery_id', 'cost', 'boat_id', 'nights', 'tour_season_id', 'order');

    return bikes;
  }

  static get_admin_tour_bikes(tour_id, tour_seasons) {
    return db
      .from('bikes')
      .innerJoin('tour_bikes', 'bikes.id', 'tour_bikes.bike_id')
      .where({ tour_id })
      .whereIn('tour_season_id', tour_seasons)
      .orderBy('order', 'ASC')
      .select('tour_bikes.id', 'bikes.id as bike_id', 'name', 'short_name', 'content', 'bikes.gallery_id as bike_gallery_id', 'tour_bikes.gallery_id as tour_bike_gallery_id', 'cost', 'boat_id', 'nights', 'tour_season_id', 'net', 'order');
  }

  /**
   * Get tour bikes for a tour/season combo
   *
   * @param {int}   tour_id
   * @param {array} tour_seasons array of tour_seasons ids
   */
  static async get_tour_season_bikes(tour_id, tour_season_id) {
    const bikes = await db
      .from('bikes')
      .innerJoin('tour_bikes', 'bikes.id', 'tour_bikes.bike_id')
      .where({ tour_id, tour_season_id })
      .orderBy('order', 'ASC')
      .select('tour_bikes.id', 'bikes.id as bike_id', 'name', 'short_name', 'content', 'bikes.gallery_id as bike_gallery_id', 'tour_bikes.gallery_id as tour_bike_gallery_id', 'cost', 'boat_id', 'nights', 'tour_season_id', 'formula', 'gross', 'non_com', 'markup_rate_id', 'net', 'adjustment', 'order');

    return bikes;
  }

  static async resolve_tour_bike_galleries(bikes) {
    const ids = bikes.map(bike => {
      return bike.tour_bike_gallery_id || bike.bike_gallery_id;
    }).filter(a => a);

    if (!ids.length) return [];

    const galleries = await GalleriesController.get_by_ids(ids);
    const image_ids = [].concat(...galleries.map(g => g.media));

    return await MediaController.get_media_by_ids(image_ids);
  }
}

export default BikesController;
