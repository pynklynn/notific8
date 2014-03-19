/**
 * @author Will Steinmetz
 * jQuery notification plug-in inspired by the notification style of Windows 8
 * Copyright (c)2013, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
module.exports = function(grunt) {
    grunt.config('watch', {
        css: {
            files: ['*.css', '!*.min.css'],
            tasks: ['compass', 'cssmin'],
            options: {
                spawn: false
            }
        },
        scripts: {
            files: ['*.js', '!.min.js'],
            tasks: ['uglify'],
            options: {
                spawn: false
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
};