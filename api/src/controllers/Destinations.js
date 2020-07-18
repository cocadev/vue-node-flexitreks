import db from '../utils/db';
import RegionsController from './Regions';
import ToursController from './Tours';
import Controller from './Controller';
import content from '../schema/content';
import str from '../schema/string';
import array_of_object from '../schema/array_of_object';
import DestinationRegionsController from './DestinationRegions';
import TourDestinationsController from './TourDestinations';
import int from '../schema/int';
import MediaController from './Media';
import PagesController from './Pages';
import GalleriesController from './Galleries';

class DestinationsController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.tipping = content();
    schema.currency = str('Supply currency details', false);
    schema.regions = array_of_object('Supply a list of regions', {
      region_id: {
        type: Number,
        required: true
      }
    });
    schema.slug = str('Supply the slug');
    schema.description = content();
    schema.media_id = int('Supply a featured image', false);
    schema.gallery_id = int('Supply a featured gallery', false);
    schema.order = int('Supply an order number', false);
    return schema;
  }

  static async getAll() {
    const destinations = await db.from('destinations').orderBy('order', 'ASC').orderBy('name', 'ASC');
    const [
      images,
      tour_destinations,
      explore_pages
    ] = await Promise.all([
      MediaController.get_media_by_ids(destinations.filter(d => d.media_id).map(d => d.media_id)),
      TourDestinationsController.group_tour_destinations(),
      PagesController.get_marketing_pages(destinations.map(d => d.id), 'destination_id')
    ]);

    return destinations.map(destination => {
      destination.tour_count = tour_destinations.filter(t => t.destination_id === destination.id).length;
      destination.image = images.find(i => i.id === destination.media_id);
      
      const page = explore_pages.find(p => p.destination_id === destination.id);
      destination.explore = page ? { slug: page.slug } : null;
      return destination;
    });
  }

  static async getAllLive() {
     const destinations = await this.getAll();
     return destinations.filter(destination => destination.tour_count > 0);
  }

  static get_simple(id) {
    return super.get(id);
  }

  static async get_method(method, data) {
    const destination = await super[method](data);
    if (!destination) return null;

    const [tours, regions, galleries] = await Promise.all([
      ToursController.get_tours_for_destination(destination.id),
      RegionsController.get_regions_for_destination(destination.id),
      GalleriesController.get(destination.gallery_id),
    ]);

    destination.tours = tours;
    destination.regions = regions;
    destination.image = await MediaController.get_media_by_id(destination.media_id);
    destination.gallery = galleries ? galleries.map(data=>data.id) : [];
    destination.gallery_details = await GalleriesController.get(destination.gallery_id);

    return destination;
  }

  static async get(id) {
    return await this.get_method('get', id);
  }

  static async get_by_slug(slug) {
    return await this.get_method('get_by_slug', slug);
  }

  static get_destinations_for_tour(tour_id) {
    return db
      .from('destinations')
      .innerJoin('tour_destinations', 'destinations.id', 'tour_destinations.destination_id')
      .where({ 'tour_id': tour_id })
      .select('destinations.id', 'name', 'currency', 'tipping', 'slug');
  }

  static async handle_regions(instance) {
    let regions = null;
    let destination = null;
    
    if (instance.regions) {
      regions = instance.regions;
      delete instance.regions;
    } else {
      delete instance.regions;
    }

    if (instance.id) {
      destination = await super.update(instance);
    } else {
      destination = await super.create(instance);
    }

    if (regions) {
      await DestinationRegionsController.handle_links(destination.id, regions);
    }

    return destination;
  }

  static create(instance) {
    return this.handle_regions(instance);
  }

  static update(instance) {
    return this.handle_regions(instance);
  }
}

export default DestinationsController;
