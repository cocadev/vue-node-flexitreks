import express from 'express';
import NewsletterController from '../controllers/Newsletters';
import BaseRoutes from './base';
import { validationResult } from 'express-validator/check';
const router = express.Router();
const base = new BaseRoutes(NewsletterController);

router.post(
  '/',
  base.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const request = {
        email_address: req.body.email_address,
        status: 'pending',
        merge_fields: {
          FIRST: req.body.first_name,
          LAST: req.body.last_name
        }
      };

      const response = await base.controller.create(request);
      if (response.errors || response.status === 400) {
        return base.error(response.title === 'Member Exists' ? 'It looks like you\'re already a subscriber!' : 'There was a problem signing you up to our newsletter', res);
      } else {
        res.status(201).json({
          success: true
        });
      }
    } catch (e) {
      return base.error('There was a problem signing you up to our newsletter', res);
    }
  }
);

export default router;
