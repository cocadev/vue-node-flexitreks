import db from '../utils/db';
import Controller from './Controller';
import str from '../schema/string';
import int from '../schema/int';
import date from '../schema/date';
import content from '../schema/content';
import array_of_int from '../schema/array_of_int';
import array_of_object from '../schema/array_of_object';
import TourOffersController from './TourOffers';
import MediaController from './Media';

class OffersController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.status = str('Supply an offer status');
    schema.type = str('Supply an offer type');
    schema.discount = int('Supply a discount', false);
    schema.booking_window_start = date('Supply a booking window start date');
    schema.booking_window_end = date('Supply a booking window end date');
    schema.start_window_start = date('Supply a start date window start date');
    schema.start_window_end = date('Supply a start date window end date');
    schema.bike_ids = array_of_int('Supply a list of bikes');
    schema.tour_ids = array_of_object('Supply a list of tours', {
      tour_id: {
        type: Number,
        required: true
      }
    });
    schema.slug = str('Supply an offer slug');
    schema.title = str('Supply an offer page title');
    schema.subtitle = str('Supply an offer page subtitle');
    schema.content = content('Supply offer content');
    schema.media_id = int('Supply an offer image', false);
    return schema;
  }

  static async getAll(settings = {}) {
    let query = db.select('*')
    if (settings.status) query = query.where({ 'status': settings.status })
    if (settings.order) query = query.orderBy(settings.order, settings.order_dir || 'ASC')
    query = query.from('offers');
    return await query
  }

  static async get(id) {
    const offer = await super.get(id);
    if (!offer) return null;

    offer.tour_ids = await db('tour_offers').where({ offer_id: offer.id });
    return offer;
  }

  static async get_by_slug(slug) {
    const offer = await super.get_by_slug(slug);
    if (!offer) return null;

    if (offer.media_id) offer.image = await MediaController.get_media_by_id(offer.media_id);
    offer.tour_ids = await db('tour_offers').where({ offer_id: offer.id });

    const tour_ids = offer.tour_ids.map(tour => tour.tour_id);
    const tour_destinations = await db('tour_destinations').whereIn('tour_id', tour_ids);
    offer.destinations = await db('destinations')
      .whereIn('id', tour_destinations.map(x => x.destination_id))
      .orderBy('name')
      .select('id', 'name', 'media_id', 'slug');

    await MediaController.resolve_media(offer.destinations);

    return offer;
  }

  static create (instance) {
    return this.create_or_update(instance);
  }

  static async update(instance) {
    return this.create_or_update(instance, true);
  }

  static async create_or_update(instance, update) {
    let tour_ids = [];
    if (instance.tour_ids) tour_ids = instance.tour_ids;
    delete instance.tour_ids;

    const result = await super[update ? 'update' : 'create'](instance);

    await TourOffersController.handle_links(result.id, tour_ids);

    return result;
  }

  static get_tours_for_offer(offer_id) {
    return db
      .from('tours')
      .innerJoin('tour_offers', 'tours.id', 'tour_offers.tour_id')
      .where({ 'offer_id': offer_id })
      .select('offer_id', 'tour_id');
  }

  static get_offers_for_tour(tour_id) {
    return db
      .select('*')
      .from('offers')
      .innerJoin('tour_offers', 'offers.id', 'tour_offers.offer_id')
      .where({ 'tour_id': tour_id })
      .orderBy('createdAt');
  }

  static get_live_offers_for_tour(tour_id) {
    return this.get_offers_for_tour(tour_id)
      .where({ status: 'live' });
  }
}

export default OffersController;
