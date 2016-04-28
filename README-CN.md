# xssFilter
> xssFilter 是一个 XSS (Cross-Site Script) 过滤器模块，提供了友好，可靠的 XSS 过滤 API，支持在 Node.js 和浏览器中使用。

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Bower version][bower-image]][bower-url]

[![xssfilter](https://nodei.co/npm/xssfilter.png)](https://npmjs.org/package/xssfilter)

[npm-url]: https://npmjs.org/package/xssfilter
[downloads-image]: http://img.shields.io/npm/dm/xssfilter.svg
[npm-image]: http://img.shields.io/npm/v/xssfilter.svg
[bower-url]:http://badge.fury.io/bo/xssFilter
[bower-image]: https://badge.fury.io/bo/xssFilter.svg

[API 文档](#matchstyletag)

# 安装

### NPM

```
$ npm install xssfilter
```

### Bower

```
$ bower install xssFilter
```

# 使用

### Node.js

```js
var xssFilter = require('xssfilter');
var xssfilter = new xssFilter();

var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
// output: <div class="like">something...</div>
```

### 浏览器

```js
<script src="./dist/xssFilter.js"></script>
<script>
    var xssfilter = new xssFilter();
    var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
    // output: <div class="like">something...</div>
</script>
```

#### 通过 [require.js](http://requirejs.org/) 调用

```js
<script src="require.js"></script>
<script>
    define(function() {
        var xssFilter = require('./dist/xssFilter.js');
        var xssfilter = new xssFilter();

        var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
        // output: <div class="like">something...</div>
    });
</script>
```

#### 通过 [sea.js](http://seajs.org/) 调用

```js
<script src="sea.js"></script>
<script>
    seajs.use('./dist/xssFilter.js', function(xssFilter){
        var xssfilter = new xssFilter();

        // "<" to &lt; ">" to &gt;
        xssfilter.options('escape', true);

        var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
        // output: &lt;div class="like"&gt;something...&lt;/div&gt;
    })
</script>
```

# 直观地效果

测试 HTML：

```html
<div class ="like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">
	<div class="title" title="I am a title!" value = "big">title</div>
	<div class="desc" onsubmit="load()">desc</div>
	<div>just a div</div>
	<style type="text">
		.red{color: #f00}
	</style>
	<script>alert(88)</script>
</div>
<script>alert(99)</script>
```

处理之后：

```html
<div class="like">
	<div class="title" title="I am a title!" value="big">title</div>
	<div class="desc">desc</div>
	<div>just a div</div>
</div>
```

# 配置选项

### matchStyleTag

是否匹配 `style` 标签，默认会把匹配到的 `style` 标签删除，设置为 `false` 阻止删除

### matchScriptTag

是否匹配 `script` 标签，默认会把匹配到的 `script` 标签删除，设置为 `false` 阻止删除

### removeMatchedTag

是否要删除匹配到的标签，默认删除，如果设置为 `false`，则对标签进行转义

`removeMatchedTag` 需要与 `matchStyleTag`、`matchScriptTag` 配合使用，比如:

```js
var xssfilter = new xssFilter({
    removeMatchedTag: false
});
```

```html
<div class ="like" onmousedown="mousedown()">
	<style type="text">
		.red{color: #f00}
	</style>
	something...
</div>
<script>alert(88)</script>
```

结果:

```html
<div class="like">
	&lt;style type="text"&gt;
		.red{color: #f00}
	&lt;/style&gt;
	something...
</div>
&lt;script&gt;alert(88)&lt;/script&gt;
```

### blackListAttrs

标签属性黑名单列表，在这个列表中的属性将被清除

blackListAttrs 的初始值列表：

```js
{
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
```

### escape

是否对整个字符串进行转义，默认不转义

# 初始化

创建一个 `xssFilter` 实例：

```js
var xssfilter = new xssFilter(options);
```

构造函数方法中的 `options` 参数是可选的，传入需要的自定义配置，可以覆盖默认的配置选项。

# 实例方法

### filter
过滤目标字符串的方法，仅接受一个参数

### options

配置选项除了可以在初始化时传入参数指定，也可以使用 `options` 方法来修改：

```js
var xssfilter = new xssFilter();

xssfilter.options({
    escape: true,
    matchStyleTag: false
});

var output = xssfilter.filter('some html...');
```

当然也可以配置单个选项，下面这段代码输出的 HTML 中的标签将会被转义

```js
var xssfilter = new xssFilter();
xssfilter.options('escape', true);
var output = xssfilter.filter('some html...');
```

对于二级配置比如 `blackListAttrs`，第二个参数则必须是一个 `{}` 对象：

```js
var xssfilter = new xssFilter();

xssfilter.options('blackListAttrs', {
    onsubmit: false
});

var output = xssfilter.filter('<div class="like" ondblclick="ondblclick();" onsubmit="dosomething()">something...</div>');
// output: <div class="like" onsubmit="dosomething()">something...</div>
```

# Test case

```
npm test
```

# 其他预防 XSS 的库

- [https://github.com/leizongmin/js-xss](https://github.com/leizongmin/js-xss)
- [https://github.com/yahoo/xss-filters](https://github.com/yahoo/xss-filters)

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
