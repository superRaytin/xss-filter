[中文](https://github.com/superRaytin/xssFilter/blob/master/README-CN.md)

# XSSFilter
XSSFilter is an XSS(Cross-Site Script) filter for Javascript and Node.js. It also work with Sea.js, Require.js. easy to use.

Testing HTML：

```
<div class="like" ondblclick="takeme()" onmousedown="mousedown()">
	<div class="title">title</div>
	<div class="desc" onsubmit="load()">desc</div>
	<div>just</div>
	<style type="text">
		.red{color: #f00}
	</style>
	<script>alert(88)</script>
</div>
<script>alert(99)</script>
```

Result：

```
<div class="like">
	<div class="title">title</div>
	<div class="desc">desc</div>
	<div>just</div>
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
<script src="./build/xssFilter.js"></script>
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
            'xssFilter': './build/xssFilter.js'
        }
    });
    */
    seajs.use('./build/xssFilter.js', function(xssFilter){
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
    var xssFilter = require('./build/xssFilter.js');
    var xss = new xssFilter();
    var output = xss.filter('some HTML content include XSS code');
    // ...
</script>
```

# API
```javascript
label_style: true,
label_script: true,
escape: false,
fix_tag: true,
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
```

- `label_style` - Whether filter style tags
- `label_script` - Whether filter script tags
- `escape` - Whether escape label, `"<" to "&lt;", ">" to "&gt;"`, default no
- `fix_tag` - Whether landscaping tag, eg: `"<div    >" to "<div>"`
- `blackList_attr` - Property blacklist, Properties in this list will be cleared

## Initialization
Accepts only one parameter, pass into a `{}` to override the default configuration，`options` optional.

```javascript
var xss = new xssFilter(options);
```

## Methods

### filter(String)
Filtration method, accepts only one parameter.

### options(Object) || options(String, String || Object)

It's not necessary to pass into configuration object in the initialization，Another approach is use the `options` method:

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

the second argument must be an object `{}` such as `blackList_attr`

For example, I dont want to filter the 'onsubmit' property, wrote like this:

```javascript
var xss = new xssFilter();
xss.options('blackList_attr', {
    onsubmit: false
});
var output = xss.filter('some html...');
```

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
