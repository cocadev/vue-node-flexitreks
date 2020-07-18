import dotenv from 'dotenv';
dotenv.config();
process.env.TZ = 'UTC';
import express from 'express';
import expressValidator from 'express-validator';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import routes from './routes/';
import AuthController from './controllers/Auth';

const PORT = process.env.PORT || 8080;
const app = express();
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: process.env.JWT_SIG,
};

const authStrategy = new JwtStrategy(jwtOptions, async (jwt, next) => {
  try {
    const success = await AuthController.validateToken(jwt);
    if (!success) throw new Error('Unauthorized user.');
    next(null, success);
  } catch (e) {
    next(null, false);
  }
});

app.use(passport.initialize());
passport.use(authStrategy);
app.use(bodyParser.json());
app.use(expressValidator());
const corsOptions = app.get('env') === 'live' ? {
  origin: [
    'https://flexitreks.com',
    /^https:\/\/([a-z0-9\-]+--)?flexitreks(-admin)?\.netlify\.com$/,
    /^https:\/\/([a-z0-9\-]+--)?flexitreks(-admin)?\.netlify\.app$/,
    /^https?:\/\/localhost(:[0-9]+)?$/
  ],
  optionsSuccessStatus: 200
} : {};
app.use(cors(corsOptions));

if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

app.use('/api/v1', routes);

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: 'There was an issue processing your request',
    error: {}
  });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));

module.exports = app;
