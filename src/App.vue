<template>
<div id="app">
  <div class="field is-grouped">
    <div class="control">
      <flat-pickr class="input" v-model="date" :config="dateConfig"></flat-pickr>
    </div>
    <div class="control">
      <button class="button is-primary" @click="bottom">Bottom</button>
    </div>
    <div class="control">
      <button class="button is-primary" :class="{'is-loading': isLoading}" @click="update">Update</button>
    </div>
  </div>
  <div class="columns is-mobile is-multiline is-gapless">
    <div v-if="liveStream" class="column is-half-mobile is-one-third-tablet is-one-quarter-desktop">
      <m-jpeg :src="liveStream"></m-jpeg>
    </div>
    <div class="column is-half-mobile is-one-third-tablet is-one-quarter-desktop" v-for="video in videos[date]" :key="video.baseName">
      <motion-video :baseName="video.baseName" :spriteFrames="spriteFrames"></motion-video>
    </div>
  </div>
  <div class="field is-grouped">
    <div class="control">
      <flat-pickr class="input" v-model="date" :config="dateConfig"></flat-pickr>
    </div>
    <div class="control">
      <button class="button is-primary" @click="top">Top</button>
    </div>
    <div class="control">
      <button class="button is-primary" :class="{'is-loading': isLoading}" @click="update">Update</button>
    </div>
  </div>
</div>
</template>

<script>
import MJpeg from './components/MJpeg.vue'
import MotionVideo from './components/MotionVideo.vue'
import axios from 'axios'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import {getDate} from './utils'

export default {
  name: 'App',
  components: {
    MJpeg,
    MotionVideo,
    flatPickr
  },
  props: ['liveStream', 'motionPrefix', 'spriteFrames'],
  data: function () {
    return {
      isLoading: false,
      videos: {},
      date: getDate(new Date()),
      dateConfig: {}
    }
  },
  watch: {
    date: function () {
      this.update(false)
    }
  },
  methods: {
    update: function (force = true) {
      if (!force && this.videos[this.date]) return
      this.isLoading = true
      axios.get(`${this.motionPrefix}${this.date}/`).then(response => {
        this.isLoading = false
        this.videos[this.date] = response.data.filter(file => {
          return file.name.endsWith('.jpg') && !file.name.endsWith('-sprite.jpg')
        }).map(file => {
          const baseName = `${this.motionPrefix}${this.date}/${file.name.replace(/\.jpg$/, '')}`
          return {
            baseName: baseName
          }
        })
      }).catch(() => {
        this.isLoading = false
      })
    },
    updateDateRange: function () {
      axios.get(`${this.motionPrefix}`).then(response => {
        const dirs = response.data.filter(file => {
          return file.type === 'directory'
        })
        if (dirs.length > 0) {
          const minDate = dirs[0].name
          const maxDate = dirs[dirs.length - 1].name
          this.$set(this.dateConfig, 'minDate', minDate)
          this.$set(this.dateConfig, 'maxDate', maxDate)
        }
      })
    },
    bottom: function () {
      window.scrollTo(0, document.body.scrollHeight)
    },
    top: function () {
      window.scrollTo(0, 0)
    }
  },
  created: function () {
    this.update()
    this.updateDateRange()
  }
}
</script>

<style lang="sass">
@import '~bulma/bulma'
</style>
