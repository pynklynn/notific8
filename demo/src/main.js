/**
 * @license
 * Copyright (c) 2013-2019 Pynk Lynn, LLC
 * This code may only be used under the MIT style license found at
 * https://github.com/pynklynn/notific8/blob/master/LICENSE
 */

import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#notific8-demo');
