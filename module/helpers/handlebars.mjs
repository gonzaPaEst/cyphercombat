/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
export class registerHelpers {
    static init() {

        Handlebars.registerHelper('concat', function () {
            var outStr = '';
            for (var arg in arguments) {
                if (typeof arguments[arg] != 'object') {
                    outStr += arguments[arg];
                }
            }
            return outStr;
        });

        Handlebars.registerHelper('toLowerCase', function (str) {
            return str.toLowerCase();
        });

        Handlebars.registerHelper('roundUp', function (int) {
            return Math.ceil(int);
        });

        Handlebars.registerHelper('disposition', function (int) {
            switch (int) {
                case -1:
                    return "hostile";
                case 0:
                    return "neutral";
                case 1:
                    return "friendly";
                default:
                    return "neutral";
            }
        });

        Handlebars.registerHelper('log', function (object) {
            console.log(object);
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