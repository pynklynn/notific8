/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  less: {
    src: ['src/less/**/*.less'],
    dest: 'src/less/',
    replacements: [{
      from: /~"@notific8-ns"/g,
      to: '@{notific8-ns}'
    }]
  }
};
