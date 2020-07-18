import db from '../utils/db';
import Controller from './Controller';
import ToursController from './Tours';
import DestinationsController from './Destinations';
import email from '../schema/email';
import tel from '../schema/tel';
import str from '../schema/string';
import array_of_object from '../schema/array_of_object';

class EnquiriesController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.name = str('Please supply your name');
    schema.email = email('Please supply your email');
    schema.telephone = tel('Please supply your telephone number');
    schema.tours = array_of_object('Please supply a list of tours', {
      destination: {
        type: String,
        required: false
      },
      tour: {
        type: String,
        required: false
      }
    });
    schema.message = {
      errorMessage: 'Please supply an enquiry',
      trim: true,
      escape: true,
      isLength: {
        options: { max: 5000 }
      }
    };
    return schema;
  }

  static async getAll() {
    return await db
      .select('*')
      .from(this.table())
      .orderBy('createdAt', 'DESC');
  }

  static async get(id) {
    const enquiry = await super.get(id);
    if (!enquiry) return null;
    enquiry.tours = await ToursController.get_by_ids((enquiry.tour_ids || []).map(Number));
    enquiry.destinations = await DestinationsController.get_by_ids((enquiry.destination_ids || []).map(Number));
    return enquiry;
  }

  static async create (instance) {
    const groups = instance.tours;
    const tourIds = groups.map(g => g.tour).filter(x => x).map(Number);
    const destinationSlugs = groups.map(g => g.destination).filter(x => x).map(this.trim);

    if (tourIds.length) {
      const tours = await db('tours').whereIn('id', tourIds);
      instance.tour_ids = tours.map(x => x.id);
    } else {
      instance.tour_ids = [];
    }

    if (destinationSlugs.length) {
      const destinations = await db('destinations').whereIn('slug', destinationSlugs);
      instance.destination_ids = destinations.map(x => x.id);
    } else {
      instance.destination_ids = [];
    }

    delete instance.tours;

    return super.create(instance);
  }

  static trim (slug) {
    return String(slug).substring(0, 80);
  }
}

export default EnquiriesController;
