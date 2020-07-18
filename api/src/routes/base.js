import { checkSchema, validationResult } from 'express-validator/check';
import h from '../utils/helpers';

class BaseRoutes {
  constructor (controller) {
    this.controller = controller;
  }

  notFound(res) {
    return h.notFound(res);
  }

  error(e, res) {
    return h.error(e, res);
  }

  /**
   * Run the schema validator, but refrain from throwing errors
   */
  check()  {
    return checkSchema(this.controller.schema());
  }

  request(body, id) {
    return h.request(body, id, this.controller.schema());
  }

  request_with_slug(body, data) {
    return h.request(body, data, this.controller.schema(), 'slug');
  }

  /**
   * Generic 'List' route
   */
  getAll(settings) {
    return async (req, res) => {
      try {
        res.json(await this.controller.getAll(settings));
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  getAllLive() {
    return async (req, res) => {
      try {
        res.json(await this.controller.getAllLive());
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  getPage(perPage = 15) {
    return async (req, res) => {
      try {
        const page = parseInt(req.params.page);
        if (!page || isNaN(page)) return this.notFound(res);
        let search = {};
        if (req.params.search_field) search[req.params.search_field] = req.params.search_value
        const results = await this.controller.getPage(page, perPage, search);
        const total = await this.controller.count(search);
        const remaining = total[0].count - results.length - (page === 1 ? 0 : (page - 1) * perPage) > 0;
        res.json({
          page,
          perPage,
          nextPage: remaining ? page + 1 : false,
          results
        });
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'Read' route
   */
  get() {
    return async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) return this.notFound(res);
        const instance = await this.controller.get(id);
        if (!instance) return this.notFound(res);
        res.json(instance);
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'Read' route
   */
  get_by_slug(goToNext) {
    return async (req, res, next) => {
      try {
        const instance = await this.controller.get_by_slug(String(req.params.slug));
        if (!instance) return goToNext ? next() : this.notFound(res);
        res.json(instance);
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'IDs' route
   */
  get_by_ids(limit = 10) {
    return async (req, res) => {
      try {
        const ids = req.params.ids.split(',').filter(n => !isNaN(n)).map(Number).slice(0, limit);
        const instance = await this.controller.get_by_ids(ids);
        if (!instance) return this.notFound(res);
        res.json(instance);
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'Create' route
   */
  create (cb = null) {
    return async (req, res) => {
      try {
        validationResult(req).throw();

        const request = this.request(req.body);
        const response = await this.controller.create(request);
        if (cb) {
          cb(req, res, response);
        } else {
          res.status(201).json(response);
        }
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'Delete' route
   */
  delete (relation) {
    return async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) return this.notFound(res);
        const instance = await this.controller.get(id);
        if (!instance) return this.notFound(res);
        if (relation) {
          const rels = await this.controller.get_rels(id, relation);
          if (rels.length > 0) return this.error("This item is used", res);
        }
        await this.controller.delete(id, 'id', relation);
        res.json({ success: true });
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'Update' route
   */
  update (cb = null) {
    return async (req, res) => {
      try {
        validationResult(req).throw();
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) return this.notFound(res);

        const request = this.request(req.body, id);
        const response = await this.controller.update(request);

        if (!response) return this.notFound(res);
        if (cb) {
          cb(req, res, response);
        } else {
          res.json(response);
        }
      } catch (e) {
        return this.error(e, res);
      }
    };
  }

  /**
   * Generic 'Update' route
   */
  update_by_slug (cb = null) {
    return async (req, res) => {
      try {
        validationResult(req).throw();
        const slug = String(req.params.slug);
        if (!slug) return this.notFound(res);

        const request = this.request_with_slug(req.body, slug);
        const response = await this.controller.update(request, 'slug');

        if (!response) return this.notFound(res);
        if (cb) {
          cb(req, res, response);
        } else {
          res.json(response);
        }
      } catch (e) {
        return this.error(e, res);
      }
    };
  }
}

export default BaseRoutes;
