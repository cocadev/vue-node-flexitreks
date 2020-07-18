import db from '../utils/db';
import Controller from './Controller';
import str from '../schema/string';

class MediaController extends Controller {
  static schema () {
    return {
      alt: str('Supply alt text', false),
      caption: str('Supply a caption', false),
      title: str('Supply a title', false),
      credit: str('Supply a credit', false),
      // orders: int('Supply a room size', false),
      url: {
        errorMessage: 'Supply an image URL',
        trim: true
      }
    };
  }

  static getSearchQuery(query, search) {
    if (search && Object.keys(search).length) {
      let key = Object.keys(search)[0];
      let string = '%' + search[key] + '%';
      if (key === 'all') {
        Object.keys(this.schema()).map(column => {
          query = query.orWhere(column, 'ilike', string);
        })
      } else {
        query = query.where(key, 'ilike', string);
      }
    }
    return query
  }

  static async count(search) {
    let query = db(this.table());
    query = this.getSearchQuery(query, search).count('id');
    return await query
  }

  static async getPage(page = 1, perPage = 15, search) {
    let query = db
      .select('*')
      .orderBy('id', 'DESC')
      .limit(perPage)
      .offset((page - 1) * perPage)
      .from(this.table());

    const images = await this.getSearchQuery(query, search);

    images.forEach(i => i.url = 'https://flexitreks-new.imgix.net/' + i.url);
    return images;
  }

  static async get(id) {
    return await this.get_media_by_id(id);
  }

  static async get_media_by_id(id) {
    if (!id) return null;
    const image = await db
      .from('media')
      .where({ id })
      .select('id', 'url', 'alt', 'caption', 'credit', 'title', 'orders')
      .first();

    image.url = 'https://flexitreks-new.imgix.net/' + image.url;
    return image;
  }

  static async get_media_by_ids(ids) {
    const images = await db
      .from('media')
      .whereIn('id', ids)
      .select('id', 'url', 'alt', 'caption', 'credit', 'title', 'orders')
      .orderBy('orders', 'ASC');


    images.forEach(i => i.url = 'https://flexitreks-new.imgix.net/' + i.url);
    // return ids.map(id => images.find(i => i.id === id)).filter(Boolean);
    return images;
  }

  static async update_media_order( media ){
    const medias = await db('media').whereIn( 'id', media );

    await db.transaction(async (trx) => {
      const updating = medias.map(instance => {
        const index = media.indexOf( instance.id )
        instance.orders = index

        const query = { id: instance.id };
        return db.update(instance)
          .where(query)
          .transacting(trx)
          .into('media');
      });

      try {
        return Promise.all(updating);
      } catch (e) {
        trx.rollback();
      }
    });
  }

  static async resolve_media(instances) {
    const ids = instances.filter(x => x.media_id).map(x => x.media_id);
    if (ids.length) {
      const images = await this.get_media_by_ids(ids);
      instances.forEach(instance => {
        if (instance.media_id) instance.image = images.find(i => i.id === instance.media_id);
      });
    }
    return instances;
  }
}

export default MediaController;
