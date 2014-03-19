/**
 * @author Will Steinmetz
 * jQuery notification plug-in inspired by the notification style of Windows 8
 * Copyright (c)2013, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
module.exports = function(grunt) {
    grunt.config('compass', {
        dist: {
            options: {
                sassDir: 'sass',
                cssDir: '.',
                outputStyle: 'compact',
                noLineComments: true,
                httpPath: '/',
                environment : "production"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
};