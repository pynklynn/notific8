/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  compile: {
    options: {
      sourceMap: true,
      bare: true
    },
    files: {
      'build/js/jquery.notific8.js': 'src/coffee/jquery.notific8.coffee',
      'build/js/notific8.js': 'src/coffee/notific8.coffee'
    }
  }
};
