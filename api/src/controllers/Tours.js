import db from '../utils/db';
import h from '../utils/helpers';
import RegionsController from './Regions';
import DestinationsController from './Destinations';
import TourItinerariesController from './TourItineraries';
import TourExtrasController from './TourExtras';
import TourRoutesController from './TourRoutes';
import TourPricingCategoriesController from './TourPricingCategories';
import TourPricesController from './TourPricing';
import TourReductionsControllers from './TourReductions';
import BikesController from './Bikes';
import BoatsController from './Boats';
import SeasonsControllers from './Seasons';
import Controller from './Controller';
import str from '../schema/string';
import int from '../schema/int';
import content from '../schema/content';
import array_of_int from '../schema/array_of_int';
import array_of_string from '../schema/array_of_string';
import { validationResult } from 'express-validator/check';
import array_of_object from '../schema/array_of_object';
import TourHotelsController from './TourHotels';
import TourRestaurantsController from './TourRestaurants';
import TourRegionsController from './TourRegions';
import TourDestinationsController from './TourDestinations';
import TourSeasonsController from './TourSeasons';
import TourMetaController from './TourMeta';
import MediaController from './Media';
import GalleriesController from './Galleries';
import boolean from '../schema/boolean';
import ReviewsController from './Reviews';
import TourWeatherController from './Weather';
import OffersController from './Offers';
import TourSpecificationsController from './TourSpecifications';
import PriceCalculation from './PriceCalculation';

class ToursController extends Controller {

  static schema() {
    return {
      name: str('Supply a tour name', true, false),
      name_short: str('Supply a short name', false, false),
      name_operator: str('Supply an operator-tour name', false, false),
      excerpt: content('Supply an excerpt'),
      content: content(),
      tour_code: str('Supply a tour code'),
      status: str('Supply a tour status', false),
      operator_id: int('Supply an operator id'),
      gallery_id: int('Supply an gallery id', false),
      accommodation_gallery_id: int('Supply an accommodation gallery id', false),
      media_id: int('Supply a featured image', false),
      hero_id: int('Supply a hero image', false),
      nights: array_of_int('Supply a number of nights', false),
      slug: str('Supply a slug'),
      related_tours: array_of_int('Supply a list of related tours'),
      difficulty: array_of_string('Supply a difficulty'),
      guidance: int('Supply a guidance level'),
      length: str('Supply a tour length', true, false),
      balance_due: int('Supply a tour balance due', false),
      months: str('Supply months'),
      highlights: content('Supply the highlights'),
      bike_and_boat: boolean('Is this a bike and boat tour?'),
      deleted: boolean('Is this a deleted tour?', false),
      solo_cyclists_allowed: boolean('Allow solo cyclists on this tour?', false),
      start_point: str('Supply start point', false),
      finish_point: str('Supply finish point', false),
      arrival_days: str('Supply arrival days', false),
      hotels: array_of_object('Supply a list of hotels', {
        hotel_id: {
          required: true,
          type: Number
        },
        order: {
          required: false,
          type: Number
        }
      }),
      restaurants: array_of_object('Supply a list of restaurants', {
        restaurant_id: {
          required: true,
          type: Number
        }
      }),
      regions: array_of_object('Supply a list of regions', {
        region_id: {
          required: true,
          type: Number
        }
      }),
      destinations: array_of_object('Supply a list of destinations', {
        destination_id: {
          required: true,
          type: Number
        }
      }),
      seasons: array_of_object('Supply a list of seasons', {
        season_id: {
          required: true,
          type: Number
        },
        id: {
          required: false,
          type: Number
        },
        live: {
          required: false,
          type: Boolean
        },
        deposit: {
          required: false,
          type: Number
        },
        currency_id: {
          required: false,
          type: Number
        },
        markup_model_id: {
          required: false,
          type: Number
        }
      }),
      meta: array_of_object('Supply tour meta', {
        key: {
          required: true,
          type: String
        },
        value: {
          required: true,
          type: String
        },
        id: {
          required: false,
          type: Number
        }
      }),
    };
  }

