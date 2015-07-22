module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['tmp'],

        stencil_dust: {
            options: {
                dust: require('dustjs-linkedin')
            },
            templates: {
                src: [
                    '*.dust',
                    'bower_components/stencil-*/**/*.dust',
                    'tests/**/*.dust'
                ],
                dest: 'tmp/templates.js'
            }
        },

        sass: {
            options: {
                style: 'expanded',
                sourcemap: 'none',
                loadPath: [
                    './',
                    './bower_components',
                ],
                require: ['compass/import-once/activate']
            },
            compile_tests: {
                src: 'tests/visual/test.scss',
                dest: 'tmp/index.css'
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'iOS >= 6.0',
                    'Android >= 2.3',
                    'last 4 ChromeAndroid versions'
                ]
            },
            prefix_tests: {
                files: [{
                    expand: true,
                    src: 'tmp/*.css' // Overwrite compiled css.
                }]
            },
        },

        watch: {
            all: {
                files: [
                    '**/*.scss',
                    '**/*.dust'
                ],
                tasks: ['compile']
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 3000,
                    useAvailablePort: true,
                    base: '.',
                }
            }
        }
    });

    // Tasks
    grunt.registerTask('compile', ['stencil_dust', 'sass', 'autoprefixer']);
    grunt.registerTask('serve', ['compile', 'connect:server', 'watch']);
    grunt.registerTask('default', ['serve']);
};
