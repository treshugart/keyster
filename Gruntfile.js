module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    connect: {
      tests: {}
    },
    ghoul: {
      tests: {
        urls: ['http://localhost:8000/tests/index.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-ghoul');

  grunt.registerTask('test', ['connect', 'ghoul']);
  grunt.registerTask('default', ['test']);
};