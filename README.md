[中文](https://github.com/superRaytin/xssFilter/blob/master/README-CN.md)

# XSSFilter
XSSFilter is an XSS(Cross-Site Script) filter for Javascript and Node.js. It also work with Sea.js, Require.js. easy to use.

Testing HTML：

```
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

```
<div class ="like">
	<div class="title" title="I am a title!" value = "big">title</div>
	<div class="desc">desc</div>
	<div>just a div</div>
</div>
```

[API Documentation](#api)

# Usage

### Node.js
install xssFilter by `npm`：

```
npm install xssFilter
```

example.js

```javascript
var xssFilter = require('xssFilter');
var xss = new xssFilter();

// "<" to &lt; ">" to &gt;
xss.options('escape', true);

var output = xss.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
// output: &lt;div class="like"&gt;something...&lt;/div&gt;
```

### Browser

```javascript
<script src="./dist/xssFilter.js"></script>
<script>
    var xss = new xssFilter();
    var output = xss.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
    // output: <div class="like">something...</div>
</script>
```

#### Use with sea.js

```javascript
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
        var xss = new xssFilter();
        var output = xss.filter('some HTML content include XSS code');
        // ...
    })
</script>
```

#### Use with require.js

```javascript
<script src="require.js"></script>
<script>
    var xssFilter = require('./dist/xssFilter.js');
    var xss = new xssFilter();
    var output = xss.filter('some HTML content include XSS code');
    // ...
</script>
```

# API
## Manifest

```javascript
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
    onabort: true
}
```

- `label_style` - filter style tags
- `label_script` - filter script tags
- `escape` - escape tags, `"<" to "&lt;", ">" to "&gt;"`, default no
- `beautifyTags` -beautify tags, eg: `"<div    >" to "<div>"`
- `blackList_attrs` - Property blacklist, Properties in this list will be cleared

## Initialization
Accepts only one parameter, `options` is optional, if provided, `options` will override the default configuration.

```javascript
var xss = new xssFilter(options);
```

## Methods

### filter
Filtration method, accepts only one parameter.

### options

It's not necessary to provide an configuration object for initialization, Another approach is use the `options` method:

```javascript
var xss = new xssFilter();
xss.options({
    escape: true,
    label_style: false
});
var output = xss.filter('some html...');
```

You can also modify the single configuration:

```javascript
var xss = new xssFilter();
xss.options('escape', true);
var output = xss.filter('some html...');
```

the second argument must be an object `{}` such as `blackList_attrs`

For example, I dont want to filter the 'onsubmit' property, wrote like this:

```javascript
var xss = new xssFilter();
xss.options('blackList_attrs', {
    onsubmit: false
});
var output = xss.filter('some html...');
```

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
