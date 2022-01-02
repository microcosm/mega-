module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: 'built.gs'
    },
    concat: {
      options: {
        separator: "\n\n/* -------------------------------------------------------------------------- */\n\n"
      },
      files: {
        src: ['gsheet-/**/*.gs', 'gsheet-/*.gs', '*.gs'],
        dest: 'built.gs'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['clean', 'concat']);
};