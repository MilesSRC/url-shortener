module.exports = function(grunt){
    grunt.initConfig({
        pkg: `${__dirname}/package.json`,
        watch: {
            scripts: {
                files: ['public/js/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        },
        uglify: {
            options: {
                mangle: {
                    reserved: ['jQuery', '$']
                }
            },
            my_target: {
                files: {
                    'public/js/home.min.js': ['public/js/home.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
}