  static async getAll() {
    let tours = []
    let double_tours = await db
      .select('tours.id as id', 'tours.name as name', 'slug', 'status', 'media_id', 'tour_code', 'markup_models.name as markup_model_name', 'seasons.name as season_name')
      .leftJoin('tour_seasons', 'tours.id', 'tour_seasons.tour_id')
      .leftJoin('seasons', 'tour_seasons.season_id', 'seasons.id')
      .leftJoin('markup_models', 'tour_seasons.markup_model_id', 'markup_models.id')
      .orderBy('name', 'ASC')
      .where({ deleted: false })
      .from('tours');
    double_tours.map((item) => {
      let last_item = tours[tours.length - 1];
      if (!last_item || last_item.id != item.id) {
        let new_item = {
          name: item.name,
          id: item.id,
          slug: item.slug,
          status: item.status,
          media_id: item.media_id,
          tour_code: item.tour_code,
          seasons: {}
        };
        new_item.seasons[item.season_name] = [item.markup_model_name];
        tours.push(new_item);
      } else {
        if (!last_item.seasons[item.season_name]) last_item.seasons[item.season_name] = [];
        last_item.seasons[item.season_name].push(item.markup_model_name);
      }
    })
    return tours;
  }

  static getAllLive() {
    return db
      .select('id', 'name', 'slug', 'status', 'media_id')
      .where({ status: 'live' })
      .orderBy('name', 'ASC')
      .from(this.table());
  }

  static get_by_method(data, method) {
    return this[method](data);
  }

  static get_by_slug(slug) {
    return this.get(slug, 'slug');
  }

  static async get(id, type = 'id') {
    const tour = await this.get_by_method(id, type === 'id' ? 'get_tour_by_id' : 'get_tour_by_slug');
    if (!tour) return null;
    id = tour.id;

    const tour_seasons = await SeasonsControllers.get_tour_seasons_for_tour(id);
    const live_seasons = tour_seasons.filter(s => s.live);
    const tourSeasonIds = live_seasons.map(s => s.id);

    const [
      destinations,
      regions,
      itinerary,
      room_extras,
      party_extras,
      routes,
      categories,
      prices,
      reductions,
      specifications,
      offers,
      bikes,
      gallery,
      accommodation_gallery,
      image,
      hero,
      meta,
      related_tours,
      reviews,
      weather
    ] = await Promise.all([
      DestinationsController.get_destinations_for_tour(id),
      RegionsController.get_regions_for_tour(id),
      TourItinerariesController.get_itineraries(id),
      TourExtrasController.get_room_extras(id, tourSeasonIds),
      TourExtrasController.get_party_extras(id, tourSeasonIds),
      TourRoutesController.get_routes(id, tourSeasonIds),
      TourPricingCategoriesController.get_categories(id, tourSeasonIds),
      TourPricesController.get_prices(id, tourSeasonIds),
      TourReductionsControllers.get_reductions(id, tourSeasonIds),
      TourSpecificationsController.get_specifications(id, tourSeasonIds),
      OffersController.get_live_offers_for_tour(id),
      BikesController.get_tour_bikes(id, tourSeasonIds),
      GalleriesController.get(tour.gallery_id),
      GalleriesController.get(tour.accommodation_gallery_id),
      MediaController.get_media_by_id(tour.media_id),
      MediaController.get_media_by_id(tour.hero_id),
      TourMetaController.get(id),
      this.get_tours_by_ids(tour.related_tours || []),
      ReviewsController.get_reviews_for_tour(id, 3),
      TourWeatherController.get(id)
    ]);

    tour.destinations = destinations;
    tour.regions = regions;
    tour.itinerary = itinerary;

    PriceCalculation.obscure(room_extras);
    PriceCalculation.obscure(party_extras);

    tour.room_extras = room_extras;
    tour.party_extras = party_extras;

    tour.routes = routes;
    tour.image = image;
    tour.hero = hero;
    tour.gallery = gallery;
    tour.accommodation_gallery = accommodation_gallery;
    tour.meta = meta;
    tour.seasons = live_seasons;
    tour.allSeasons = tour_seasons;
    tour.reviews = reviews;
    tour.weather = weather;

    if (related_tours.length) await this.resolve_destinations(related_tours);
    tour.related = await MediaController.resolve_media(related_tours);

    const boat_ids = [];

    tour.categories = categories.map(category => {
      if (category.boat_id && !boat_ids.includes(category.boat_id)) boat_ids.push(category.boat_id);
      if (category.specific_dates === null) delete category.specific_dates;
      if (category.restricted_dates === null) delete category.restricted_dates;
      if (category.restricted_days === null) delete category.restricted_days;
      if (category.start === null) delete category.start;
      if (category.end === null) delete category.end;
      if (category.boat_id === null) delete category.boat_id;
      if (category.guided === null) delete category.guided;
      if (category.nights === null) delete category.nights;
      return category;
    });

    tour.prices = prices.map(price => {
      if (!price.room_type_id) delete price.room_type_id;
      if (!price.accommodation_category_id) delete price.accommodation_category_id;
      if (!price.deck_id) delete price.deck_id;

      delete price.formula;
      delete price.net;
      delete price.gross;
      delete price.non_com;
      delete price.adjustment;
      delete price.markup_rate_id;

      return price;
    });

    this.resolve_min_max(tour, tour.prices);

    if (boat_ids.length) {
      let myBoats = await BoatsController.get_by_ids(boat_ids);
      await Promise.all(myBoats.map(async boat => {
       boat.gallery = await GalleriesController.get(boat.gallery_id)
       return boat
      }));
      tour.boats = myBoats
    }

    tour.reductions = reductions;
    tour.specifications = specifications;
    tour.offers = offers;
    tour.bikes = bikes;
    tour.bike_gallery = await BikesController.resolve_tour_bike_galleries(bikes);

    return tour;
  }

