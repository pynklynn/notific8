module.exports = function(grunt) {
    grunt.initConfig({
        pkg: require('./package.json'),
    });

    grunt.loadTasks('grunt');
    
    grunt.registerTask('default', ['compass', 'cssmin', 'ugilfy']);
};