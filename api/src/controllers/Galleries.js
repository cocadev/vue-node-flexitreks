import Controller from './Controller';
import array_of_int from '../schema/array_of_int';
import MediaController from './Media';

class GalleriesController extends Controller {
  static table() { return 'galleries'; }

  static schema() {
    return {
      media: array_of_int('Supply media ids')
    };
  }

  static async get(id) {
    if (!id) return null;
    const gallery = await super.get(id);
    if (!gallery) return null;

    return await MediaController.get_media_by_ids(gallery.media);
  }
}

export default GalleriesController;
