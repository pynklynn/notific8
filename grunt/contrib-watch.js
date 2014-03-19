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