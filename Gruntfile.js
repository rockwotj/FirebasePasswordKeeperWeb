module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['js/app.js', 'js/*.js', '!js/*.min.js'],
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'js/*.js', '!js/*.min.js']
    },
    express: {
      all: {
          options: {
              bases: [__dirname],
              port: 8080,
              hostname: "0.0.0.0",
              livereload: true
            }
        }
    },
    watch: {
      scripts: {
        files: ['js/*.js', '!js/*.min.js', 'index.html', 'css/style.css', 'partials/*.html'],
        tasks: ['default'],
        options: {
        },
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'css/<%= pkg.name %>.min.css': ['css/style.css']
        }
      }
    }
  });
  grunt.registerTask('server', ['express', 'watch']);
  grunt.registerTask('default', ['uglify', 'jshint', 'cssmin']);

};
