import express from 'express';
import TourExtrasController from '../controllers/TourExtras';
import { checkSchema, validationResult } from 'express-validator/check';
import h from '../utils/helpers';
const router = express.Router();

/**
 * Prepare the extra request against the schema, adding required fields from the URL
 *
 * @param {object} req
 * @param {object} schema
 */
const prepare_extra = function(req, schema) {
  const extra = h.request(req.body, req.params.id ? parseInt(req.params.id) : null, schema);
  extra.tour_id = parseInt(req.params.tour_id);
  if (req.body.order) extra.order = parseInt(req.body.order);
  extra.tour_season_id = parseInt(req.params.tour_season_id);
  if (req.body.guidance) extra.guidance = parseInt(req.body.guidance);
  if (req.body.boat_id) extra.boat_id = parseInt(req.body.boat_id);
  if (req.body.nights) extra.nights = parseInt(req.body.nights);
  extra.variations = extra.variations || [];
  const variations = extra.variations;
  delete extra.variations;
  return {
    extra,
    variations
  };
};

/**
 * Generic GET all method for party/room extras
 * 
 * @param {string} method 
 */
const get_extras = function (method) {
  return async (req, res) => {
    try {
      res.json(await TourExtrasController[method](parseInt(req.params.tour_id), parseInt(req.params.tour_season_id)));
    } catch (e) {
      return h.error(e, res);
    }
  };
};

/**
 * Create the extra, then create any variations
 * 
 * @param {object} schema 
 * @param {string} extras_table 
 * @param {string} variations_table 
 * @param {string} key 
 */
const create_extra = function (schema, extras_table, variations_table, key) {
  return async (req, res) => {
    try {
      validationResult(req).throw();
      const {extra, variations} = prepare_extra(req, schema);
      const created_extra = await TourExtrasController.create(extra, extras_table);
      if (created_extra && req.body.variations) {
        await TourExtrasController.update_variations(
          variations,
          parseInt(req.params.tour_season_id),
          parseInt(created_extra.id),
          variations_table,
          key
        );
      }

      res.status(201).json(created_extra);
    } catch (e) {
      return h.error(e, res);
    }
  };
};

/**
 * Generic GET for single party/room extras
 * @param {string} method 
 */
const get_extra = function (method) {
  return async (req, res) => {
    try {
      const extras = await TourExtrasController[method](parseInt(req.params.tour_id), parseInt(req.params.tour_season_id));
      if (!extras.length) return h.notFound(res);
      const extra = extras.find(extra => extra.id === parseInt(req.params.id));
      if (!extra) return h.notFound(res);

      res.json(extra);
    } catch (e) {
      return h.error(e, res);
    }
  };
};

/**
 * Update the extra, then create any variations
 * 
 * @param {object} schema 
 * @param {string} extras_table 
 * @param {string} variations_table 
 * @param {string} key 
 */
const update_extra = function (schema, extras_table, variations_table, key) {
  return async (req, res) => {
    try {
      validationResult(req).throw();
      const {extra, variations} = prepare_extra(req, schema);
      const updated_extra = await TourExtrasController.update(extra, extras_table);

      if (updated_extra && req.body.variations) {
        await TourExtrasController.update_variations(
          variations,
          parseInt(req.params.tour_season_id),
          parseInt(updated_extra.id),
          variations_table,
          key
        );
      }

      return res.status(201).json(updated_extra);
    } catch (e) {
      return h.error(e, res);
    }
  };
};


/**
 * Create a variation
 * 
 * @param {object} schema 
 * @param {string} extras_table 
 * @param {string} variations_table 
 * @param {string} key 
 */
const create_variation = function (schema, extras_table, variations_table, key, get_method) {
  return async (req, res) => {
    try {
      validationResult(req).throw();
      const {extra, variations} = prepare_extra(req, schema);

      if (extra && req.body.variations) {
        await TourExtrasController.create_variations(
          variations,
          parseInt(req.params.tour_season_id),
          parseInt(extra.id),
          variations_table,
          key
        );
      }

      const extras = await TourExtrasController[get_method](parseInt(req.params.tour_id), parseInt(req.params.tour_season_id));
      if (!extras.length) return h.notFound(res);
      const new_extra = extras.find(extra => extra.id === parseInt(req.params.id));
      if (!new_extra) return h.notFound(res);

      return res.status(201).json(new_extra);
    } catch (e) {
      return h.error(e, res);
    }
  };
};

/**
 * Generic DELETE for single party/room extras
 * @param {string} method 
 */
const delete_extra = function (get_method, delete_method) {
  return async (req, res) => {
    try {
      const extras = await TourExtrasController[get_method](parseInt(req.params.tour_id), parseInt(req.params.tour_season_id));
      if (!extras.length) return h.notFound(res);
      const extra = extras.find(extra => extra.id === parseInt(req.params.id));
      if (!extra) return h.notFound(res);

      await TourExtrasController[delete_method](parseInt(req.params.id));
      res.json({ success: true });
    } catch (e) {
      return h.error(e, res);
    }
  };
};



router.get(
  '/:tour_id/:tour_season_id/party',
  get_extras('get_party_extras')
);

router.post(
  '/:tour_id/:tour_season_id/party',
  checkSchema(TourExtrasController.party_schema()),
  create_extra(TourExtrasController.party_schema(), 'tour_party_extras', 'tour_party_extra_variations', 'tour_party_extra_id')
);

router.get(
  '/:tour_id/:tour_season_id/party/:id',
  get_extra('get_party_extras')
);

router.post(
  '/:tour_id/:tour_season_id/party/:id',
  checkSchema(TourExtrasController.party_schema()),
  create_variation(TourExtrasController.party_schema(), 'tour_party_extras', 'tour_party_extra_variations', 'tour_party_extra_id', 'get_party_extras')
);

router.put(
  '/:tour_id/:tour_season_id/party/:id',
  checkSchema(TourExtrasController.party_schema()),
  update_extra(TourExtrasController.party_schema(), 'tour_party_extras', 'tour_party_extra_variations', 'tour_party_extra_id')
);

router.delete(
  '/:tour_id/:tour_season_id/party/:id',
  delete_extra('get_party_extras', 'delete_party_extra')
);



router.get(
  '/:tour_id/:tour_season_id/room',
  get_extras('get_room_extras')
);

router.post(
  '/:tour_id/:tour_season_id/room',
  checkSchema(TourExtrasController.room_schema()),
  create_extra(TourExtrasController.room_schema(), 'tour_room_extras', 'tour_room_extra_variations', 'tour_room_extra_id')
);

router.get(
  '/:tour_id/:tour_season_id/room/:id',
  get_extra('get_room_extras')
);

router.post(
  '/:tour_id/:tour_season_id/room/:id',
  checkSchema(TourExtrasController.room_schema()),
  create_variation(TourExtrasController.room_schema(), 'tour_room_extras', 'tour_room_extra_variations', 'tour_room_extra_id', 'get_room_extras')
);

router.put(
  '/:tour_id/:tour_season_id/room/:id',
  checkSchema(TourExtrasController.room_schema()),
  update_extra(TourExtrasController.room_schema(), 'tour_room_extras', 'tour_room_extra_variations', 'tour_room_extra_id')
);

router.delete(
  '/:tour_id/:tour_season_id/room/:id',
  delete_extra('get_room_extras', 'delete_room_extra')
);


export default router;
