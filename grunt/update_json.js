/**
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
*/

module.exports = {
  options: {
    src: 'package.json',
    indent: '  '
  },
  bower: {
    src: 'package.json',
    dest: 'bower.json',
    fields: 'version'
  },
  jquery: {
    src: 'package.json',
    dest: 'notific8.jquery.json',
    fields: 'version'
  }
};
