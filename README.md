[中文](https://github.com/superRaytin/xssFilter/blob/master/README-CN.md)

# XSSFilter
XSSFilter is an XSS(Cross-Site Script) code filter for Javascript and Node.js. It also work with Sea.js, Require.js. easy to use.

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

[API Documentation](https://github.com/superRaytin/xssFilter/wiki/API-Documentation)

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

#### Normal

```javascript
<script type="text/javascript" src="./build/xssFilter.js"></script>
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

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
