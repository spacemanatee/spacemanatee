module.exports = function(grunt){

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'client/app/*.js', 'server/**/*.js', 'test/**/*.js']
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['server/**/*.js', 'client/**/*.js'],
        dest: 'dist/built.js'
      }
    },

    uglify: {
      target: {
        files: {
          'dist/built.min.js': ['dist/built.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'jshint',
    'concat',
    'uglify'
  ]);
};