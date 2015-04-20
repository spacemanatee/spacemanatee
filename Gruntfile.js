module.exports = function(grunt){

  grunt.initConfig({
    clean: ['client/dist/'],

    jshint: {
      files: ['Gruntfile.js', 'client/app/*.js']
    },
    //'Gruntfile.js', 'client/app/*.js', 'server/**/*.js', 'test/**/*.js'
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['client/app/**/*.js'],
        dest: 'client/dist/built.js'
      }
    },

    uglify: {
      target: {
        files: {
          'client/dist/built.min.js': ['client/dist/built.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('lint', [
    'jshint'
  ]);

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concat',
    'uglify'
  ])

};