# XSSFilter
XSS脚本过滤器，支持浏览器、Node.js、Sea.js、RequireJS等环境中使用。

测试HTML：

```
&lt;div class="like" ondblclick="takeme()" onmousedown="mousedown()"&gt;
	&lt;div class="title"&gt;title&lt;/div&gt;
	&lt;div class="desc" onsubmit="load()"&gt;desc&lt;/div&gt;
	&lt;div&gt;just&lt;/div&gt;
	&lt;style type="text"&gt;
		.red{color: #f00}
	&lt;/style&gt;
	&lt;script&gt;alert(88)&lt;/script&gt;
&lt;/div&gt;
&lt;script&gt;alert(99)&lt;/script&gt;
```

处理之后：

```
&lt;div class="like"&gt;
	&lt;div class="title"&gt;title&lt;/div&gt;
	&lt;div class="desc"&gt;desc&lt;/div&gt;
	&lt;div&gt;just&lt;/div&gt;
&lt;/div&gt;
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
