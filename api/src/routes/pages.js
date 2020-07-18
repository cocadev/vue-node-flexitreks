import express from 'express';
import PagesController from '../controllers/Pages';
import AuthController from '../controllers/Auth';
import BaseRoutes from './base';
import ContentBlocksController from '../controllers/ContentBlocks';
import PageMetaController from '../controllers/PageMeta';
import { validationResult } from 'express-validator/check';
const router = express.Router();
const base = new BaseRoutes(PagesController);
const blockBase = new BaseRoutes(ContentBlocksController);

router.get(
  '/',
  base.getAll()
);

router.post(
  '/',
  AuthController.is_logged_in(),
  base.check(),
  base.create()
);


router.get(
  '/:section/:slug',
  async (req, res) => {
    try {
      const instance = await base.controller.get_by_slug(String(req.params.slug));
      if (!instance) return base.notFound(res);
      if (instance.section !== String(req.params.section)) return base.notFound(res);
      res.json(instance);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.get(
  '/:slug',
  async (req, res) => {
    try {
      const instance = await base.controller.get_by_slug(String(req.params.slug));
      if (!instance) return base.notFound(res);
      if (instance.section) return base.notFound(res);
      res.json(instance);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.put(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  base.update(async (req, res, response) => {
    await PageMetaController.update(response.id, req.body.meta);
    res.json(response);
  })
);

/**
 * Update blocks for the tour
 * Ensure you send ALL blocks or they will be deleted
 * 
 * @param   array   blocks
 *    @param  number  id
 *    @param  string  content
 *    @param  number  order
 *    @param  number  media_id
 * @returns object
 */
router.put(
  '/:id/blocks',
  AuthController.is_logged_in(),
  blockBase.check(),
  async (req, res) => {
    try {
      const page_id = parseInt(req.params.id);

      if (Array.isArray(req.body) && req.body.length === 0) {
        return res.json(await ContentBlocksController.update(page_id, []));
      }

      validationResult(req).throw();
      req.body.forEach(i => i.page_id = page_id);
      req.body.forEach(r => delete r.media);
      res.json(await ContentBlocksController.update(page_id, req.body));
    } catch (e) {
      return blockBase.error(e, res);
    }
  }
);

export default router;
