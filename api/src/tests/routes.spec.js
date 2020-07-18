process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
chai.should();
const server = require('../app');
const db = require('../utils/db');

chai.use(chaiHttp);

describe('API Routes', function() {

  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run())
  );

  afterEach(() => db.migrate.rollback());

  describe('GET /destinations', function() {
    it('should return three seeded destinations', (done) => {
      chai.request(server)
        .get('/api/v1/destinations')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.have.property('name');
          res.body[2].name.should.equal('Italy');
          res.body[2].slug.should.equal('italy');
          done();
        });
    });
  });

  describe('GET /destinations/italy', function () {
    it('should have a name, tours array and regions array', (done) => {
      chai.request(server)
        .get('/api/v1/destinations/italy')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('Italy');

          res.body.should.have.property('tipping');
          res.body.should.have.property('currency');
          res.body.currency.should.equal('Euro');

          res.body.should.have.property('tours');
          res.body.tours.should.be.a('array');
          res.body.tours.length.should.equal(1);
          res.body.tours[0].name.should.equal('4 Countries Cycling Holiday');

          res.body.should.have.property('regions');
          res.body.regions.should.be.a('array');
          res.body.regions.length.should.equal(1);
          res.body.regions[0].name.should.equal('The Danube');
          done();
        });
    });
  });

  describe('PUT /destinations/1', function () {
    it('should create a destination and link a region', (done) => {
      chai.request(server)
        .put('/api/v1/destinations/1')
        .type('json')
        .send({
          name: 'Italy',
          slug: 'italy',
          regions: [
            {
              region_id: 1
            },
            {
              region_id: 2
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          chai.request(server)
            .get('/api/v1/destinations/italy')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');

              res.body.should.have.property('name');
              res.body.name.should.equal('Italy');

              res.body.should.have.property('regions');
              res.body.regions.should.be.a('array');
              res.body.regions.length.should.equal(2);
              res.body.regions[1].name.should.equal('Lake Constance');
              done();
            });
        });
    });
  });

  // describe('GET /tours', function() {
  //   it('/tours should not return all tours', (done) => {
  //     chai.request(server)
  //       .get('/api/v1/tours')
  //       .end((err, res) => {
  //         res.should.have.status(404);
  //         res.should.be.json;
  //         done();
  //       });
  //   });
  // });

  describe('GET /tours/4-countries-cycling-holiday', function () {
    it('should return the tour', (done) => {
      chai.request(server)
        .get('/api/v1/tours/4-countries-cycling-holiday')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('name');
          res.body.name.should.equal('4 Countries Cycling Holiday');
          res.body.should.have.property('excerpt');
          res.body.should.have.property('content');
          res.body.should.have.property('tour_code');
          res.body.should.have.property('media_id');
          res.body.should.have.property('image');
          res.body.should.have.property('gallery_id');
          res.body.should.have.property('gallery');
          res.body.should.have.property('status');

          done();
        });
    });

    it('should have exactly two names, falling back to the name', (done) => {
      chai.request(server)
        .get('/api/v1/tours/4-countries-cycling-holiday')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('name');
          res.body.name.should.equal('4 Countries Cycling Holiday');

          res.body.should.have.property('name_short');
          res.body.name_short.should.equal('4 Countries');

          res.body.should.not.have.property('name_operator');

          done();
        });
    });

    it('should have a destinations, regions & extras array', (done) => {
      chai.request(server)
        .get('/api/v1/tours/4-countries-cycling-holiday')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('destinations');
          res.body.destinations.should.be.a('array');
          res.body.destinations.length.should.equal(3);
          res.body.destinations[0].name.should.equal('Italy');

          res.body.should.have.property('regions');
          res.body.regions.should.be.a('array');
          res.body.regions.length.should.equal(1);
          res.body.regions[0].name.should.equal('The Danube');

          res.body.should.have.property('itinerary');
          res.body.itinerary.should.be.a('array');
          res.body.itinerary.length.should.equal(1);
          res.body.itinerary[0].content.should.equal('Test public content');

          res.body.should.have.property('party_extras');
          res.body.party_extras.should.be.a('array');
          res.body.party_extras.length.should.equal(1);
          res.body.party_extras[0].should.have.property('name');
          res.body.party_extras[0].name.should.equal('Helmet hire');
          res.body.party_extras[0].should.have.property('variations');
          res.body.party_extras[0].variations.should.be.a('array');
          res.body.party_extras[0].variations[0].should.have.property('cost');
          res.body.party_extras[0].variations[0].cost.should.equal(12);

          res.body.should.have.property('room_extras');
          res.body.room_extras.should.be.a('array');
          res.body.room_extras.length.should.equal(1);
          res.body.room_extras[0].should.have.property('name');
          res.body.room_extras[0].name.should.equal('Extra night in Constance');
          res.body.room_extras[0].should.have.property('variations');
          res.body.room_extras[0].variations.should.be.a('array');
          res.body.room_extras[0].variations[0].should.have.property('cost');
          res.body.room_extras[0].variations[0].cost.should.equal(180);

          res.body.should.have.property('routes');
          res.body.routes.should.be.a('array');
          res.body.routes.length.should.equal(1);
          res.body.routes[0].should.have.property('name');
          res.body.routes[0].name.should.equal('From Mestre');

          res.body.should.have.property('categories');
          res.body.categories.should.be.a('array');
          res.body.categories.length.should.equal(1);
          res.body.categories[0].should.have.property('start');
          res.body.categories[0].should.have.property('end');
          res.body.categories[0].should.have.property('tour_route_id');

          res.body.should.have.property('prices');
          res.body.prices.should.be.a('array');
          res.body.prices.length.should.equal(1);
          res.body.prices[0].should.have.property('cost');
          res.body.prices[0].should.have.property('category');

          res.body.should.have.property('reductions');
          res.body.reductions.should.be.a('array');
          res.body.reductions.length.should.equal(1);
          res.body.reductions[0].should.have.property('cost');
          res.body.reductions[0].should.have.property('percent');
          res.body.reductions[0].should.have.property('input_min');
          res.body.reductions[0].should.have.property('input_max');
          res.body.reductions[0].should.have.property('output_min');
          res.body.reductions[0].should.have.property('output_max');

          done();
        });
    });

  });

  describe('GET /tours/2', function () {
    it('should 404', (done) => {
      chai.request(server)
        .get('/api/v1/tours/2')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          done();
        });
    });
  });

  describe('POST /tours', function () {
    it('should 400 with missing details', (done) => {
      chai.request(server)
        .post('/api/v1/tours')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          done();
        });
    });

    it('should create and return a tour', (done) => {
      chai.request(server)
        .post('/api/v1/tours')
        .type('json')
        .send({
          name: 'Tour name',
          tour_code: '12345',
          name_short: 'A tour',
          name_operator: 'Operator tour name',
          excerpt: '<h3>Excerpt</h3>',
          content: '<h2>Content</h2>',
          operator_id: 1,
          slug: 'tour-name',
          guidance: 2,
          length: 280,
          bike_and_boat: false,
          months: 'April - October',
          nights: [3]
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;

          res.body.should.have.property('name');
          res.body.name.should.equal('Tour name');

          res.body.should.have.property('name_short');
          res.body.name_short.should.equal('A tour');

          done();
        });
    });

    it('should add a tour hotel, create and return a tour', (done) => {
      chai.request(server)
        .post('/api/v1/tours')
        .type('json')
        .send({
          name: 'Tour name',
          tour_code: '12345',
          name_short: 'A tour',
          name_operator: 'Operator tour name',
          excerpt: '<h3>Excerpt</h3>',
          content: '<h2>Content</h2>',
          operator_id: 1,
          slug: 'tour-name',
          guidance: 2,
          length: 280,
          bike_and_boat: false,
          months: 'April - October',
          nights: [3],
          hotels: [
            {
              hotel_id: 1
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;

          res.body.should.have.property('name');
          res.body.name.should.equal('Tour name');

          res.body.should.have.property('name_short');
          res.body.name_short.should.equal('A tour');

          done();
        });
    });

  });

  describe('PUT /tours/1', function () {

    it('should create tour hotel, update and return a tour', (done) => {
      chai.request(server)
        .put('/api/v1/tours/1')
        .type('json')
        .send({
          name: 'Tour name update',
          tour_code: '12345',
          name_short: 'A tour',
          name_operator: 'Operator tour name',
          excerpt: '<h3>Excerpt</h3>',
          content: '<h2>Content</h2>',
          operator_id: 1,
          slug: 'a-tour',
          guidance: 2,
          length: 280,
          bike_and_boat: false,
          months: 'April - October',
          nights: [3],
          hotels: [
            {
              hotel_id: 1
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.have.property('name');
          res.body.name.should.equal('Tour name update');

          res.body.should.have.property('name_short');
          res.body.name_short.should.equal('A tour');

          chai.request(server)
            .get('/api/v1/tours/1/hotels')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(1);
              res.body[0].should.have.property('name');
              res.body[0].name.should.equal('Villa Lola & Juan. Calle Farjarado');
              res.body[0].should.have.property('content');
              done();
            });

        });
    });
  });

  describe('GET /regions', function () {
    it('should return a list of regions', (done) => {
      chai.request(server)
        .get('/api/v1/regions')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('The Danube');
          done();
        });
    });
  });

  describe('GET /regions/the-danube', function () {
    it('should return a region and all tours in it', (done) => {
      chai.request(server)
        .get('/api/v1/regions/the-danube')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('The Danube');

          res.body.should.have.property('tours');
          res.body.tours.should.be.a('array');
          res.body.tours.length.should.equal(1);
          res.body.tours[0].name.should.equal('4 Countries Cycling Holiday');
          done();
        });
    });
  });

  describe('GET /operators', function () {
    it('should return a list of tour operators', (done) => {
      chai.request(server)
        .get('/api/v1/operators')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('IberoCycle');
          done();
        });
    });
  });

  describe('GET /operators/1', function () {
    it('should return an operator and all tours they manage', (done) => {
      chai.request(server)
        .get('/api/v1/operators/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('IberoCycle');

          res.body.should.have.property('tours');
          res.body.tours.should.be.a('array');
          res.body.tours.length.should.equal(1);
          res.body.tours[0].name.should.equal('4 Countries Cycling Holiday');
          done();
        });
    });
  });

  describe('GET /hotels', function () {
    it('should return a list of hotels', (done) => {
      chai.request(server)
        .get('/api/v1/hotels')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Villa Lola & Juan. Calle Farjarado');
          res.body[0].should.have.property('content');
          done();
        });
    });
  });

  describe('GET /hotels/1', function () {
    it('should return a hotel', (done) => {
      chai.request(server)
        .get('/api/v1/hotels/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('Villa Lola & Juan. Calle Farjarado');
          res.body.should.have.property('content');

          done();
        });
    });
  });

  describe('POST /hotels', function () {
    it('should add a hotel and return it', (done) => {
      chai.request(server)
        .post('/api/v1/hotels')
        .type('json')
        .send({
          name: 'A hotel',
          content: '<p>Some content</p>'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.equal('A hotel');
          res.body.should.have.property('content');

          chai.request(server)
            .get('/api/v1/hotels')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(2);
              res.body[0].should.have.property('name');
              res.body[0].name.should.equal('Villa Lola & Juan. Calle Farjarado');
              res.body[0].should.have.property('content');
              done();
            });
        });
    });
  });

  describe('PUT /hotels/1', function () {
    it('should update a hotel', (done) => {
      chai.request(server)
        .put('/api/v1/hotels/1')
        .type('json')
        .send({
          name: 'Fawlty Towers'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('Fawlty Towers');
          res.body.should.have.property('content');

          done();
        });
    });
  });

  describe('GET /tours/1/hotels', function () {
    it('should return a list of hotels for the tour', (done) => {
      chai.request(server)
        .get('/api/v1/tours/1/hotels')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');

          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Villa Lola & Juan. Calle Farjarado');
          res.body[0].should.have.property('content');

          done();
        });
    });
  });

  describe('GET /restaurants', function () {
    it('should return a list of restaurants', (done) => {
      chai.request(server)
        .get('/api/v1/restaurants')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Costa Teguise');
          res.body[0].should.have.property('content');
          done();
        });
    });
  });

  describe('GET /restaurants/1', function () {
    it('should return a restaurant', (done) => {
      chai.request(server)
        .get('/api/v1/restaurants/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('Costa Teguise');
          res.body.should.have.property('content');

          done();
        });
    });
  });

  describe('POST /restaurants', function () {
    it('should add a restaurant and return it', (done) => {
      chai.request(server)
        .post('/api/v1/restaurants')
        .type('json')
        .send({
          name: 'A restaurant',
          content: '<p>Some content</p>'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.equal('A restaurant');
          res.body.should.have.property('content');

          chai.request(server)
            .get('/api/v1/restaurants')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(2);
              res.body[0].should.have.property('name');
              res.body[0].name.should.equal('Costa Teguise');
              res.body[0].should.have.property('content');
              done();
            });
        });
    });
  });

  describe('PUT /restaurants/1', function () {
    it('should update a restaurant', (done) => {
      chai.request(server)
        .put('/api/v1/restaurants/1')
        .type('json')
        .send({
          name: 'Costa Pizza'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('name');
          res.body.name.should.equal('Costa Pizza');
          res.body.should.have.property('content');

          done();
        });
    });
  });

  describe('GET /tours/1/restaurants', function () {
    it('should return a list of restaurants for the tour', (done) => {
      chai.request(server)
        .get('/api/v1/tours/1/restaurants')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');

          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Costa Teguise');
          res.body[0].should.have.property('content');

          done();
        });
    });
  });

  describe('GET /customers/1', function () {
    it('should return a customer', (done) => {
      chai.request(server)
        .get('/api/v1/customers/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('first_name');
          res.body.should.have.property('last_name');
          res.body.should.have.property('email_address');
          res.body.should.have.property('telephone_number');
          res.body.should.have.property('alternative_telephone_number');
          res.body.should.have.property('country');
          res.body.should.have.property('address_line_1');
          res.body.should.have.property('address_line_2');
          res.body.should.have.property('town');
          res.body.should.have.property('county');
          res.body.should.have.property('postcode');
          res.body.first_name.should.equal('Trys');
          res.body.last_name.should.equal('Mudford');
          done();
        });
    });
  });

  describe('PUT /customers/1', function () {
    it('should update and return a customer', (done) => {
      chai.request(server)
        .put('/api/v1/customers/1')
        .type('json')
        .send({
          title: 'Mr',
          first_name: 'Trystan',
          last_name: 'Mudford',
          email_address: 'trysmudford@gmail.com',
          telephone_number: '01273 814019',
          country: 'GB',
          address_line_1: '3 Meadow Business Centre',
          address_line_2: 'Old Uckfield Road',
          town: 'Ringmer',
          county: 'East Sussex',
          postcode: 'BN8 5RW'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('first_name');
          res.body.should.have.property('last_name');
          res.body.should.have.property('email_address');
          res.body.should.have.property('telephone_number');
          res.body.should.have.property('alternative_telephone_number');
          res.body.should.have.property('country');
          res.body.should.have.property('address_line_1');
          res.body.should.have.property('address_line_2');
          res.body.should.have.property('town');
          res.body.should.have.property('county');
          res.body.should.have.property('postcode');
          res.body.first_name.should.equal('Trystan');
          res.body.last_name.should.equal('Mudford');
          done();
        });
    });

    it('should not allow missing details', (done) => {
      chai.request(server)
        .put('/api/v1/customers/1')
        .type('json')
        .send({
          first_name: 'Trystan'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /bookings', function () {
    it('should return a list of bookings', (done) => {
      chai.request(server)
        .get('/api/v1/bookings')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('customer_id');
          res.body[0].should.have.property('first_name');
          res.body[0].should.have.property('last_name');
          res.body[0].should.have.property('tour_name');
          res.body[0].should.have.property('tour_id');

          done();
        });
    });
  });


  describe('GET /bookings/1', function () {
    it('should return a booking', (done) => {
      chai.request(server)
        .get('/api/v1/bookings/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('total_cost');
          res.body.should.have.property('booking_reference');
          res.body.should.have.property('customer');
          res.body.customer.should.be.a('object');
          res.body.customer.first_name.should.equal('Trys');
          res.body.should.have.property('tour');
          res.body.tour.should.be.a('object');
          res.body.tour.name.should.equal('4 Countries Cycling Holiday');

          res.body.should.have.property('rooms');
          res.body.rooms.should.be.a('array');
          res.body.rooms[0].should.have.property('tour_price_id');
          res.body.rooms[0].should.have.property('cost');

          res.body.rooms[0].should.have.property('extras');
          res.body.rooms[0].extras.should.be.a('array');
          res.body.rooms[0].extras[0].should.have.property('booking_room_id');
          res.body.rooms[0].extras[0].should.have.property('cost');
          res.body.rooms[0].extras[0].should.have.property('name');
          res.body.rooms[0].extras[0].should.have.property('quantity');

          res.body.should.have.property('party');
          res.body.party.should.be.a('array');
          res.body.party[0].should.have.property('title');
          res.body.party[0].should.have.property('first_name');
          res.body.party[0].should.have.property('last_name');
          res.body.party[0].should.have.property('height');
          res.body.party[0].should.have.property('date_of_birth');
          res.body.party[0].should.have.property('booking_room_id');
          res.body.party[0].should.have.property('tour_bike_id');
          res.body.party[0].should.have.property('tour_bike');
          res.body.party[0].tour_bike.should.have.property('cost');
          res.body.party[0].tour_bike.should.have.property('name');

          res.body.party[0].should.have.property('extras');
          res.body.party[0].extras.should.be.a('array');
          res.body.party[0].extras[0].should.have.property('party_member_id');
          res.body.party[0].extras[0].should.have.property('tour_party_extra_variation_id');
          res.body.party[0].extras[0].should.have.property('cost');
          res.body.party[0].extras[0].should.have.property('name');

          done();
        });
    });
  });

  // describe('POST /bookings', function () {
  //   it('should create a booking', (done) => {
  //     chai.request(server)
  //       .post('/api/v1/bookings')
  //       .type('json')
  //       .send({

  //       })
  //       .end((err, res) => {
  //         res.should.have.status(201);
  //         res.should.be.json;
  //         res.body.should.be.a('object');


  //         done();
  //       });
  //   });
  // });

  describe('GET /tours/1/itineraries', function () {
    it('should return the documentation itinerary for the tour', (done) => {
      chai.request(server)
        .get('/api/v1/tours/1/itineraries')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');

          res.body.length.should.equal(2);
          res.body[0].should.have.property('title');
          res.body[0].title.should.equal('Day 1 - Paris to Calais');
          res.body[0].should.have.property('content');
          res.body[0].content.should.equal('Test documentation content');
          res.body[0].should.have.property('media_id');
          res.body[0].should.have.property('media');
          res.body[0].media_id.should.equal(1);
          res.body[0].media.id.should.equal(1);

          done();
        });
    });
  });

  describe('GET /media/1', function () {
    it('should return media item one', (done) => {
      chai.request(server)
        .get('/api/v1/media/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('url');
          res.body.url.should.equal('https://flexitreks-new.imgix.net/images/2018/7/2/test.jpg');

          done();
        });
    });
  });

  describe('GET /tours/1/documentation', function () {
    it('should return tour documentation data', (done) => {
      chai.request(server)
        .get('/api/v1/tours/1/documentation')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('map');
          res.body.map.should.be.a('object');
          res.body.map.url.should.equal('https://flexitreks-new.imgix.net/images/2018/7/2/test.jpg');

          res.body.should.have.property('arrival');
          res.body.should.have.property('luggage');
          res.body.should.have.property('food');
          res.body.should.have.property('bike_details');

          done();
        });
    });
  });

  describe('GET /tours/1/meta', function () {
    it('should return tour meta data', (done) => {
      chai.request(server)
        .get('/api/v1/tours/1/meta')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('weather');
          res.body.weather.should.equal('Some weather content');

          done();
        });
    });
  });

  describe('GET /bookings/1/documentation', function () {
    it('should return tour meta data', (done) => {
      chai.request(server)
        .get('/api/v1/bookings/1/documentation')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');

          res.body.should.have.property('booking');
          res.body.should.have.property('operator');
          res.body.should.have.property('itinerary');
          res.body.should.have.property('tour_meta');
          res.body.should.have.property('hotels');
          res.body.should.have.property('destinations');
          res.body.should.have.property('restaurants');

          done();
        });
    });
  });

  describe('GET /bikes', function () {
    it('should list all bike types', (done) => {
      chai.request(server)
        .get('/api/v1/bikes')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Electric bike with pannier & lock');

          done();
        });
    });
  });

  describe('GET /boats', function () {
    it('should list all boats', (done) => {
      chai.request(server)
        .get('/api/v1/boats')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('MS Normandie');

          done();
        });
    });
  });

  describe('GET /decks', function () {
    it('should list all decks', (done) => {
      chai.request(server)
        .get('/api/v1/decks')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Lower deck');

          done();
        });
    });
  });

  describe('GET /accommodation-categories', function () {
    it('should list all accommodation categories', (done) => {
      chai.request(server)
        .get('/api/v1/accommodation-categories')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Comfort');

          done();
        });
    });
  });

  describe('GET /room-types', function () {
    it('should list all room types', (done) => {
      chai.request(server)
        .get('/api/v1/room-types')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Double');
          res.body[0].should.have.property('sleeps');
          res.body[0].sleeps.should.equal(2);

          done();
        });
    });
  });

  describe('GET /galleries', function () {
    it('should return all the galleries', (done) => {
      chai.request(server)
        .get('/api/v1/galleries')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('media');
          done();
        });
    });
  });

  describe('POST /galleries', function () {
    it('should create a gallery', (done) => {
      chai.request(server)
        .post('/api/v1/galleries')
        .type('json')
        .send({ media: [1] })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('media');
          done();
        });
    });
  });

  describe('GET /galleries/1', function () {
    it('should return the gallery media', (done) => {
      chai.request(server)
        .get('/api/v1/galleries/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('url');
          done();
        });
    });
  });

  describe('PUT /galleries/1', function () {
    it('should return the gallery media', (done) => {
      chai.request(server)
        .put('/api/v1/galleries/1')
        .type('json')
        .send({ media: [1, 1] })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /tour-extras/1/1/party', function () {
    it('should return the tour party extras', (done) => {
      chai.request(server)
        .get('/api/v1/tour-extras/1/1/party')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          done();
        });
    });
  });

  describe('POST /tour-extras/1/1/party', function () {
    it('should add a tour party extra', (done) => {
      chai.request(server)
        .post('/api/v1/tour-extras/1/1/party')
        .type('json')
        .send({
          name: 'Extra, extra!',
          variations: [
            {
              cost: 120
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');

          chai.request(server)
            .get('/api/v1/tour-extras/1/1/party')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(2);
              res.body[1].should.have.property('name');
              res.body[1].name.should.equal('Extra, extra!');
              res.body[1].should.have.property('variations');
              res.body[1].variations.length.should.equal(1);
              res.body[1].variations[0].should.have.property('cost');
              res.body[1].variations[0].cost.should.equal(120);

              chai.request(server)
                .put(`/api/v1/tour-extras/1/1/party/${res.body[1].id}`)
                .type('json')
                .send({
                  name: 'Extra, extra!',
                  variations: [
                    {
                      cost: 150,
                      id: res.body[1].variations[0].id
                    }
                  ]
                })
                .end((err, res) => {
                  res.should.have.status(201);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');

                  chai.request(server)
                    .get(`/api/v1/tour-extras/1/1/party/${res.body.id}`)
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.should.be.a('object');
                      res.body.should.have.property('name');
                      res.body.should.have.property('variations');
                      res.body.variations.length.should.equal(1);
                      res.body.variations[0].should.have.property('cost');
                      res.body.variations[0].cost.should.equal(150);
                      done();
                    });
                });
            });
        });
    });
  });

  describe('GET /tour-pricing/1/1', function () {
    it('should return the tour pricing', (done) => {
      chai.request(server)
        .get('/api/v1/tour-pricing/1/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('start');
          done();
        });
    });
  });

  describe('GET /tour-pricing/1/1/1', function () {
    it('should return the tour pricing', (done) => {
      chai.request(server)
        .get('/api/v1/tour-pricing/1/1/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('start');
          res.body.should.have.property('prices');
          res.body.prices.should.be.a('array');
          done();
        });
    });
  });

  describe('PUT /tour-pricing/1/1/1', function () {
    it('should add tour pricing', (done) => {
      chai.request(server)
        .put('/api/v1/tour-pricing/1/1/1')
        .type('json')
        .send({
          start: '2018-03-04',
          prices: [
            {
              cost: 150,
              room_type_id: 1
            },
            {
              id: 1,
              tour_id: 1,
              tour_pricing_category_id: 1,
              cost: 500,
              tour_season_id: 1
            }
          ]
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('start');
          res.body.start.should.equal('2018-03-04T00:00:00.000Z');

          chai.request(server)
            .get('/api/v1/tour-pricing/1/1/1')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('start');
              res.body.start.should.equal('2018-03-04T00:00:00.000Z');
              res.body.should.have.property('prices');
              res.body.prices.length.should.equal(2);
              res.body.prices[0].should.have.property('cost');
              res.body.prices[0].cost.should.equal(150);

              done();
            });
        });
    });
  });

});
