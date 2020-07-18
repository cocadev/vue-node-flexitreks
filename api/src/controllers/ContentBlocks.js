import db from '../utils/db';
import MediaController from './Media';
import content from '../schema/content';
import int from '../schema/int';
import LinkController from './LinkController';
import PagesController from './Pages';

class ContentBlocksController extends LinkController {
  static schema() {
    return {
      '*.content': content('Supply content for block'),
      '*.order': int('Supply order for block', false),
      '*.media_id': int('Supply image for block', false)
    };
  }

  /**
   * List the content blocks for a page
   * 
   * @param   {int}     page_id 
   * @param   {string}  type 
   * @param   {bool}    retreive_media 
   * @return  {array}
   */
  static async get_blocks(page_id) {
    const blocks = await db
      .from('content_blocks')
      .select('id', 'content', 'order', 'media_id')
      .where({ page_id })
      .orderBy('order', 'asc');

    const media = blocks.map(i => i.media_id);
    if (media.length) {
      const images = await MediaController.get_media_by_ids(media);
      if (images.length) {
        blocks.forEach(i => {
          if (i.media_id) i.media = images.find(image => image.id === i.media_id);
        });
      }
    }

    return blocks;
  }

  /**
   * Prepare block for update
   * 
   * Check for the page, then get the current block
   * Pass the blocks to the LinkController updater
   * 
   * @param   {int}   page_id 
   * @param   {array} blocks 
   * @return  {array}
   */
  static async update(page_id, blocks) {
    const page = await PagesController.get(page_id);
    if (!page) throw new Error('This page does not exist');
    const current = await this.get_blocks(page_id);

    await this.handle_tour_link_tables(page_id, blocks, current, 'id', 'content_blocks', 'page_id');

    return this.get_blocks(page_id);
  }
}

export default ContentBlocksController;
