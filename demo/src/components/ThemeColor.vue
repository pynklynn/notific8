<!--
/**
 * @license
 * Copyright (c) 2013-2019 Pynk Lynn, LLC
 * This code may only be used under the MIT style license found at
 * https://github.com/pynklynn/notific8/blob/master/LICENSE
 */
-->

<template>
  <div id="theme-color-cmp">
    <label for="notific8-theme-color">Theme color: </label>
    <select name="notific8ThemeColor" v-model="notific8ThemeColor" id="notific8-theme-color" @change="$emit('notific8-theme-color', notific8ThemeColor)">
      <option v-for="color in notific8ThemeColors" :value="color" :key="color">{{color}}</option>
    </select>
  </div>
</template>

<script>
const colorThemes = {
  atomic: [ 'cerulean', 'tomato', 'mustard', 'pear', 'amethyst', 'onyx' ],
  chicchat: [ 'cobalt','ruby','honey','shamrock' ],
  materialish: [ 'twilight', 'lilrobot', 'cupcake', 'eclair', 'honeycomb', 'lollypop', 'marshmallow', 'strawberry', 'creamsicle', 'purple-rain', 'peafowl' ],
  ocho: [ 'teal', 'amethyst', 'ruby', 'tangerine', 'lemon', 'lime', 'ebony', 'smoke' ]
};

export default {
  name: 'theme-color-cmp',
  data() {
    return {
      notific8ThemeColors: [],
      notific8ThemeColor: ''
    }
  },
  props: [ 'theme' ],
  watch: {
    theme(newVal) {
      this.notific8ThemeColors = colorThemes[newVal];
      this.notific8ThemeColor = this.notific8ThemeColors[0];
    }
  },
  created() {
    this.notific8ThemeColors = colorThemes[this.theme];
    this.notific8ThemeColor = this.notific8ThemeColors[0];
  }
}
</script>
