# XSSFilter

A XSS Filter, support for Node.js, browser, Sea.js, Require.js.

Testing HTML String：
`
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
`

Result：

`
<div class="like">
	<div class="title">title</div>
	<div class="desc">desc</div>
	<div>just</div>
</div>
`

# Usage

### Node.js
install xssFilter by `npm`：

`
npm install xssFilter
`

example.js
`
var xssFilter = require('xssFilter');
var xss = new xssFilter();

// "<" to &lt; ">" to &gt;
xss.options('escape', true);

var output = xss.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
// output: &lt;div class="like"&gt;something...&lt;/div&gt;
`

### Browser

#### Normal
`
<script src="./build/xssFilter.js"></script>
<script>
    var xss = new xssFilter();

    // "<" to &lt; ">" to &gt;
    xss.options('escape', true);

    var output = xss.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
</script>
`

#### Use with sea.js
`
<script src="sea.js"></script>
<script>
    seajs.use('./build/xssFilter.js', function(xssFilter){
        var xss = new xssFilter();
        var output = xss.filter('some HTML content include XSS code');
        // ...
    })
</script>
`

#### Use with require.js
`
<script src="require.js"></script>
<script>
    var xssFilter = require('./build/xssFilter.js');
    var xss = new xssFilter();
    var output = xss.filter('some HTML content include XSS code');
    // ...
</script>
`

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
