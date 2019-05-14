const server        = require('../server.js'),
      chai          = require('chai'),
      chaiHttp      = require('chai-http'),
      should        = chai.should(),
      Parse         = require('parse/node'),
      soleConfig    = require('../sole-config.js');
      sessionToken  = process.env.SESSION_TOKEN; //add sessionToken to environmental variables

chai.use(chaiHttp);

const routes = [
  '/home',
  '/history',
  '/how',
  '/terms-of-use',
  '/privacy',
  '/verify-email-success',
  '/verify-email-failure',
  '/resources',
  '/profile',
  '/complete-profile',
  '/soles',
  // '/soles/:id',
  // '/soles/:id/download-plan',
  // '/soles/:id/download-summary',
  // '/soles/:id/copy',
  // '/soles/:id/edit',
  // '/soles/:id/delete',
  // '/soles/:id/reflect',
  '/sole-reflect',
  '/questions',
  '/questions/mine',
  '/questions/add',
  // '/questions/:id',
  // '/questions/:id/favorite',
  // '/questions/:id/delete-tag/:rdn',
  // '/questions/:id/approve',
  // '/questions/:id/reject',
  // '/soles/:id/approve',
  // '/soles/:id/reject',
  '/error'
];

describe('Test if all routes load', function() {
  it('GET /. It should show login page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // routes.forEach(route => {
  //   it('GET' + route + '. It should show page', (done) => {
  //     chai.request(server)
  //       .get(route)
  //       .set('Cookie', 'sessionToken=' + sessionToken +' ;')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       });
  //   }).timeout(10000);
  // });

  it('GET /lolwutno. It should show 404', (done) => {
    chai.request(server)
      .get('/lolwutno')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);

});


