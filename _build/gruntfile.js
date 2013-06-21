module.exports = function(grunt) {

    var project_settings = {
        path : 'http://localhost'
    }; var ps = project_settings;

    ps.media_path = ps.path + '/assets/images';
    ps.js_path  = ps.path + '/assets/js';
    ps.css_path = ps.path + '/assets/css';

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
            html: {
                files: {
                    '../deploy/index.html' : '../src/pages/index.html',
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
                            pattern: /<!-- @script (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return "<script src=\"" + project_settings.js_path + "/" + p1 + "\"></script>";
                            }
                        },
                        {
                            pattern: /<!-- @inline-script (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return "\n<script>\n" + grunt.file.read('../src/' + p1) + "\n</script>";
                            }
                        }, {
                            pattern: /<!-- @style (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return "\n<style>\n" + grunt.file.read('../deploy/' + p1) + "</style>";
                            }
                        },
                        {
                            pattern: /<!-- @style-ltie9 (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return "<!--[if lt IE 9]>\n<style>\n" + grunt.file.read('../deploy/' + p1) + "</style>\n<![endif]-->";
                            }
                        },
                        {
                            pattern: /<!-- @style-ltie8 (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return "<!--[if lt IE 8]>\n<style>\n" + grunt.file.read('../deploy/' + p1) + "</style>\n<![endif]-->";
                            }
                        },
                        {
                            pattern: /<!-- @settings (.*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return project_settings[p1];
                            }
                        },
                        {
                            pattern: /\<\<(.*?)\>\>/ig,
                            replacement: function (match, p1, offset, string) {
                                return project_settings[p1];
                            }
                        }
                    ]
                }
            },
            css: {
                files: {
                    '../deploy/assets/css/style.css' : '../deploy/assets/css/style.css'
                },
                options: {
                    replacements: [
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
