
var utils = require('./utils');

// RegExp
var REGEXP_TAG_STYLE = /<style[^>]*>[^<]*<\/style>/img;
var REGEXP_TAG_SCRIPT = /<script[^>]*>[^<]*<\/script>/img;
var REGEXP_ATTR = /([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))/img;
var REGEXP_ATTR_SPACE_PRE = /\s*([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))/img;
var REGEXP_ATTR_SPACE_SUF = /([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))\s*/img;
var REGEXP_ATTR_WITH_TAG = /<[a-zA-Z]+[a-zA-Z0-9]*((\s+([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*)))+).*>/img;

// constructor
function XSSFilter(options) {
    // Initial Configuration
    this.config = {
        // match style tag
        matchStyleTag: true,

        // match script tag
        matchScriptTag: true,

        // clean Tag
        cleanTag: true,

        // escape
        escape: false,

        // blacklist for attributes
        blackListAttrs: {
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
            onabort: true,
            onerror: true
        }
    };

    if (utils.isObject(options)) {
        utils.extend(this.config, options);
    }
}

/*
 * Filter Options Configuration
 * */
XSSFilter.prototype.options = function(name, obj) {
    var args = arguments;
    var config = this.config;

    if (args.length) {
        if (typeof name === 'string') {
            if (typeof config[name] === 'undefined') {
                throw new Error(name + ' is not a valid configuration name.');
                return;
            }

            if (typeof obj === 'undefined') {
                throw new Error('Please enter a value corresponding to the ' + name);
                return;
            }

            if (utils.isObject(obj)) {
                utils.extend(config[name], obj);
            }
            else {
                config[name] = obj;
            }
        }
        else if (utils.isObject(name)) {
            obj = name;
            utils.extend(config, obj);
        }
    }
};

/*
 * Filter Attributes in Blacklist
 * */
var _filterAttribute = function(html, config) {
    var result = html;
    var tempHTML = html;

    (function() {
        var attrMatches = REGEXP_ATTR_WITH_TAG.exec(tempHTML);
        REGEXP_ATTR_WITH_TAG.lastIndex = 0;

        if (attrMatches) {
            var labelHasAttr = attrMatches[1];
            var attrArray = labelHasAttr.match(REGEXP_ATTR);

            tempHTML = tempHTML.replace(labelHasAttr, '');

            utils.each(attrArray, function(item) {
                var attrName = utils.str_trim(item.substr(0, item.indexOf('=')));

                if (config.blackListAttrs[attrName]) {
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
var _filterStyleTag = function(html) {
    return html.replace(REGEXP_TAG_STYLE, '');
};

/*
 * Filter Script Tag
 * */
var _filterScriptTag = function(html) {
    return html.replace(REGEXP_TAG_SCRIPT, '');
};

/**
 * 清理标签中多余的空格
 *
 * @param {String} html
 * @return {String}
 * */
var _clearTagSpaces = function(html) {
    // 先移除属性名称前面多余的空格，再移除属性值后面多余的空格
    // 示例：[   name  =  "value"  ] -> [ name="value" ]
    var result = html.replace(REGEXP_ATTR_SPACE_PRE, function(dirtyAttr, attrName, attrValue) {
        return ' ' + attrName + '=' + attrValue;
    }).replace(REGEXP_ATTR_SPACE_SUF, function(dirtyAttr, attrName, attrValue) {
        return attrName + '=' + attrValue + ' ';
    });

    // 移除标签结束符前面的空格
    // 示例：[<div   >] -> [<div>]
    result = result.replace(/\t+\n/g, '').replace(/\s*>/mg, function(a) {
        return a.replace(/\s+/, '');
    });

    return result;
};

/*
 * Escape Tags
 * */
var _escapeTags = function(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

XSSFilter.prototype.filter = function(html) {
    if (html == '') {
        return;
    }

    var result = html;
    var config = this.config;

    if (config.matchStyleTag) {
        result = _filterStyleTag(result);
    }

    if (config.matchScriptTag) {
        result = _filterScriptTag(result);
    }

    result = _filterAttribute(result, config);

    if (config.cleanTag) {
        result = _clearTagSpaces(result);
    }

    if (config.escape) {
        result = _escapeTags(result);
    }

    return result;
};

module.exports = XSSFilter;
