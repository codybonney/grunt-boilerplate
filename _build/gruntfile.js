module.exports = function(grunt) {

    var project_settings = {
        path : 'http://localhost/',
        media_path : 'http://localhost/assets'
    };

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: '../',
            srcPath: '../src/',
            deployPath: '../deploy/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',


        clean: {
            options: {
                force: true
            },
            build: {
                src: ["../deploy/**"]
            }
        },

        'string-replace': {
            kit: {
                files: {
                    '../deploy/index.html' : '../src/pages/index.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: /<!-- @import (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return grunt.file.read('../src/' + p1);
                            }
                        },
                        {
                            pattern: /<!-- @settings (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return project_settings[p1];
                            }
                        },
                        {
                            pattern: /\{\{(.*?)\}\}/ig,
                            replacement: function (match, p1, offset, string) {
                                return project_settings[p1];
                            }
                        }
                    ]
                }
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: '../src/assets/js', src: ['**'], dest: '../deploy/assets/js'},
                    {expand: true, cwd: '../src/assets/images', src: ['**'], dest: '../deploy/assets/images'},
                ]
            }
        },

        sass: {
            options: {
                style: 'expanded'
            },
            dist: {
                files: {
                    '../deploy/assets/css/style.css' : '../src/assets/css/style.scss',
                    '../deploy/assets/css/ie7.css' : '../src/assets/css/ie7.scss',
                    '../deploy/assets/css/ie8.css' : '../src/assets/css/ie8.scss',
                    '../deploy/assets/css/ie9.css' : '../src/assets/css/ie9.scss'
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task
    grunt.registerTask(
        'default',
        [
            'clean',
            'string-replace',
            'copy',
            'sass'
        ]
    );

};
