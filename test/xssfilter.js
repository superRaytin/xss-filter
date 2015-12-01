
var should = require('should');
var xssFilter = require('../lib/index');

var htmlHead = '<div class="like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">';
var text = 'something...';
var htmlFoot = '</div>';
var defaultScript = '<script>alert(88)</script>';
var defaultMultiLineScript = '<script>\n' +
    'alert(88)\n' +
    '</script>';
var defaultStyle = '<style type="text">.red{color: #f00}</style>';
var defaultMultiLineStyle = '<style type="text">\n' +
    '.red{color: #f00}\n' +
    '</style>';
var div1 = '<div class="title" title="I am a title!" value = "big">title</div>';
var div2 = '<div class="desc" onsubmit="load()">desc</div>';


var defaultHTML = htmlHead + text + htmlFoot;

describe('XSS Filter', function() {
  it('should filter() work', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter(defaultHTML).should.equal('<div class="like">something...</div>');
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
    xssfilter.options('blackList_attrs', {
      ondblclick: false
    });
    xssfilter.filter(defaultHTML).should.equal('<div class="like" ondblclick= "ondblclick(); return false;">something...</div>');

    xssfilter.options('blackList_attrs', {
      onmousedown: false
    });
    xssfilter.filter(defaultHTML).should.equal('<div class="like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">something...</div>');

    xssfilter.options('blackList_attrs', {
      ondblclick: true,
      onmousedown: false
    });
    xssfilter.filter(defaultHTML).should.equal('<div class="like"  onmousedown="mousedown()">something...</div>');
  });

  it('should beautifyTags work', function() {
    var xssfilter = new xssFilter();
    xssfilter.options('beautifyTags', false);
    xssfilter.filter(defaultHTML).should.equal('<div class="like"  >something...</div>');

    xssfilter.options('beautifyTags', true);
    xssfilter.filter(defaultHTML).should.equal('<div class="like">something...</div>');
  });

  it('should label_style work', function() {
    var xssfilter = new xssFilter();

    xssfilter.options('label_style', false);
    var html = htmlHead + text + defaultStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultStyle +'</div>');

    xssfilter.options('label_style', false);
    html = htmlHead + text + defaultMultiLineStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultMultiLineStyle +'</div>');

    xssfilter.options('label_style', true);
    html = htmlHead + text + defaultStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');

    xssfilter.options('label_style', true);
    html = htmlHead + text + defaultMultiLineStyle + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');
  });

  it('should label_script work', function() {
    var xssfilter = new xssFilter();

    xssfilter.options('label_script', false);
    var html = htmlHead + text + defaultScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultScript +'</div>');

    xssfilter.options('label_script', false);
    html = htmlHead + text + defaultMultiLineScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...'+ defaultMultiLineScript +'</div>');

    xssfilter.options('label_script', true);
    html = htmlHead + text + defaultScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');

    xssfilter.options('label_script', true);
    html = htmlHead + text + defaultMultiLineScript + htmlFoot;
    xssfilter.filter(html).should.equal('<div class="like">something...</div>');
  });

  it('should work when there are spaces between attribute name and "=", like class ="like"', function() {
    var xssfilter = new xssFilter();
    xssfilter.filter('<div class ="like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">something...</div>').should.equal('<div class ="like">something...</div>');
    xssfilter.filter('<div class = "like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">something...</div>').should.equal('<div class = "like">something...</div>');
  });
});