// grunt
module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*\n' +
                    ' * xssFilter <%= pkg.version %>\n' +
                    ' * <%= pkg.description %>\n' +
                    ' * https://github.com/superRaytin/xssFilter\n' +
                    ' *\n' +
                    ' * Copyright 2014, Leon Shi\n' +
                    ' * Released under the MIT license.\n' +
                    '*/\n\n'
            },
            main: {
                files: [
                    {
                        src: ['dist/xssFilter-debug.js'],
                        dest: 'dist/xssFilter.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build', ['uglify']);
};