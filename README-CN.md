# XSSFilter
XSSFilter是一个Javascript XSS(Cross-Site Script) 过滤器，支持Node.js，当然也可以和Sea.js、Require.js等模块加载器协作使用。

测试HTML：

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

处理之后：

```
<div class ="like">
	<div class="title" title="I am a title!" value = "big">title</div>
	<div class="desc">desc</div>
	<div>just a div</div>
</div>
```

[API 文档](#api)

# 安装

### npm

```
npm install xssfilter
```

### bower

```
bower install xssFilter
```

# 使用

### Node.js

example.js

```javascript
var xssFilter = require('xssfilter');
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

#### 通过Seajs调用

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

#### 通过requireJS调用

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
## 配置选项

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
    onabort: true,
    onerror: true
}
```

- `label_style` - 是否过滤style标签
- `label_script` - 是否过滤script标签
- `escape` - 是否对标签进行转义, `"<" to "&lt;", ">" to "&gt;"`，默认不转义
- `beautifyTags` - 是否美化标签, eg: `"<div    >" to "<div>"`
- `blackList_attrs` - 属性黑名单, 在此名单上的属性将被清除

## 初始化
最多支持一个参数，传进对象字面量，覆盖默认配置，`options` 可选

```javascript
var xss = new xssFilter(options);
```

## 方法

### filter
过滤方法，仅接受一个参数

### options

配置除了可以在初始化时传入参数来修改，也可以使用提供的`options`方法：

```javascript
var xss = new xssFilter();
xss.options({
    escape: true,
    label_style: false
});
var output = xss.filter('some html...');
```

也可以针对单个进行配置，下面这段代码输出的HTML中标签将会被转义

```javascript
var xss = new xssFilter();
xss.options('escape', true);
var output = xss.filter('some html...');
```

对于二级配置比如`blackList_attrs`，第二个参数必须是一个`{}`对象

比如下面这段代码作用是，不对`onsubmit`属性进行过滤

```javascript
var xss = new xssFilter();
xss.options('blackList_attrs', {
    onsubmit: false
});
var output = xss.filter('some html...');
```

# License
MIT, see the [LICENSE](https://github.com/superRaytin/xssFilter/blob/master/LICENSE) file for detail.
