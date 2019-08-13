const server        = require('../server.js'),
      chai          = require('chai'),
      chaiHttp      = require('chai-http'),
      should        = chai.should(),
      Parse         = require('parse/node'),
      soleConfig    = require('../sole-config.js');

chai.use(chaiHttp);
const expect = chai.expect;

//get session token
const testUser = { email: process.env.TEST_USER_EMAIL, password: process.env.TEST_USER_PASSWORD },
      timeout  = 5000; //timeout length in milliseconds

let sessionToken = '';

describe('Login', function () {
  it('Login with example account', (done) => {
    chai.request(soleConfig.serverUrl)
      .post('/login')
      .set('X-Parse-Application-Id', 'Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({username: testUser.email, password: testUser.password})
      .end(function(error, response, body) {
        if (error) {
          done(error);
        } else {
          sessionToken = response.body.sessionToken;
          done();
        }
      });
  });
});

const routes = {
  prelogin: [
    "/",
    "/register",
    "/logout",
    // "/google-login-error",
    "/login",
    "/terms-of-use",
    "/privacy",
    "/verify-email-success",
    "/verify-email-failure",
    "/colombia",
    "/colombia/register",
    "/colombia/login"
  ],
  postlogin: [
    "/home",
    "/history",
    "/how",
    "/resources",
    // "/random-picture",
    // "/admin",
    // "/admin/pending-soles",
    // "/admin/browse-soles",
    // "/admin/browse-users",
    // "/admin/events",
    // "/admin/pa",
    "/profile",
    "/profile/subscriptions",
    "/profile/about-me",
    "/profile/complete",
    "/soles",
    "/soles/plan",
    // "/soles/:id",
    // "/soles/:id/download-plan",
    // "/soles/:id/download-summary",
    // "/soles/:id/copy",
    // "/soles/:id/plan",
    // "/soles/:id/delete",
    // "/soles/:id/reflect",
    "/questions",
    // "/questions/mine",
    "/questions/new",
    // "/questions/:id",
    // "/questions/:id/favorite",
    // "/questions/:id/delete-tag/:rdn",
    "/rings",
    // "/rings/:id",
    // "/rings/:id/educators-growth",
    // "/rings/:id/educators-by-grade",
    // "/rings/:id/soles-by-grade",
    // "/rings/:id/soles-growth",
    // "/rings/:id/educators-by-subject",
    // "/rings/:id/soles-by-subject"
  ]
};
// routes special cases: (must be post requests, maybe with param)
// "/users-range",
// "/users-today",
// "/users-range-detail",

describe('Load all pre-login routes', function() {
  routes.prelogin.forEach(route => {
    it('GET' + route + '. Does page load?', (done) => {
      chai.request(server)
        .get(route)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    }).timeout(timeout);
  });

  it('GET /lolwutno. It should show 404', (done) => {
    chai.request(server)
      .get('/lolwutno')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(timeout);

});

describe('Load all post-login routes', function() {
  routes.postlogin.forEach(route => {
    it('GET' + route + '. Does page load?', (done) => {
      chai.request(server)
        .get(route)
        .set('Cookie', 'sessionToken=' + sessionToken + ' ;path=/;')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.req.res.text).to.not.include('originalUrl'); //checks if this went to login page with an originalUrl redirect
          done();
        });
    }).timeout(timeout);
  });
});

describe('Users today', function() {
  it('Userstoday slack bot', (done) => {
    chai.request(server)
      .post('/slackbot/users-today')
      .end((err, res) => {
        res.should.have.status(200);
        //We have had *'+number+'* users sign up today!
        expect(res.req.res.text).to.include('We have had');
        done();
      });
  }).timeout(timeout);
});

