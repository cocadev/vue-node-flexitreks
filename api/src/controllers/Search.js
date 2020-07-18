import db from '../utils/db';
import Controller from './Controller';
import ToursController from './Tours';
import DestinationsController from './Destinations';
import RegionsController from './Regions';

class SearchController extends Controller {
  static async getAll() {
    const records = [];
    let [
      tours,
      destinations,
      regions
    ] = await Promise.all([
      ToursController.getAllLive(),
      DestinationsController.getAll(),
      RegionsController.getAll()
    ]);

    const [
      destinationRegions,
      tourRegions,
      tourDestinations
    ] = await Promise.all([
      this.secondary('destination_regions', 'destination_id', destinations.map(d => d.id), 'region_id', regions.map(d => d.id)),
      this.secondary('tour_regions', 'tour_id', tours.map(d => d.id), 'region_id', regions.map(d => d.id)),
      this.secondary('tour_destinations', 'tour_id', tours.map(d => d.id), 'destination_id', destinations.map(d => d.id)),
    ]);

    // tours = tours.map(this.simplify);
    // regions = regions.map(this.simplify);
    
    this.match(destinations, regions, destinationRegions, 'destination_id', 'region_id');
    this.match(tours, destinations, tourDestinations, 'tour_id', 'destination_id');
    this.match(tours, regions, tourRegions, 'tour_id', 'region_id');

    tours.forEach(x => {
      records.push(this.simplify(x, 'tour'));
    });

    destinations.forEach(x => {
      records.push(this.simplify(x, 'destination'));
    });

    regions.forEach(x => {
      records.push(this.simplify(x, 'region'));
    });

    return records;
  }

  static match(primary, secondary, glue, k1, k2) {
    primary.forEach(x => {
      x.secondary = (x.secondary || []);
      glue
        .filter(y => y[k1] === x.id)
        .forEach(y => {
          x.secondary.push(secondary.find(z => z.id === y[k2]).name.toLowerCase());
        });
    });
  }

  static secondary(table, k1, v1, k2, v2) {
    return db(table)
      .whereIn(k1, v1)
      .orWhereIn(k2, v2);
  }

  static simplify({ name, slug, secondary = [] }, type) {
    return {
      name,
      slug,
      type,
      primary: name.toLowerCase(),
      secondary
    };
  }
}

export default SearchController;
