import express from 'express';
import BookingsController from '../controllers/Bookings';
import AuthController from '../controllers/Auth';
import BaseRoutes from './base';
import BookingSnapshotController from '../controllers/BookingSnapshots';
const router = express.Router();
const base = new BaseRoutes(BookingsController);

router.get(
  '/',
  AuthController.is_logged_in(),
  base.getAll()
);

router.get(
  '/:id/documentation',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      const documentation = await BookingsController.get_booking(parseInt(req.params.id));
      if (!documentation) return res.status(404).json({ error: 'Booking documentation not found' });
      res.json(documentation);
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

router.get(
  '/reference/:uuid',
  async (req, res) => {
    try {
      const uuid = String(req.params.uuid).substr(0, 36);
      if (!uuid) return base.notFound(res);
      const instance = await base.controller.get_by_uuid(uuid);
      if (!instance) return base.notFound(res);
      res.json(instance);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.get(
  '/:id',
  AuthController.is_logged_in(),
  base.get()
);

router.get(
  '/:id/snapshot',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return base.notFound(res);
      const instance = await base.controller.get(id);
      if (!instance) return base.notFound(res);

      instance.snapshots = await BookingSnapshotController.get_snapshots_for_booking(id);

      res.json(instance);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.post(
  '/check',
  base.check(),
  BookingsController.validate_data(),
  BookingsController.validate_booking(),
  (req, res) => {
    return res.json(req.body.totals);
  }
);

router.post(
  '/',
  base.check(),
  BookingsController.validate_data(),
  BookingsController.validate_booking(),
  BookingsController.create_route()
);

router.put(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  BookingsController.validate_data(),
  BookingsController.validate_booking(),
  BookingsController.update_route()
);

export default router;
