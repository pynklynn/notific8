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
      'sass'
    ],
    options: {
      spawn: false
    }
  },
  js: {
    files: [
      'src/js/*.js'
    ],
    tasks: [
      'clean:js',
      'clean:karma',
      'babel:build',
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
      'spec/**/*.js'
    ],
    tasks: [
      'clean:karma',
      'karma:unit'
    ],
    options: {
      spawn: false
    }
  }
};
