module.exports = function(grunt) {
    grunt.config('uglify', {
        uglify: {
            options: {
                mangle: true,
                banner: '/**\n\
 * @author Will Steinmetz\n\
 * jQuery notification plug-in inspired by the notification style of Windows 8\n\
 * Copyright (c)2013, Will Steinmetz\n\
 * Licensed under the BSD license.\n\
 * http://opensource.org/licenses/BSD-3-Clause\n\
 */'
            },
            my_target: {
                files: {
                    'jquery.notific8.min.js': ['jquery.notific8.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
};