  static async update(instance) {
    return db.transaction(trx => {
      return trx
        .where({ id: instance.id })
        .update(instance)
        .into(this.table())
        .returning('*')
        .then(rows => rows[0]);
    });
  }

  /**
   * Creating/Updating a tour is complex as there are other tables
   * at play. The additional 'link' items to update are:
   *
   * - TourHotels
   * - TourRestaurants
   * - TourRegions
   * - TourDestinations
   * - TourSeasons
   * - TourMeta
   *
   * The procedure for each type should be:
   *
   * - Check if it has been supplied
   * - Pass it to the appropriate controller
   * - Get all current links items
   * - Add any new items
   * - Update any existing items
   * - Delete any removed items
   *
   */
  static async create_or_update(req, res, id = null) {
    try {
      validationResult(req).throw();

      /**
       * Link up link types and their respective controller
       */
      const types = {
        hotels: TourHotelsController,
        restaurants: TourRestaurantsController,
        regions: TourRegionsController,
        destinations: TourDestinationsController,
        seasons: TourSeasonsController,
        meta: TourMetaController
      };

      /**
       * Create the schema, parse the request and remove unnecessary additionals
       */
      const request = h.request(req.body, id, this.schema());
      const additionals = Object.keys(types).reduce((c, k) => {
        if (req.body[k] !== undefined) c[k] = request[k];
        delete request[k];
        return c;
      }, {});

      /**
       * Create or update the tour
       */
      let instance;
      if (id) {
        instance = await this.update(request);
        if (!instance) return h.notFound(res);
      } else {
        instance = await this.create(request);
      }

      /**
       * Create or update the additionals
       */
      await Promise.all(Object.keys(additionals).map(key => {
        return additionals[key] ? types[key].handle_links(id || instance.id, additionals[key]) : null;
      }).filter(n => n));

      res.status(id ? 200 : 201).json(instance);

    } catch (e) {
      return h.error(e, res);
    }
  }

  static create_route() {
    return async (req, res) => {
      return this.create_or_update(req, res);
    };
  }

  static update_route() {
    return async (req, res) => {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return h.notFound(res);
      return this.create_or_update(req, res, id);
    };
  }

  static async get_tour_by_slug(slug) {
    return db
      .from('tours')
      .select('id', 'name', 'name_short', 'name_operator', 'excerpt', 'content', 'tour_code', 'status', 'operator_id', 'gallery_id', 'accommodation_gallery_id', 'media_id', 'hero_id', 'nights', 'slug', 'related_tours', 'guidance', 'difficulty', 'length', 'months', 'highlights', 'bike_and_boat', 'balance_due', 'rating', 'solo_cyclists_allowed', 'start_point', 'finish_point', 'arrival_days')
      .where({ slug })
      .first();
  }

  static async get_tours_by_codes(codes) {
    return db
      .from('tours')
      .select('id', 'tour_code')
      .whereIn('tour_code', codes);
  }

