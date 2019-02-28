
/*
A tool for creating json and an xls file from handlebars for translation
created by Justin on December 11, 2018
 */

const fs = require('fs');
const s18n = require('s18n');
const Excel = require('exceljs');

//define the handlebars templates that will be processed
const htmlFiles = [
  {
    name: 'admin',
    path: '../views/admin.hbs'
  },
  {
    name: 'admin-browse-soles',
    path: '../views/admin-browse-soles.hbs'
  },
  {
    name: 'admin-browse-users',
    path: '../views/admin-browse-users.hbs'
  },
  {
    name: 'complete-profile',
    path: '../views/complete-profile.hbs'
  },
  {
    name: 'dashboard',
    path: '../views/dashboard.hbs'
  },
  // {
  //   name: 'dashboard-question-approval',
  //   path: '../views/dashboard-question-approval.hbs'
  // },
  {
    name: 'dashboard-sole-approval',
    path: '../views/dashboard-sole-approval.hbs'
  },
  {
    name: 'fail',
    path: '../views/fail.hbs'
  },
  {
    name: 'history',
    path: '../views/history.hbs'
  },
  {
    name: 'home',
    path: '../views/home.hbs'
  },
  {
    name: 'how-to-sole',
    path: '../views/how-to-sole.hbs'
  },
  {
    name: 'login',
    path: '../views/login.hbs'
  },
  {
    name: 'logout',
    path: '../views/logout.hbs'
  },
  {
    name: 'map',
    path: '../views/map.hbs'
  },
  {
    name: 'my-questions',
    path: '../views/my-questions.hbs'
  },
  {
    name: 'privacy',
    path: '../views/privacy.hbs'
  },
  {
    name: 'profile',
    path: '../views/profile.hbs'
  },
  {
    name: 'questions',
    path: '../views/questions.hbs'
  },
  {
    name: 'questions-add',
    path: '../views/questions-add.hbs'
  },
  {
    name: 'register',
    path: '../views/register.hbs'
  },
  {
    name: 'resources',
    path: '../views/resources.hbs'
  },
  {
    name: 'soles',
    path: '../views/soles.hbs'
  },
  {
    name: 'soles-add',
    path: '../views/soles-add.hbs'
  },
  {
    name: 'soles-delete',
    path: '../views/soles-delete.hbs'
  },
  {
    name: 'soles-reflect',
    path: '../views/soles-reflect.hbs'
  },
  {
    name: 'soles-single',
    path: '../views/soles-single.hbs'
  },
  {
    name: 'stats',
    path: '../views/stats.hbs'
  },
  {
    name: 'terms-of-use',
    path: '../views/terms-of-use.hbs'
  },
  {
    name: 'verify-email-failure',
    path: '../views/verify-email-failure.hbs'
  },
  {
    name: 'verify-email-success',
    path: '../views/verify-email-success.hbs'
  }
];

//define the elements & attributes that will be extracted for translation
const options = {
  elements: ['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'a', 'button', 'span', 'label', 'i', 'input', 'strong'],
  attributes: ['alt', 'title']
};

let workbook = new Excel.Workbook();
workbook.creator = 'StartSOLE';
workbook.created = new Date();

let date = new Date().toDateString();

//extract the materials from each handlebars file
htmlFiles.forEach(function(htmlFile) {
  let locale = s18n.extractFiles(htmlFile.path, options)
    .then(function(nativeLocale){
      //save json file
      fs.writeFile(htmlFile.name+'.json', JSON.stringify(nativeLocale), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("Saved json localization file!");

        //setup sheet for excel file and add header row
        let sheet = workbook.addWorksheet(htmlFile.name);
        sheet.addRow(['id','English text','Spanish text']);
        //iterate over object and add row for each entry
        Object.entries(nativeLocale).forEach(function(pair){
          sheet.addRow(pair);
        });
        //write xls file
        workbook.xlsx.writeFile('export ('+date+').xls')
          .then(function() {
            // done
          });

      });
    })
    .catch(function(err){
      log.error(err);
    });
});

