const i18n        = require('i18n');

// ******************
// handlebars helpers
// ******************

module.exports = function (hbs) {

  /**
   * handlebars helper for comparing if two strings are equal. returns true if equal, false otherwise
   */
  hbs.registerHelper('ifEquals',
    function (a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    }
  );
  /**
   * handlebars helper for building a select in a form
   */
  hbs.registerHelper('select', function (selected, options) {
    return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
  });
  /**
   * handlebars helper for checking if an array contains an item
   */
  hbs.registerHelper('contains', function (value, array, options) {
    array = (array instanceof Array) ? array : [array];
    return (array.indexOf(value) > -1) ? options.fn(this) : '';
  });
  /**
   * handlebars helper for logging something from the view
   */
  hbs.registerHelper('log', function (something) {
    logger.log(something);
  });

  /**
   * handlebars helper for i18n replacements (this is the main one)
   */
  hbs.registerHelper('__', function () {
    return i18n.__.apply(this, arguments);
  });

  /**
   * handlebars helper for i18n numbers
   */
  hbs.registerHelper('__n', function () {
    return i18n.__n.apply(this, arguments);
  });

};