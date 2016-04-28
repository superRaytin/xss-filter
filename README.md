# xss-filter
> xss-filter is a XSS (Cross-Site Script) Filter for Node.js & the browser, provides friendly, reliable XSS filter API for you.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Bower version][bower-image]][bower-url]

[![xssfilter](https://nodei.co/npm/xssfilter.png)](https://npmjs.org/package/xssfilter)

[npm-url]: https://npmjs.org/package/xssfilter
[downloads-image]: http://img.shields.io/npm/dm/xssfilter.svg
[npm-image]: http://img.shields.io/npm/v/xssfilter.svg
[bower-url]:http://badge.fury.io/bo/xssFilter
[bower-image]: https://badge.fury.io/bo/xssFilter.svg

[中文](https://github.com/superRaytin/xssFilter/blob/master/README-CN.md)

[API Documentation](#manifest)

Test HTML:

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

Result in：

```html
<div class="like">
	<div class="title" title="I am a title!" value="big">title</div>
	<div class="desc">desc</div>
	<div>just a div</div>
</div>
```

# Installation / Download

`npm install xssfilter` or `bower install xssFilter` or just download [xssFilter.js](dist/xssFilter.js) from the git repo.

# Usage

### Node.js

```js
var xssFilter = require('xssfilter');
var xssfilter = new xssFilter();

var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
// output: <div class="like">something...</div>
```

### Browser

```js
<script src="./dist/xssFilter.js"></script>
<script>
    var xssfilter = new xssFilter();
    var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
    // output: <div class="like">something...</div>
</script>
```

#### Use with [require.js](http://requirejs.org/)

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

#### Use with [sea.js](http://seajs.org/)

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

# Manifest

### matchStyleTag

whether match `style` tag, default is `true`. Set to `false` to prevent remove the matched `style` tags.

### matchScriptTag

whether match `script` tag, default is `true`. Set to `false` to prevent remove the matched `script` tags.

### removeMatchedTag

whether remove matched tag, default is `true`. Set to `false` to using escape instead of remove.

`removeMatchedTag` should be used with `matchStyleTag` and `matchScriptTag`, for example:

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

Result in:

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

attributes blacklist, attributes in this list will be cleared.

initial blacklist of attributes：

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

escape tags of whole html string, `"<" to "&lt;", ">" to "&gt;"`, default no.


# Initialization
The configuration options can be specified by passing an `options` parameter in the initialization. `options` is optional, provided to override the default configuration.

```js
var xssfilter = new xssFilter(options);
```

# Instance methods

### filter
Filtering target string, accepts only one parameter.

### options

Use this method to modify the configuration options after initialization.

```js
var xssfilter = new xssFilter();

xssfilter.options({
    escape: true,
    matchStyleTag: false
});

var output = xssfilter.filter('some html...');
```

You can also configure single option:

```js
var xssfilter = new xssFilter();
xssfilter.options('escape', true);
var output = xssfilter.filter('some html...');
```

when set secondary attributes like `blackListAttrs`, the second argument must be an object `{}`:

```js
var xssfilter = new xssFilter();

xssfilter.options('blackListAttrs', {
    onsubmit: false
});

var output = xssfilter.filter('<div class="like" ondblclick="ondblclick();" onsubmit="dosomething()">something...</div>');
// output: <div class="like" onsubmit="dosomething()">something...</div>
```

# Testing

```
npm test
```

# Other xss filter view

- [https://github.com/leizongmin/js-xss](https://github.com/leizongmin/js-xss)
- [https://github.com/yahoo/xss-filters](https://github.com/yahoo/xss-filters)

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
