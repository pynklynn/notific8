<template>
  <div id="app">
    <h1>Notific8 Demo</h1>
    <p>Thanks for giving Notific8 a try! The demo below allows you to try out most options for the library. While the library uses Promises when opening and closing notifications, the demo will automatically handle those.</p>
    <p>Notific8 version 5 was rebuilt from the ground up to be a library for the modern JavaScript world. This demo is built using Vue. Check out the source code for this demo for an example of how the library can be used within another library or framework.</p>

    <div>
      <label for="notific8-message">Notification message: </label>
      <input type="text" id="notific8-message" v-model="notific8Message">
    </div>

    <div>
      <label for="notific8-message">Notification title: </label>
      <input type="text" id="notific8-title" v-model="notific8Title">
    </div>

    <div>
      <span>Horizontal edge: </span>
      <label for="notific8-horizontal-edge-top">
        <input type="radio" id="notific8-horizontal-edge-top" name="notific8HorizontalEdge" value="top" v-model="notific8HorizontalEdge">
        Top
      </label>
      <label for="notific8-horizontal-edge-bottom">
        <input type="radio" id="notific8-horizontal-edge-bottom" name="notific8HorizontalEdge" value="bottom" v-model="notific8HorizontalEdge">
        Bottom
      </label>
    </div>

    <div>
      <span>Vertical edge: </span>
      <label for="notific8-vertical-edge-top">
        <input type="radio" id="notific8-vertical-edge-top" name="notific8VerticalEdge" value="left" v-model="notific8VerticalEdge">
        Left
      </label>
      <label for="notific8-vertical-edge-bottom">
        <input type="radio" id="notific8-vertical-edge-bottom" name="notific8VerticalEdge" value="right" v-model="notific8VerticalEdge">
        Right
      </label>
    </div>

    <div>
      <label for="notific8Theme">Theme: </label>
      <select name="notific8Theme" id="notific8-theme" v-model="notific8Theme" @change="themeChanged()">
        <option value="ocho">Ocho</option>
        <option value="atomic">Atomic</option>
        <option value="chicchat">ChicChat</option>
        <option value="materialish">Materialish</option>
      </select>
    </div>

    <theme-color :theme="notific8Theme" @notific8-theme-color="notific8ThemeColor = $event"></theme-color>

    <div>
      <label for="notific8-life">Life: </label>
      <input type="number" id="notific8-life" v-model="notific8Life">
    </div>

    <div>
      <label for="notifi8-sticky">
        Sticky
        <input type="checkbox" v-model="notific8Sticky" id="notific8-sticky">
      </label>
    </div>

    <div>
      <label for="notific8-z-index">Z-index: </label>
      <input type="number" id="notific8-z-index" v-model="notific8ZIndex">
    </div>

    <div>
      <label for="notific8-id">ID: </label>
      <input type="text" v-model="notific8Id" id="notific8-id">
    </div>

    <div>
      <label for="notific8-close-help-text">Close help text: </label>
      <input type="text" v-model="notific8CloseHelpText" id="notific8-close-help-text">
    </div>

    <div>
      <label for="notific8-image-url">Image URL: </label>
      <input type="text" v-model="notific8ImageUrl" id="notific8-image-url">
    </div>

    <div>
      <label for="notific8-image-alt-text">Image alt text: </label>
      <input type="text" v-model="notific8ImageAltText" id="notific8-image-alt-text">
    </div>

    <div>
      <span>Action buttons: </span>
      <label for="notific8-action-close">
        <input type="checkbox" v-model="notific8ActionButtonClose" id="notific8-action-close"> Close (auto configured)
      </label>
      <label for="notific8-action-hello">
        <input type="checkbox" v-model="notific8ActionButtonHello" id="notific8-action-hello"> Hello alert
      </label>
    </div>

    <div>
      <label for="notific8-queue-notification">
        <input type="checkbox" v-model="notific8QueueNotification" id="notific8-queue-notification"> Queue notification (automatically opens when triggered)
      </label>
    </div>

    <button @click="openNotification">Open notification</button>
  </div>
</template>

<script>

import ThemeColor from './components/ThemeColor';
import { Notific8 } from 'notific8';

export default {
  name: 'app',
  components: {
    ThemeColor
  },
  data() {
    return {
      notific8Message: 'Hello, world!',
      notific8Title: '',
      notific8HorizontalEdge: 'top',
      notific8VerticalEdge: 'right',
      notific8Theme: 'ocho',
      notific8ThemeColor: 'teal',
      notific8Life: 10000,
      notific8Sticky: false,
      notific8ZIndex: 1100,
      notific8Id: '',
      notific8CloseHelpText: 'close',
      notific8ImageUrl: '',
      notific8ImageAltText: '',
      notific8ActionButtonClose: false,
      notific8ActionButtonHello: false,
      notific8QueueNotification: false,
    }
  },
  methods: {
    openNotification() {
      const notificationOptions = {
        horizontalEdge: this.notific8HorizontalEdge,
        verticalEdge: this.notific8VerticalEdge,
        theme: this.notific8Theme,
        themeColor: this.notific8ThemeColor,
        life: this.notific8Life,
        sticky: this.notific8Sticky,
        zIndex: this.notific8ZIndex,
        id: this.notific8Id,
        closeHelpText: this.notific8CloseHelpText,
        closeResolve() {
          console.log('Notification has been closed.');
        },
        imageUrl: this.notific8ImageUrl,
        imageAltText: this.notific8ImageAltText,
        queue: this.notific8QueueNotification,
      };

      if (this.notific8Title) { notificationOptions.title = this.notific8Title; }

      if (this.notific8ActionButtonClose || this.notific8ActionButtonHello) {
        notificationOptions.actionButtons = [];
        if (this.notific8ActionButtonClose) {
          notificationOptions.actionButtons.push({ buttonText: 'Close' });
        }
        if (this.notific8ActionButtonHello) {
          notificationOptions.actionButtons.push({
            buttonAction() {
              alert('Hello, world!');
            },
            buttonText: 'Hello'
          });
        }
      }

      if (this.notific8QueueNotification) {
        notificationOptions.queueOpenResolve = function() {
          console.log(`Queued notification opened`);
        }
      }

      console.log(notificationOptions);
      Notific8.create(this.notific8Message, notificationOptions).then((notification) => {
        if (
          !notification.notificationOptions.queue ||
          (notification.notificationOptions.queue && !document.querySelectorAll('notific8-notification[open]').length)
        ) {
          notification.open();
        }
        console.log('notification', notification);
      });
    },
    themeChanged() {
      switch(this.notific8Theme) {
        case 'ocho':
          this.notific8ThemeColor = 'teal';
          break;
        case 'atomic':
          this.notific8ThemeColor = 'cerulean';
          break;
        case 'chicchat':
          this.notific8ThemeColor = 'cobalt';
          break;
        case 'materialish':
          this.notific8ThemeColor = 'twilight';
          break;
      }
    }
  }
}
</script>

<style lang="scss">
// this is how to import from a node module
@import "~notific8/src/sass/notific8";
</style>
