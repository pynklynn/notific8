/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  options: {
    from: 'scss',
    to: 'sass'
  },
  files: {
    cwd: 'src/sass',
    src: [ '*.scss' ],
    dest: 'src/sass-format'
  }
};
