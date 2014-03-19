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