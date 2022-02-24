/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
export class registerHelpers {
    static init() {
        
      Handlebars.registerHelper('concat', function() {
          var outStr = '';
          for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
              outStr += arguments[arg];
            }
          }
          return outStr;
        });
    
      Handlebars.registerHelper('toLowerCase', function(str) {
          return str.toLowerCase();
        });
  
      Handlebars.registerHelper('ifCond', function (arg1, operator, arg2, options) {
  
          switch (operator) {
              case '==':
                  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
              case '===':
                  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
              case '!=':
                  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
              case '!==':
                  return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
              case '<':
                  return (arg1 < arg2) ? options.fn(this) : options.inverse(this);
              case '<=':
                  return (arg1 <= arg2) ? options.fn(this) : options.inverse(this);
              case '>':
                  return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
              case '>=':
                  return (arg1 >= arg2) ? options.fn(this) : options.inverse(this);
              case '&&':
                  return (arg1 && arg2) ? options.fn(this) : options.inverse(this);
              case '||':
                  return (arg1 || arg2) ? options.fn(this) : options.inverse(this);
              default:
                  return options.inverse(this);
          }
      });
    }
  }