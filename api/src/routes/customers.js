import express from 'express';
import CustomersController from '../controllers/Customers';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(CustomersController);

/**
 * Read
 * 
 * @param   number  id
 * @returns object
 */
router.get(
  '/:id',
  base.get()
);

/**
 * Update
 * 
 * @param  string  title
 * @param  string  first_name
 * @param  string  last_name
 * @param  string  email_address
 * @param  string  telephone_number
 * @param  string  alternative_telephone_number
 * @param  string  country
 * @param  string  address_line_1
 * @param  string  address_line_2
 * @param  string  town
 * @param  string  county
 * @param  string  postcode
 * @returns object
 */
router.put(
  '/:id',
  base.check(),
  base.update()
);

export default router;