  static get_tour_by_id(id) {
    return db
      .from('tours')
      .select('id', 'name', 'name_short', 'name_operator', 'excerpt', 'content', 'tour_code', 'status', 'operator_id', 'gallery_id', 'accommodation_gallery_id', 'media_id', 'hero_id', 'nights', 'slug', 'related_tours', 'guidance', 'difficulty', 'length', 'months', 'highlights', 'bike_and_boat', 'balance_due', 'rating', 'deleted', 'solo_cyclists_allowed', 'start_point', 'finish_point', 'arrival_days')
      .where({ id })
      .first();
  }

  static get_tours_by_ids(ids) {
    return super.get_by_ids(ids);
  }

  static async get_by_ids(ids) {
    return await this.get_tours_select(
      db('tours')
        .whereIn('id', ids)
    );
  }

  static async get_tours_for_region(region_id) {
    return await this.get_tours_select(
      db('tours')
        .where({ status: 'live' })
        .innerJoin('tour_regions', 'tours.id', 'tour_regions.tour_id')
        .where({ 'region_id': region_id })
    );
  }

  static async get_tours_for_destination(destination_id) {
    return await this.get_tours_select(
      db('tours')
        .where({ status: 'live' })
        .innerJoin('tour_destinations', 'tours.id', 'tour_destinations.tour_id')
        .where({ 'destination_id': destination_id })
    );
  }

  static async get_tours_for_operator(operator_id) {
    return await this.get_tours_select(
      db('tours')
        .where({ 'operator_id': operator_id })
    );
  }

  static async get_tours_select(query) {
    const tours = await query
      .select('tours.id', 'name', 'name_short', 'name_operator', 'excerpt', 'content', 'tour_code', 'status', 'operator_id', 'gallery_id', 'accommodation_gallery_id', 'media_id', 'hero_id', 'nights', 'slug', 'related_tours', 'guidance', 'difficulty', 'length', 'months', 'highlights', 'bike_and_boat', 'balance_due', 'rating', 'solo_cyclists_allowed', 'start_point', 'finish_point', 'arrival_days')
      .orderBy('name', 'ASC');

    await Promise.all([
      this.resolve_destinations(tours),
      this.resolve_offers(tours),
      this.resolve_min_maxs(tours)
    ]);

    return MediaController.resolve_media(tours);
  }

  static async resolve_destinations(tours) {
    const tour_ids = tours.map(tour => tour.id);
    const tour_destinations = await db('tour_destinations').whereIn('tour_id', tour_ids);
    const destinations = await db('destinations').whereIn('id', tour_destinations.map(td => td.destination_id));

    tours.forEach(tour => {
      tour.destinations = tour_destinations.reduce((current, td) => {
        if (td.tour_id === tour.id) {
          current.push(destinations.find(d => d.id === td.destination_id));
        }
        return current;
      }, []);
    });
  }

  static async resolve_offers(tours) {
    const tour_ids = tours.map(tour => tour.id);
    const tour_offers = await db('tour_offers').whereIn('tour_id', tour_ids);
    const offers = await db('offers')
      .select('id', 'name', 'content')
      .where({ status: 'live' })
      .whereIn('id', tour_offers.map(x => x.offer_id))
      .orderBy('createdAt');

    tours.forEach(tour => {
      tour.offers = tour_offers.reduce((current, x) => {
        if (x.tour_id === tour.id) {
          current.push(offers.find(o => o.id === x.offer_id));
        }
        return current;
      }, []);
    });
  }

  static async resolve_min_maxs(tours) {
    const tour_ids = tours.map(tour => tour.id);
    const tour_prices = await db('tour_prices').whereIn('tour_id', tour_ids);

    tours.forEach(tour => {
      const prices = tour_prices.filter(p => p.tour_id === tour.id);
      this.resolve_min_max(tour, prices);
    });
  }

  static resolve_min_max(tour, prices) {
    const _prices = prices.concat();
    if (_prices.length) {
      _prices.sort((a, b) => {
        return a.cost - b.cost;
      });

      tour.min_price = _prices[0].cost;
      tour.max_price = _prices.pop().cost;
    }
  }

  static async recalculate_rating(tour_id) {
    const reviews = await ReviewsController.get_reviews_for_tour(tour_id);
    if (!reviews.length) return;
    const average = reviews.reduce((current, r) => current + Number(r.rating), 0) / reviews.length;
    if (average && !isNaN(average)) {
      await this.update({
        id: tour_id,
        rating: average
      });
    }
  }
}

export default ToursController;
