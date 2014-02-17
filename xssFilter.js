(function(){
    var xssFilter = function(){};

    var REGEXP_LABEL_STYLE = /<style[^>]*>[^<]*<\/style>/mgi;
    var REGEXP_LABEL_SCRIPT = /<script[^>]*>[^<]*<\/script>/mgi;
    //var REGEXP_ATTRIBUTE = /<\w+[^ ]( ([^=]+)=(["'])[^\3]+\3)*>/mgi;
    var REGEXP_ATTR = /<\w+[^ ]( ([^=]+)=(["'])[^\3>]+\3)+>/mgi;

    var configOptions = {
        label_style: true,
        label_script: true,
        blackList_attr: {
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
        }
    };

    /*
     * Filter Attributes in Blacklist
     * */
    var _filterAttribute = function(html){
        var result = html;
        (function(){
            var attrExec = REGEXP_ATTR.exec(html);

            if(attrExec){
                var labelAttrs = attrExec[1];
                var attrs = utils.arr_compact(labelAttrs.split(/\s+/));

                utils.each(attrs, function(item){
                    var itemArray = item.split('=');
                    var attrKey = itemArray[0].toLowerCase();
                    var reg_replace, matched;

                    if(configOptions.blackList_attr[attrKey]){
                        reg_replace = new RegExp(attrKey + '=([\'"])[^\\1]+\\1', 'gmi');
                        matched = labelAttrs.match(reg_replace)[0];
                        result = result.replace(matched, '');
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
    var _filterLabelStyle = function(html){
        return html.replace(REGEXP_LABEL_STYLE, '');
    };

    /*
     * Filter Script Tag
     * */
    var _filterLabelSript = function(html){
        return html.replace(REGEXP_LABEL_SCRIPT, '');
    };

    /*
     * Filter Options Configuration
     * */
    xssFilter.options = function(name, obj){
        if(!configOptions[name]){
            console.log(name + ' is not a valid configuration name.');
            return;
        }

        if(obj === Object(obj)){
            utils.each(obj, function(value, key){
                configOptions[name][key] = obj[name][key];
            });
        }
    };

    xssFilter.filter = function(html){
        var result = html;

        result = _filterLabelStyle(result);
        result = _filterLabelSript(result);
        result = _filterAttribute(result);

        return result;
    };

    if(typeof module !== 'undefined' && module.exports){
        module.exports = xssFilter;
    }
    else{
        window.xssFilter = xssFilter;
    }

})();
