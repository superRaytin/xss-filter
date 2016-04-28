
var should = require('should');
var xssFilter = require('../lib/index');

var htmlHead = '<div class="like"  ondblclick= "ondblclick(); return false;"  onmousedown="mousedown()">';
var text = 'something...';
var htmlFoot = '</div>';
var defaultScript = '<script>alert(88)</script>';
var defaultMultiLineScript = '<script>\n' +
    'alert(88)\n' +
    '</script>';
var defaultStyle = '<style type="text">.red{color: #f00}</style>';
var defaultStyleEscaped = '&lt;style type="text"&gt;.red{color: #f00}&lt;/style&gt;';
var defaultMultiLineStyle = '<style type="text">\n' +
    '.red{color: #f00}\n' +
    '</style>';
var defaultMultiLineStyleEscaped = '&lt;style type="text"&gt;\n' +
    '.red{color: #f00}\n' +
    '&lt;/style&gt;';
var div1 = '<div class="title" title="I am a title!" value = "big">title</div>';
var div2 = '<div class="desc" onsubmit="load()">desc</div>';


var defaultHTML = htmlHead + text + htmlFoot;

describe('filter', function() {
  it('should filter() work', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter(defaultHTML).should.equal('<div class="like">something...</div>');
    xssfilter.options('blackListAttrs', {
      onmousedown: false
    });
    xssfilter.filter('<div class="like"     ondblclick= "ondblclick(); return false;"       onmousedown  ="mousedown()"    >something...</div>').should.equal('<div class="like" onmousedown="mousedown()">something...</div>');
    xssfilter.filter('<div class="like"     ondblclick= "ondblclick(); return false;"       onmousedown  ="mousedown()" data-title="onmousedown=mousedown()"    >something...</div>').should.equal('<div class="like" onmousedown="mousedown()" data-title="onmousedown=mousedown()">something...</div>');
  });

  it('should options() work', function() {
    var xssfilter = new xssFilter();
    xssfilter.options({
      escape: true
    });
    xssfilter.config.escape.should.equal(true);

    xssfilter.options({
      escape: false
    });
    xssfilter.config.escape.should.equal(false);
  });

  it('should escape work', function() {
    var xssfilter = new xssFilter();
    xssfilter.options('escape', true);
    xssfilter.filter(defaultHTML).should.equal('&lt;div class="like"&gt;something...&lt;/div&gt;');

    xssfilter.options('escape', false);
    xssfilter.filter(defaultHTML).should.equal('<div class="like">something...</div>');
  });

  it('should blackListAttrs work', function() {
    var xssfilter = new xssFilter();
    xssfilter.options('blackListAttrs', {
      ondblclick: false
    });
    xssfilter.filter(defaultHTML).should.equal('<div class="like" ondblclick="ondblclick(); return false;">something...</div>');

    xssfilter.options('blackListAttrs', {
      onmousedown: false
    });
    xssfilter.filter(defaultHTML).should.equal('<div class="like" ondblclick="ondblclick(); return false;" onmousedown="mousedown()">something...</div>');

    xssfilter.options('blackListAttrs', {
      ondblclick: true,
      onmousedown: false
    });
    xssfilter.filter(defaultHTML).should.equal('<div class="like" onmousedown="mousedown()">something...</div>');
  });

  it('should cleanTag work', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter(defaultHTML).should.equal('<div class="like">something...</div>');
    xssfilter.filter('<div    class="like"     ondblclick= "ondblclick();      return false;"     onmousedown    =           "mousedown();     alert(8888)" aaa bbb   >something...</div>').should.equal('<div class="like" aaa bbb>something...</div>');
  });

  it('should removeMatchedTag work', function() {
    var xssfilter = new xssFilter();
    var html = htmlHead + text + defaultStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');

    xssfilter.options('removeMatchedTag', false);
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultStyleEscaped +'</div>');

    var html2 = htmlHead + text + defaultMultiLineStyle + htmlFoot;
    xssfilter.options('removeMatchedTag', false);
    xssfilter.filter(html2).should.equal('<div class="like">something...'+ defaultMultiLineStyleEscaped +'</div>');
  });

  it('should matchStyleTag work', function() {
    var xssfilter = new xssFilter();

    xssfilter.options('matchStyleTag', false);
    var html = htmlHead + text + defaultStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultStyle +'</div>');

    xssfilter.options('matchStyleTag', false);
    html = htmlHead + text + defaultMultiLineStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultMultiLineStyle +'</div>');

    xssfilter.options('matchStyleTag', true);
    html = htmlHead + text + defaultStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');

    xssfilter.options('matchStyleTag', true);
    html = htmlHead + text + defaultMultiLineStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');
  });

  it('should matchScriptTag work', function() {
    var xssfilter = new xssFilter();

    xssfilter.options('matchScriptTag', false);
    var html = htmlHead + text + defaultScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultScript +'</div>');

    xssfilter.options('matchScriptTag', false);
    html = htmlHead + text + defaultMultiLineScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultMultiLineScript +'</div>');

    xssfilter.options('matchScriptTag', true);
    html = htmlHead + text + defaultScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');

    xssfilter.options('matchScriptTag', true);
    html = htmlHead + text + defaultMultiLineScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');
  });

  it('should work when attribute value was double quoted or single quoted or unquoted', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter('<div class="like" onmousedown="mousedown()">something...</div>').should.equal('<div class="like">something...</div>');
    xssfilter.filter("<div class='like' onmousedown='mousedown()'>something...</div>").should.equal("<div class='like'>something...</div>");
    xssfilter.filter('<div class=likebbbbbbbbbbbbbb onmousedown=mousedown()>something...</div>').should.equal('<div class=likebbbbbbbbbbbbbb>something...</div>');
  });

  it('should work when there are spaces between attribute name and "=", like class ="like"', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter('<div class ="like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">something...</div>').should.equal('<div class="like">something...</div>');
    xssfilter.filter('<div class = "like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">something...</div>').should.equal('<div class="like">something...</div>');
    xssfilter.filter('<div class =  "like" ondblclick= "ondblclick();    return false;" onmousedown="mousedown()">something...</div>').should.equal('<div class="like">something...</div>');
  });

  it('should work when attribute is uppercase', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter('<div class ="like" onMouseOver= "dosomething(); return false;" onmousedown="mousedown()">something...</div>').should.equal('<div class="like">something...</div>');
  });
});