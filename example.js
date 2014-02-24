var xssFilter = require('xssFilter');

var testHTML =  '<div class ="like" ondblclick= "ondblclick(); return false;" onmousedown="mousedown()">\n' +
                    '\t<div class="title" title="I am a title!" value = "big">title</div>\n' +
                    '\t<div class="desc" onsubmit="load()">desc</div>\n' +
                    '\t<div>just a div</div>\n' +
                    '\t<style type="text">\n' +
                        '\t\t.red{color: #f00}\n' +
                    '\t</style>\n' +
                    '\t<script>alert(88)<\/script>\n' +
                '</div>\n' +
                '<script>alert(99)<\/script>';

var xss = new xssFilter();
var candy = xss.filter(testHTML);

console.log(candy);