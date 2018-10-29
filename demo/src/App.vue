<template>
  <div id="app">
    <h1>Notific8 Demo</h1>
    <button @click="openNotification">Open notification</button>
  </div>
</template>

<script>

import { Notific8 } from 'notific8';

export default {
  name: 'app',
  components: {},
  data() {
    return {}
  },
  methods: {
    openNotification() {
      Notific8.create('Hello, world!', { 
        sticky: true,
        // theme: 'materialish',
        // theme: 'chicchat',
        theme: 'atomic',
        // themeColor: 'purple-rain',
        // themeColor: 'honey',
        themeColor: 'cerulean',
        title: 'Test Notification'

      }).then((notification) => {
        notification.open();
        console.log('notification', notification);
      });
    }
  }
}
</script>

<style lang="scss">
// this is how to import from a node module
@import "~notific8/src/sass/notific8";
</style>
