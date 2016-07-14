module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      watch:{
        options: {
          livereload: true,
        },

        script:{
          files:['src/es6/*.es6'],
          tasks:['browserify']
        },
        html:{
          files:['src/index.html'],
          tasks:['copy:html']
        },

        sass:{
          files:['src/sass/*.scss'],
          tasks:['sass']
        },
      },

      connect: {
        server: {
          options: {
            base: 'build'
          }
        }
      },

      copy: {

        libraries:{
          expand: true,
          cwd: 'bower_components/EaselJS/lib',
          src: 'easeljs-0.8.2.min.js',
          dest: 'build/lib/',
        },

        html:{
          expand: true,
          cwd: 'src/',
          src: 'index.html',
          dest: 'build/',
        },
      },
      browserify: {
        options: {
          browserifyOptions: {
            debug: true
          },
          debug: true,
          transform: [
            ["babelify", {
                 presets: 'es2015',
            }]
          ]
        },
        app: {
          src: 'src/es6/main.es6',
          dest: 'build/js/main.js'
        }
      },

      sass: {
        dist: {
          files: {
            'build/css/style.css': 'src/sass/style.scss'
          }
        }
      },

      uglify: {
        dist: {
          files: {
            'build/js/main.js': ['build/js/main.js']
          }
        }
      }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default',['sass','copy','browserify']);
    grunt.registerTask('build',['sass','copy','browserify','uglify']);
    grunt.registerTask('server',['default','connect','watch']);


};
