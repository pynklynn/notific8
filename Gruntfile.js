/**
 * @author Will Steinmetz
 * jQuery notification plug-in inspired by the notification style of Windows 8
 * Copyright (c)2013, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: require('./package.json'),
    });

    grunt.loadTasks('grunt');
    
    grunt.registerTask('default', ['compass', 'cssmin', 'uglify']);
};