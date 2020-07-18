import Controller from './Controller';
import content from '../schema/content';
import str from '../schema/string';
import int from '../schema/int';
import db from '../utils/db';
import GalleriesController from './Galleries';
import MediaController from './Media';

class CategoriesController extends Controller {
    static schema() {
        return {
            name: str('Supply a name'),
            slug: str('Supply a slug'),
            description: content('Supply a description', false),
            filter_id: str('Supply a filter id', false),
            media_id: int('Supply a media id', false),
            gallery_id: int('Supply a gallery id', false)
        };
    }

    static async getAll() {
        const boats = await db
            .select('*')
            .from(this.table())
            .orderBy('name', 'ASC')

        await Promise.all(boats.map(async boat => {
            boat.image = await MediaController.get_media_by_id(boat.media_id)
        }));

        return boats
    }
    
    static async get_by_slug(slug) {
        const category = await db
            .select('*')
            .from(this.table())
            .orderBy('name', 'ASC')
            .where({ slug })
            .first()

        if(category && category.gallery_id){
            let galleries = await GalleriesController.get(category.gallery_id)
            category.gallery_details = galleries
            category.gallery = galleries ? galleries.map(data => data.id) : [];
        }

        return category
    }
}

export default CategoriesController;
