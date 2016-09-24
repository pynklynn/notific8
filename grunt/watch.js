/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  sass: {
    files: [
      'src/sass/*.scss',
      'modules/**/sass/*.scss',
    ],
    tasks: [
      'clean:css',
      'sass',
      'cssmin',
      'copy:css',
      'replace:maps'
    ],
    options: {
      spawn: false
    }
  },
  coffee: {
    files: [
      'src/coffee/*.coffee',
      'modules/**/coffee/*.coffee'
    ],
    tasks: [
      'clean:js',
      'clean:karma',
      'coffee',
      'uglify',
      'copy:js',
      'replace:maps',
      'karma:unit'
    ],
    options: {
      spawn: false
    }
  },
  pug: {
    files: [
      'src/pug/**/*.pug'
    ],
    tasks: ['pug'],
    options: {
      spawn: false
    }
  },
  spec: {
    files: [
      'spec/**/*.coffee',
      'modules/**/spec/*.coffee'
    ],
    tasks: [
      'clean:spec',
      'clean:karma',
      'coffee:spec',
      'karma:unit'
    ],
    options: {
      spawn: false
    }
  }
};
