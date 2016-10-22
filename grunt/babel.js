/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  options: {
    sourceMap: true,
    presets: [ 'es2015' ]
  },
  build: {
    files: {
      'dist/jquery.notific8.js': 'src/js/jquery.notific8.js',
      'dist/notific8.js': 'src/js/notific8.js'
    }
  }
};
