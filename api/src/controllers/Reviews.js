import fetch from 'node-fetch';
import db from '../utils/db';
import Controller from './Controller';
import content from '../schema/content';
import str from '../schema/string';
import int from '../schema/int';
import ToursController from './Tours';
import GlobalOptions from './GlobalOptions';

class ReviewsController extends Controller {
  static schema() {
    const schema = {};
    schema.tour_id = int('Supply a tour id', false);
    schema.feefo_id = str('Supply a feefo id');
    schema.feefo_url = str('Supply a feefo review URL');
    schema.author = str('Supply an author');
    schema.service_comment = content('Supply a service comment');
    schema.product_comment = content('Supply a product comment');
    schema.response = content('Supply a response');
    schema.service_rating = int('Supply a service rating');
    schema.product_rating = int('Supply a product rating');
    return schema;
  }

  static get_reviews_for_tour(tour_id, limit = null) {
    return db
      .from('reviews')
      .where({ 'tour_id': tour_id })
      .orderBy('rating', 'desc')
      .limit(limit || 0)
      .select('*');
  }

  static async create(instance) {
    const current = await db(this.table()).where({ feefo_id: instance.feefo_id }).first();
    if (current) return null;

    instance.rating = Number((instance.service_rating + instance.product_rating) / 2);
    const response = await super.create(instance);
    await ToursController.recalculate_rating(instance.tour_id);
    await this.recalculate_average();
    return response;
  }

  static async update(instance, key = 'id') {
    instance.rating = Number((instance.service_rating + instance.product_rating) / 2);
    const response = await super.update(instance, key);
    await ToursController.recalculate_rating(instance.tour_id);
    await this.recalculate_average();
    return response;
  }

  static async recalculate_average() {
    const ratings = await db('tours').whereNotNull('rating').select('rating');
    const average = ratings.reduce((current, r) => current + Number(r.rating), 0) / ratings.length;
    if (average && !isNaN(average)) await GlobalOptions.set_option('feefo_average', average);
  }

  static feefo(endpoint, query = {}) {
    const params = Object.keys(query);

    let url = `https://api.feefo.com/api/10/reviews/${endpoint}?merchant_identifier=flexitreks`;

    if (params.length) {
      url += '&' + params.map(param => `${param}=${encodeURIComponent(query[param])}`).join('&');
    }

    return fetch(url).then(r => r.json());
  }

  static async save_reviews() {
    const latest = await db(this.table()).orderBy('date', 'DESC').limit(1).first();

    const query = { full_thread: 'include' };
    if (latest && latest.feefo_id) query['id>'] = latest.feefo_id;
    else if (latest && latest.date) query['date_time>'] = latest.date;
    query.sort = '+created_date';

    try {
      const response = await this.feefo('all', query);
      if (!response || !response.reviews.length) return 0;

      const reviews = response.reviews.map(this.prepare_review).filter(x => x);
      const tours = await ToursController.get_tours_by_codes(reviews.map(x => x.tour_code));

      const to_create = reviews.map(review => {
        const tour = tours.find(x => x.tour_code === review.tour_code);
        review.tour_id = tour ? tour.id : null;
        delete review.tour_code;
        return review;
      });

      await Promise.all(to_create.map(r => this.create(r)));

      const summary = await this.feefo('summary/all');
      await GlobalOptions.set_option('feefo_average', summary.rating.rating);

      return to_create.length;
    } catch(e) {
      return 0;
    }
  }

  static prepare_review(review) {
    const service = review.service;
    const product = review.products && review.products[0] || false;
    if (!product) return null;

    const response = [
      product.thread && product.thread[0].comment,
      service.thread && service.thread[0].comment
    ]
    .filter(n => n)
    .join('<br />');

    const parseContent = (content) => content
      .replace(/\s*\n+\s*/g, '<br /><br />')
      .replace(/<br ?\/?>+\s*$/, '');

    return {
      date: service.created_at,
      feefo_id: service.id,
      feefo_url: review.url,
      tour_code: product.product && product.product.sku || '',
      author: review.customer && review.customer.display_name || '',
      service_comment: parseContent(service.review),
      product_comment: parseContent(product.review),
      response: parseContent(response),
      service_rating: service.rating.rating,
      product_rating: product.rating.rating
    };
  }
}

export default ReviewsController;
