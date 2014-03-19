module.exports = function(grunt) {
    grunt.config('cssmin', {
        minify: {
            expand: true,
//            cwd: '.',
//            src: ['*.css', '!*.min.css'],
//            dest: '.',
//            ext: '.min.css'
            files: {
                'jquery.notific8.min.css': ['jquery.notific8.css']
            }
        },
        add_banner: {
            options: {
                banner: '/**\n\
 * @author Will Steinmetz\n\
 * jQuery notification plug-in inspired by the notification style of Windows 8\n\
 * Copyright (c)2014, Will Steinmetz\n\
 * Licensed under the BSD license.\n\
 * http://opensource.org/licenses/BSD-3-Clause\n\
 */'
            },
            files: {
                'jquery.notific8.min.css': ['jquery.notific8.min.css']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
};