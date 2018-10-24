<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <button @click="openNotification">Open notification</button>
  </div>
</template>

<script>

import { Notific8 } from 'notific8';

export default {
  name: 'app',
  components: {},
  data() {
    return {
      title: 'Hello, World!'
    }
  },
  methods: {
    openNotification() {
      console.log('Hello, world!');
      Notific8.create('Hello, world!').then((notification) => {
        notification.open();
        console.log('notification', notification);
      });
    }
  }
}
</script>

<style>
</style>
