/*
 * xssFilter 0.1.0
 * https://github.com/superRaytin/xssFilter
 *
 * Copyright 2014, SuperRaytin
 * Released under the MIT license.
 */

(function(global){
    // RegExp
    var REGEXP_LABEL_STYLE = /<style[^>]*>[^<]*<\/style>/img;
    var REGEXP_LABEL_SCRIPT = /<script[^>]*>[^<]*<\/script>/img;
    var REGEXP_ATTR = /([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ ]*))/img;
    var REGEXP_ATTR_LABEL = /<[a-zA-Z]+((\s+([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ ]*)))+)>/img;

    // Tools
    var utils = {
        each: function(stack, handler){
            var len = stack.length;
            if(len){
                for(var i = 0; i < len; i++){
                    if(handler.call(stack[i], stack[i], i) === false) break;
                }
            }
            else if(typeof len === 'undefined'){
                for(var name in stack){
                    if(handler.call(stack[name], stack[name], name) === false) break;
                }
            }
        },
        str_trim: function(string){
            return string.replace(/^\s+/g, '').replace(/\s+$/g, '');
        },
        arr_compact: function(array){
            var result = [];
            utils.each(array, function(item){
                if(utils.str_trim(item) != ''){
                    result.push(item);
                }
            });

            return result;
        },
        isObject: function(obj){
            return obj === Object(obj);
        },
        extend: function(target, obj){
            utils.each(obj, function(value, key){
                target[key] = value;
            });
        }
    };

    // constructor
    function XSSFilter(options){
        if(utils.isObject(options)){
            utils.extend(this.config, options);
        }
    }

    // Initial Configuration
    XSSFilter.prototype.config = {
        // filter style label
        label_style: true,

        // filter script label
        label_script: true,

        // Beautify Tags
        beautifyTags: true,

        // Escape
        escape: false,

        blackList_attrs: {
            onclick: true,
            ondblclick: true,
            onchange: true,
            onblur: true,
            onfocus: true,
            onkeydown: true,
            onkeypress: true,
            onkeyup: true,
            onmousedown: true,
            onmousemove: true,
            onmouseover: true,
            onmouseout: true,
            onmouseup: true,
            onselect: true,
            onsubmit: true,
            onreset: true,
            onload: true,
            onabort: true
        }
    };

    /*
     * Filter Options Configuration
     * */
    XSSFilter.prototype.options = function(name, obj){
        var args = arguments;
        var config = this.config;

        if(args.length){
            if(typeof name === 'string'){
                if(typeof config[name] === 'undefined'){
                    throw new Error(name + ' is not a valid configuration name.');
                    return;
                }

                if(typeof obj === 'undefined'){
                    throw new Error('Please enter a value corresponding to the ' + name);
                    return;
                }

                if(utils.isObject(obj)){
                    utils.extend(config[name], obj);
                }
                else{
                    config[name] = obj;
                }
            }
            else if(utils.isObject(name)){
                obj = name;
                utils.extend(config, obj);
            }
        }
    };

    /*
     * Filter Attributes in Blacklist
     * */
    var _filterAttribute = function(html, config){
        var result = html;
        var tempHTML = html;

        (function(){
            var attrMatches = REGEXP_ATTR_LABEL.exec(tempHTML);
            REGEXP_ATTR_LABEL.lastIndex = 0;

            if(attrMatches){
                var labelHasAttr = attrMatches[1];
                var attrArray = labelHasAttr.match(REGEXP_ATTR);

                tempHTML = tempHTML.replace(labelHasAttr, '');

                utils.each(attrArray, function(item){
                    var attrName = utils.str_trim(item.substr(0, item.indexOf('=')));

                    if(config.blackList_attrs[attrName]){
                        result = result.replace(item, '');
                    }
                });

                arguments.callee();
            }
        })();

        return result;
    };

    /*
     * Filter Style Tag
     * */
    var _filterLabelStyle = function(candy){
        return candy.replace(REGEXP_LABEL_STYLE, '');
    };

    /*
     * Filter Script Tag
     * */
    var _filterLabelSript = function(candy){
        return candy.replace(REGEXP_LABEL_SCRIPT, '');
    };

    /*
    * Beautify Tags
    * */
    var _beautifyTags = function(candy){
        return candy.replace(/\t+\n/g, '').replace(/\s*>/mg, function(a){
            return a.replace(/\s+/, '');
        });
    };

    /*
     * Escape Tags
     * */
    var _escapeTags = function(candy){
        return candy.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    XSSFilter.prototype.filter = function(html){
        if(html == ''){
            return;
        }

        var result = html;
        var config = this.config;

        if(config.label_style){
            result = _filterLabelStyle(result);
        }

        if(config.label_script){
            result = _filterLabelSript(result);
        }

        result = _filterAttribute(result, config);

        if(config.beautifyTags){
            result = _beautifyTags(result);
        }

        if(config.escape){
            result = _escapeTags(result);
        }

        return result;
    };

    /*
    * export via AMD or CommonJS, otherwise leak a global
    * */
    if(typeof define === 'function' && (define.amd || define.cmd)){
        define(function(){
            return XSSFilter;
        });
    }
    else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
        module.exports = XSSFilter;
    }
    else{
        global.xssFilter = XSSFilter;
    }

})(this);
