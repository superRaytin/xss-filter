
var should = require('should');
var utils = require('../lib/utils');

describe('utils', function() {
  it('should str_trim() work', function() {
    utils.str_trim(' hello').should.equal('hello');
    utils.str_trim('hello').should.equal('hello');
    utils.str_trim(' hello ').should.equal('hello');
    utils.str_trim('      hello      ').should.equal('hello');
  });

  it('should arr_compact() work', function() {
    utils.arr_compact(['', 'a', 'b', '', 'c', '']).should.eql(['a', 'b', 'c']);
    utils.arr_compact(['', 'a', 'b', 'c', '']).should.eql(['a', 'b', 'c']);
  });

  it('should isObject() work', function() {
    utils.isObject({a: 1}).should.equal(true);
    utils.isObject(['a']).should.equal(true);
  });

  it('should extend() work', function() {
    var obj = {a: 1};
    utils.extend(obj, {b: 2});
    obj.should.eql({a: 1, b: 2});

    obj = {a: 1, b: 6};
    utils.extend(obj, {a: 3});
    obj.should.eql({a: 3, b: 6});
  });
});