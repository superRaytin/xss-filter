# xssFilter
> xssFilter is a XSS (Cross-Site Script) Filter for Node.js & the browser, provides friendly, reliable XSS filter API for you.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

[![xssfilter](https://nodei.co/npm/xssfilter.png)](https://npmjs.org/package/xssfilter)

[npm-url]: https://npmjs.org/package/xssfilter
[downloads-image]: http://img.shields.io/npm/dm/xssfilter.svg
[npm-image]: http://img.shields.io/npm/v/xssfilter.svg

[中文](https://github.com/superRaytin/xssFilter/blob/master/README-CN.md)

[API Documentation](#api)

# Install

### NPM

```
$ npm install xssfilter
```

### Bower

```
$ bower install xssFilter
```

# Example

Test HTML Content:

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

Result：

```html
<div class ="like">
	<div class="title" title="I am a title!" value = "big">title</div>
	<div class="desc">desc</div>
	<div>just a div</div>
</div>
```

# Usage

### Node.js

```js
var xssFilter = require('xssfilter');
var xssfilter = new xssFilter();

// "<" to &lt; ">" to &gt;
xssfilter.options('escape', true);

var output = xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
// output: &lt;div class="like"&gt;something...&lt;/div&gt;
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

#### Use with require.js

```js
<script src="require.js"></script>
<script>
    var xssFilter = require('./dist/xssFilter.js');
    var xssfilter = new xssFilter();
    var output = xssfilter.filter('some HTML content include XSS code');
    // ...
</script>
```

#### Use with sea.js

```js
<script src="sea.js"></script>
<script>
    /*
    seajs.config({
        alias: {
            'xssFilter': './dist/xssFilter.js'
        }
    });
    */
    seajs.use('./dist/xssFilter.js', function(xssFilter){
        var xssfilter = new xssFilter();
        var output = xssfilter.filter('some HTML content include XSS code');
        // ...
    })
</script>
```

# API
## Manifest

```js
label_style: true,
label_script: true,
escape: false,
beautifyTags: true,
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
    onabort: true,
    onerror: true
}
```

- `label_style` - filter style tags
- `label_script` - filter script tags
- `escape` - escape tags, `"<" to "&lt;", ">" to "&gt;"`, default no
- `beautifyTags` -beautify tags, eg: `"<div    >" to "<div>"`
- `blackList_attrs` - Property blacklist, Properties in this list will be cleared

## Initialization
Accepts only one parameter, `options` is optional, if provided, `options` will override the default configuration.

```js
var xssfilter = new xssFilter(options);
```

## Methods

### filter
Filtration method, accepts only one parameter.

### options

It's not necessary to provide an configuration object for initialization, Another approach is use the `options` method:

```js
var xssfilter = new xssFilter();

xssfilter.options({
    escape: true,
    label_style: false
});

var output = xssfilter.filter('some html...');
```

You can also modify the single configuration:

```js
var xssfilter = new xssFilter();
xssfilter.options('escape', true);
var output = xssfilter.filter('some html...');
```

the second argument must be an object `{}` such as `blackList_attrs`

For example, I dont want to filter the 'onsubmit' property, wrote like this:

```js
var xssfilter = new xssFilter();

xssfilter.options('blackList_attrs', {
    onsubmit: false
});

var output = xssfilter.filter('some html...');
```

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
