/*
 * xssFilter
 * https://github.com/superRaytin/xssFilter
 *
 * Copyright 2014, SuperRaytin
 * Released under the MIT license.
 */

(function(global){
    // RegExp
    var REGEXP_TAG = /<([a-zA-Z]+)[^>]*>[^<]*<\/\1>/img;
    var REGEXP_ATTR = /<[a-zA-Z]+( ([^=<]+)=(["'])[^\3>]+\3)+>/img;
    //var REGEXP_ATTR2 = /([\w-]+)\s*=\s*(["']?)([^"'= ]*)\2?/img;

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
        // Beautify Tags
        beautifyTags: true,

        // Escape
        escape: false,

        // filter tags
        blackList_tags: {
            // filter style label
            style: true,
            // filter script label
            script: true
        },

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
    var __filterAttribute = function(html, config){
        var result = html;
        var tempHTML = html;

        (function(){
            var attrMatches = REGEXP_ATTR.exec(tempHTML);

            if(attrMatches){
                var wholeLabel = attrMatches[0];
                var labelHasAttr = attrMatches[1];

                tempHTML = tempHTML.replace(labelHasAttr, '');

                //var attrArray = utils.arr_compact(labelHasAttr.split(/\s*=\s*/));
                var REGEXP_ATTR2 = /([\w-]+)\s*=\s*(["']?)([^"'= ]*)\2?/img;
                //var REGEXP_ATTR3 = /<[a-zA-Z]+\s+([\w-]+)\s*=\s*(["']?)([^"'= ]*)\2?>/img;
                var attrArray = labelHasAttr.match(REGEXP_ATTR2);

                utils.each(attrArray, function(item, i){
                    var attr = item.split(/\s*=\s*/);
                    var attrName = attr[0];

                    if(config.blackList_attrs[attrName]){
                        //result = result.replace(item, '');
                    }
                });

                //var trimed = labelAttrs.replace(/\s+=|=\s+/g, '=');
                console.log(labelAttrs);
                //console.log(99, trimed);
                var attrs = utils.arr_compact(labelAttrs.split(/\s+/));
                utils.each(attrs, function(item, i){
                    console.log(item);
                    var itemArray = item.split('=');
                    var attrName = utils.str_trim(itemArray[0].toLowerCase());


                    if(config.blackList_attrs[attrKey]){
                        result = result.replace(item, '');
                    }


                });

                arguments.callee();
            }

        })();

        return result;
    };
    var _filterAttribute = function(html, config){
        var result = html;
        var tempHTML = html;

        (function(){
            var attrMatches = tempHTML.match(REGEXP_ATTR);
console.log(attrMatches)
            if(attrMatches){
                var labelAttrs = attrMatches[0].replace(/>|</g, '');
                var trimed = labelAttrs.replace(/\s+=|=\s+/g, '=');
                console.log(labelAttrs);
                console.log(99, trimed);
                var attrs = utils.arr_compact(labelAttrs.split(/\s+/));
                utils.each(attrs, function(item, i){
                    console.log(item);
                    var itemArray = item.split('=');
                    var attrKey = utils.str_trim(itemArray[0].toLowerCase());
                    if(config.blackList_attrs[attrKey]){
                        result = result.replace(item, '');
                    }

                    tempHTML = tempHTML.replace(item, '');
                });

                arguments.callee();
            }
        })();

        return result;
    };

    /*
     * Filter Tags in Blacklist
     * */
    var _filterTags = function(html, config){
        var result = html;
        var tempHTML = html;

        (function(){
            var tagMatches = tempHTML.match(REGEXP_TAG);

            if(tagMatches){
                utils.each(tagMatches, function(tagBody){
                    var tagName = tagBody.substring(tagBody.lastIndexOf('<') + 2, tagBody.length - 1);

                    if(config.blackList_tags[tagName]){
                        result = result.replace(tagBody, '');
                    }

                    tempHTML = tempHTML.replace(tagBody, '');
                });

                arguments.callee();
            }
        })();

        return result;
    };

    /*
    * Beautify Tags
    * */
    var _BeautifyTags = function(candy){
        return candy.replace(/\t+\n/g, '').replace(/['"]\s*>/mg, function(a){
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

        result = _filterTags(result, config);

        result = _filterAttribute(result, config);

        if(config.beautifyTags){
            result = _BeautifyTags(result);
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
