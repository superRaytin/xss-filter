
var should = require('should');
var xssFilter = require('../dist/xssFilter-debug');
var xssfilter = new xssFilter();

describe('XSS Filter', function() {
  it('should xssFilter work', function() {
    xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>').should.equal('<div class="like">something...</div>');
  });

  it('should escape work', function() {
    xssfilter.options('escape', true);
    xssfilter.filter('<div class="like" ondblclick="takeme()" onmousedown="mousedown()">something...</div>').should.equal('&lt;div class="like"&gt;something...&lt;/div&gt;');
  });
});