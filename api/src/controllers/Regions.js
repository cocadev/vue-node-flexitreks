import db from '../utils/db';
import ToursController from './Tours';
import Controller from './Controller';
import str from '../schema/string';
import PagesController from './Pages';

class RegionsController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.slug = str('Supply the slug');
    return schema;
  }

  static async getAll(settings) {
    const regions = await super.getAll(settings);
    const explore_pages = await PagesController.get_marketing_pages(regions.map(r => r.id), 'region_id');

    return regions.map(region => {
      const page = explore_pages.find(p => p.region_id === region.id);
      region.explore = page ? { slug: page.slug } : null;
      return region;
    });
  }

  static async get(id) {
    const region = await super.get(id);
    if (!region) return null;
    region.tours = await ToursController.get_tours_for_region(id);
    return region;
  }

  static get_simple(id) {
    return super.get(id);
  }

  static async get_by_slug(slug) {
    const region = await super.get_by_slug(slug);
    if (!region) return null;
    region.tours = await ToursController.get_tours_for_region(region.id);
    return region;
  }

  static get_regions_for_tour(tour_id) {
    return db
      .from('regions')
      .innerJoin('tour_regions', 'regions.id', 'tour_regions.region_id')
      .where({ 'tour_id': tour_id })
      .select('regions.id', 'name');
  }

  static get_regions_for_destination(destination_id) {
    return db
      .from('regions')
      .innerJoin('destination_regions', 'regions.id', 'destination_regions.region_id')
      .where({ 'destination_id': destination_id })
      .select('regions.id', 'name');
  }
}

export default RegionsController;
