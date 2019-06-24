const server        = require('../server.js'),
      chai          = require('chai'),
      chaiHttp      = require('chai-http'),
      should        = chai.should(),
      Parse         = require('parse/node'),
      soleConfig    = require('../sole-config.js');
      sessionToken  = process.env.TEST_SESSION_TOKEN; //add sessionToken to environmental variables

chai.use(chaiHttp);


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
    "/random-picture",
    "/admin",
    "/admin/pending-soles",
    "/admin/browse-soles",
    "/admin/browse-users",
    "/admin/events",
    "/admin/pa",
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

describe('Load all pre-login routesload', function() {
  routes.prelogin.forEach(route => {
    it('GET' + route + '. Does page load?', (done) => {
      chai.request(server)
        .get(route)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    }).timeout(10000);
  });

  it('GET /lolwutno. It should show 404', (done) => {
    chai.request(server)
      .get('/lolwutno')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);

});

// describe('Test if all post-login routes load', function() {
//   routes.postlogin.forEach(route => {
//     it('GET' + route + '. Does page load?', (done) => {
//       chai.request(server)
//         .get(route)
//         .set('Cookie', 'sessionToken=' + sessionToken +' ;')
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     }).timeout(10000);
//   });
//
// });


