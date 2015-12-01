/*
 * utils
 */

var utils = {
    each: function(stack, handler) {
        var len = stack.length;
        if (len) {
            for(var i = 0; i < len; i++) {
                if (handler.call(stack[i], stack[i], i) === false) break;
            }
        }
        else if (typeof len === 'undefined') {
            for(var name in stack) {
                if (handler.call(stack[name], stack[name], name) === false) break;
            }
        }
    },

    str_trim: function(string) {
        return string.replace(/^\s+/g, '').replace(/\s+$/g, '');
    },

    arr_compact: function(array) {
        var result = [];
        utils.each(array, function(item) {
            if (utils.str_trim(item) != '') {
                result.push(item);
            }
        });

        return result;
    },

    isObject: function(obj) {
        return obj === Object(obj);
    },

    extend: function(target, obj) {
        utils.each(obj, function(value, key) {
            target[key] = value;
        });
    }
};

module.exports = utils;

