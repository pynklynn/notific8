/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

const sass = require('node-sass');

module.exports = {
  dist: {
    options: {
      implementation: sass,
      style: 'compact',
      sourceMap: true
    },
    files: {
      'dist/notific8.css': 'src/sass/notific8.scss'
    }
  }
};
