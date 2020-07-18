import Controller from './Controller';
import content from '../schema/content';
import str from '../schema/string';
import int from '../schema/int';
import db from '../utils/db';
import GalleriesController from './Galleries';

class BoatsController extends Controller {
    static schema() {
        return {
            name: str('Supply a name'),
            description: content('Supply a description'),
            gallery_id: int('Supply a gallery_id')
        };
    }
    static async getAll() {
        const boats = await db
            .select('*')
            .from(this.table())
            .orderBy('name', 'ASC')

        await Promise.all(boats.map(async boat => {
            let galleries = await GalleriesController.get(boat.gallery_id)
            boat.gallery_details = galleries
            boat.gallery = galleries ? galleries.map(data => data.id) : [];
        }));

        return boats
    }
}

export default BoatsController;
