// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  data: function () {
    return window.motionViewerConfig ? window.motionViewerConfig : {
      liveStream: 'live/',
      motionPrefix: 'motion/',
      spriteFrames: 50
    }
  },
  template: '<App :liveStream="liveStream" :motionPrefix="motionPrefix" :spriteFrames="spriteFrames" />'
})
