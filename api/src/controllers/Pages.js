import db from '../utils/db';
import Controller from './Controller';
import content from '../schema/content';
import int from '../schema/int';
import str from '../schema/string';
import array_of_int from '../schema/array_of_int';
import ToursController from './Tours';
import MediaController from './Media';
import DestinationsController from './Destinations';
import RegionsController from './Regions';
import ContentBlocksController from './ContentBlocks';
import PageMeta from './PageMeta';

class PagesController extends Controller {
  static schema() {
    return {
      title: str('Suply a page title'),
      subtitle: str('Supply a page subtitle', false),
      content: content(),
      slug: str('Supply a slug'),
      section: str('Supply a section', false),
      media_id: int('Supply a featured image', false),
      seo_title: str('Supply an SEO title', false),
      seo_description: str('Supply an SEO description', false),
      banner_id: int('Supply a banner', false),
      overview: content('Supply some overview content'),
      overview_image_id: int('Supply an overview image', false),
      destination_id: int('Supply a destination', false),
      region_id: int('Supply a region', false),
      related_tours: array_of_int('Supply a list of related tours'),
      ksp_content: content('Supply KSP content', false),
      ksp_button_title: str('Supply KSP button title', false),
      ksp_button_url: str('Supply KSP button url', false),
      ksp_bg_hex: str('Supply KSP background colour', false),
    };
  }

  static async get_by_slug(slug) {
    const page = await super.get_by_slug(slug);
    if (!page) return null;

    const image_ids = [
      page.media_id,
      page.overview_image_id,
      page.banner_id
    ].filter(a => a);

    const [
      related_tours,
      images,
      blocks,
      meta
    ] = await Promise.all([
      ToursController.get_tours_by_ids(page.related_tours || []),
      MediaController.get_media_by_ids(image_ids),
      ContentBlocksController.get_blocks(page.id),
      PageMeta.get(page.id)
    ]);

    page.blocks = blocks;
    page.meta = meta;

    if (related_tours.length) await ToursController.resolve_destinations(related_tours);
    page.related = await MediaController.resolve_media(related_tours);

    page.image = images.find(i => i.id === page.media_id);
    page.overview_image = images.find(i => i.id === page.overview_image_id);
    page.banner = images.find(i => i.id === page.banner_id);

    if (page.destination_id) {
      page.destination = await DestinationsController.get_simple(page.destination_id);
      if (page.destination && page.destination.media_id) page.destination.image = await MediaController.get(page.destination.media_id);
    }

    if (page.region_id) {
      page.region = await RegionsController.get_simple(page.region_id);
      if (page.region && page.region.media_id) page.region.image = await MediaController.get(page.region.media_id);
    }

    return page;
  }

  static get_marketing_pages(ids, key) {
    return db
      .select('*')
      .from(this.table())
      .whereIn(key, ids);
  }
}

export default PagesController;
