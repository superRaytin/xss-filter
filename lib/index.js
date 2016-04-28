
var utils = require('./utils');

// 匹配 style 标签的正则表达式
var REGEXP_TAG_STYLE = /<style[^>]*>[^<]*<\/style>/img;

// 匹配 script 标签的正则表达式
var REGEXP_TAG_SCRIPT = /<script[^>]*>[^<]*<\/script>/img;

// 匹配标签中的属性 的正则表达式
var REGEXP_ATTR = /([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))/img;

// 匹配带有属性并且属性名称前面有空格的标签 的正则表达式
var REGEXP_ATTR_SPACE_PRE = /\s*([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))/img;

// 匹配带有属性并且属性值后面有空格的标签 的正则表达式
var REGEXP_ATTR_SPACE_SUF = /([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))(\s*)/img;

// 匹配带有属性的标签 的正则表达式
var REGEXP_ATTR_WITH_TAG = /<[a-zA-Z]+[a-zA-Z0-9]*((\s+([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*)))+).*>/img;

/**
 * 构造函数
 *
 * @param {Object} options, 配置对象
 * @return {String}
 * */
function XSSFilter(options) {
    // 初始化配置
    this.config = {
        // 是否匹配 style 标签
        matchStyleTag: true,

        // 是否匹配 script 标签
        matchScriptTag: true,

        // 是否要删除匹配到的标签，如果设置为 false，则对标签进行转义
        removeMatchedTag: true,

        // 是否对整个字符串进行转义，默认不转义
        escape: false,

        // 标签属性黑名单列表，在这个列表中的属性将被清除
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

    // 实例化时扩展初始化配置
    if (utils.isObject(options)) {
        utils.extend(this.config, options);
    }
}


/**
 * 修改过滤参数的方法
 *
 * @param {String} name
 * @param {String} obj
 *
 * 支持 3 种调用方式：
 * filterConstant.options('escape', true);
 *
 * filterConstant.options({
 *  escape: true
 * });
 *
 * filterConstant.options('blackListAttrs', {
 *  onclick: false
 * })
 *
 * @return {String}
 * */
XSSFilter.prototype.options = function(name, obj) {
    var config = this.config;

    if (arguments.length) {
        if (typeof name === 'string') {
            if (typeof config[name] === 'undefined') {
                throw new Error(name + ' is not a valid configuration name.');
            }

            if (typeof obj === 'undefined') {
                throw new Error('Please enter a value corresponding to the ' + name);
            }

            if (utils.isObject(obj)) {
                utils.extend(config[name], obj);
            } else {
                config[name] = obj;
            }
        } else if (utils.isObject(name)) {
            obj = name;
            utils.extend(config, obj);
        }
    }
};


/**
 * 过滤 html 的方法
 *
 * @param {String} html
 * @return {String}
 * */
XSSFilter.prototype.filter = function(html) {
    if (html == '') return html;

    var result = html;
    var config = this.config;

    if (config.matchStyleTag) {
        result = filterStyleTag(result, config);
    }

    if (config.matchScriptTag) {
        result = filterScriptTag(result, config);
    }

    result = filterAttribute(result, config);

    // clear tag spaces
    result = clearTagSpaces(result);

    if (config.escape) {
        result = escapeTags(result);
    }

    return result;
};


/**
 * 过滤在黑名单中的标签属性
 *
 * @param {String} html, 原始的 html 字符串
 * @param {Object} config, 配置对象
 * @return {String}
 * */
function filterAttribute(html, config) {
    var result = html;
    var tempHTML = html;

    (function() {
        //
        var attrMatches = REGEXP_ATTR_WITH_TAG.exec(tempHTML);
        REGEXP_ATTR_WITH_TAG.lastIndex = 0;

        if (attrMatches) {
            var labelHasAttr = attrMatches[1];
            var attrArray = labelHasAttr.match(REGEXP_ATTR);

            tempHTML = tempHTML.replace(labelHasAttr, '');

            utils.each(attrArray, function(item) {
                var attrName = utils.str_trim(item.substr(0, item.indexOf('='))).toLowerCase();

                if (config.blackListAttrs[attrName]) {
                    result = result.replace(item, '');
                }
            });

            arguments.callee();
        }
    })();

    return result;
}


/**
 * 过滤 style 标签
 *
 * @param {String} html
 * @param {Object} config, 配置对象
 * @return {String}
 * */
 function filterStyleTag(html, config) {
    var result;

    if (config.removeMatchedTag) {
        result = html.replace(REGEXP_TAG_STYLE, '');
    } else {
        result = html.replace(REGEXP_TAG_STYLE, function(body) {
            return escapeTags(body);
        });
    }

    return result;
}


/**
 * 过滤 script 标签
 *
 * @param {String} html
 * @param {Object} config, 配置对象
 * @return {String}
 * */
function filterScriptTag(html, config) {
    var result;

    if (config.removeMatchedTag) {
        result = html.replace(REGEXP_TAG_SCRIPT, '');
    } else {
        result = html.replace(REGEXP_TAG_SCRIPT, function(body) {
            return escapeTags(body);
        });
    }

    return result;
}


/**
 * 清理标签中多余的空格
 *
 * @param {String} html
 * @return {String}
 * */
function clearTagSpaces(html) {

    // 主要移除三种空格
    // 1. 属性名称前面多余的空格
    // 2. 属性值后面多余的空格
    // 3. 等号两边的空格
    // 示例：[   name  =  "value"  ] -> [ name="value" ]
    var result = html.replace(REGEXP_ATTR_SPACE_PRE, function(dirtyAttr, attrName, attrValue) {
        return ' ' + attrName + '=' + attrValue;
    }).replace(REGEXP_ATTR_SPACE_SUF, function(dirtyAttr, attrName, attrValue, a, b, c, sufSpace) {
        var cleanAttr = attrName + '=' + attrValue;

        // 如果结尾没有空格（sufSpace == 0），则不补加单个空字符串
        if (sufSpace.length > 0) {
            cleanAttr += ' ';
        }

        return cleanAttr;
    });

    // 移除标签结束符前面的空格
    // 示例：[<div   >] -> [<div>]
    result = result.replace(/\t+\n/g, '').replace(/\s*>/mg, function(a) {
        return a.replace(/\s+/, '');
    });

    return result;
}


/**
 * 对标签进行转义
 *
 * @param {String} html
 * @return {String}
 * */
function escapeTags(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 在 AMD 模块环境中使用
if (typeof define === 'function' && define.amd) {
    define(function(){
        return XSSFilter;
    });
}
// 在浏览器中使用
else if (typeof window !== 'undefined') {
    window.xssFilter = XSSFilter;
}

module.exports = XSSFilter;
