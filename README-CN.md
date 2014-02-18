# XSSFilter
XSS脚本过滤器，支持浏览器、Node.js、Sea.js、RequireJS等环境中使用。

测试HTML：

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

处理之后：

```
<div class="like">
	<div class="title">title</div>
	<div class="desc">desc</div>
	<div>just</div>
</div>
```

# 使用

### Node.js
通过 `npm` 安装xssFilter：

```
npm install xssFilter
```

example.js

```
var xssFilter = require('xssFilter');
var xss = new xssFilter();

// "<" to &lt; ">" to &gt;
xss.options('escape', true);

var output = xss.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
// output: &lt;div class="like"&gt;something...&lt;/div&gt;
```

### Browser

#### 标准

```
<script src="./build/xssFilter.js"></script>
<script>
    var xss = new xssFilter();

    // "<" to &lt; ">" to &gt;
    xss.options('escape', true);

    var output = xss.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>');
</script>
```

#### 通过Seajs调用

```
<script src="sea.js"></script>
<script>
    seajs.use('./build/xssFilter.js', function(xssFilter){
        var xss = new xssFilter();
        var output = xss.filter('some HTML content include XSS code');
        // ...
    })
</script>
```

#### 通过requireJS调用

```
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
