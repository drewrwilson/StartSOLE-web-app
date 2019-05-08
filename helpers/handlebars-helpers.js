const hbs         = require('express-hbs');
const i18n        = require('i18n');

// ******************
// handlebars helpers
// ******************

hbs.registerHelper('ifEquals',
  function(a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  }
);

hbs.registerHelper('select', function(selected, options) {
  return options.fn(this).replace(
    new RegExp(' value=\"' + selected + '\"'),
    '$& selected="selected"');
});

hbs.registerHelper('contains', function( value, array, options ){
  array = ( array instanceof Array ) ? array : [array];
  return (array.indexOf(value) > -1) ? options.fn( this ) : '';
});

hbs.registerHelper('log', function(something) {
  logger.log(something);
});

// i18n helpers
hbs.registerHelper('__', function () {
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
  return i18n.__n.apply(this, arguments);
});
