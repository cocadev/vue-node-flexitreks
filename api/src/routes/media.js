import express from 'express';
import MediaController from '../controllers/Media';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from '../controllers/Aws';
import BaseRoutes from './base';
import { validationResult } from 'express-validator/check';
import AuthController from '../controllers/Auth';
const router = express.Router();
const base = new BaseRoutes(MediaController);

router.get(
  '/page/:page',
  base.getPage()
);


router.get(
  '/page/:page/:search_field/:search_value',
  base.getPage()
);


router.get(
  '/:id',
  async (req, res) => {
    try {
      const operator = await MediaController.get(parseInt(req.params.id));
      if (!operator) return res.status(404).json({ error: 'Media item not found' });
      res.json(operator);
    } catch (e) {
      base.error(e, res);
    }
  }
);


router.put('/:id',
  AuthController.is_logged_in(),
  base.check(),
  base.update()
);


router.delete(
  '/:id',
  base.check(),
  base.delete()
);


if (process.env.S3_ACCESS) {
  const s3 = new aws.S3();

  const upload = multer({
    storage: multerS3({
      s3,
      acl: 'public-read',
      bucket: process.env.S3_Bucket,
      key: function (req, file, cb) {
        console.log('Media 3');
        const d = new Date();
        const image = `images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${file.originalname.replace(/\s/g, '_')}`;
        req._flexitreks_image = image;
        cb(null, image);
      }
    })
  });

  router.post('/',
    AuthController.is_logged_in(),
    base.check(),
    async (req, res) => {
      try {
        validationResult(req).throw();
        const request = base.request(req.body);
        const response = await MediaController.create(request);
        if (response) response.url = 'https://flexitreks-new.imgix.net/' + response.url;
        res.status(201).json(response);
      } catch (e) {
        base.error(e, res);
      }
    }
  );

  router.put('/',
    AuthController.is_logged_in(),
    base.check(),
    (req, res, next) => {
      console.log('Media 1');
      aws.config.update({ region: process.env.S3_Region });
      console.log('Media 2');
      next();
    },
    upload.array('upload'),
    async (req, res) => {
      try {
        console.log('Media 4');
        validationResult(req).throw();
        req.body.alt = req.body.upload_alt;
        req.body.caption = req.body.upload_caption;
        req.body.credit = req.body.upload_credit;
        req.body.title = req.body.upload_title;

        const request = base.request(req.body);
        request.url = req._flexitreks_image;

        const response = await MediaController.create(request);
        if (response) response.url = 'https://flexitreks-new.imgix.net/' + response.url;
        res.status(201).json(response);
      } catch (e) {
        base.error(e, res);
      }
    }
  );

}

export default router;
