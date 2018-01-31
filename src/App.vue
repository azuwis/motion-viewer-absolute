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
    <div class="column is-half-mobile is-one-third-tablet is-one-quarter-desktop">
      <m-jpeg :src="liveStream"></m-jpeg>
    </div>
    <div class="column is-half-mobile is-one-third-tablet is-one-quarter-desktop" v-for="video in videosFiltered" :key="video.baseName">
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
      videos: [],
      date: getDate(new Date())
    }
  },
  computed: {
    videosFiltered: function () {
      const date = this.date ? new Date(`${this.date} 00:00:00`) : new Date(0)
      return this.videos.filter(video => {
        return video.date >= date && video.date <= date.fp_incr(1)
      })
    },
    dateConfig: function () {
      let minDate = null
      let maxDate = null
      if (this.videos.length > 0) {
        minDate = getDate(this.videos[0].date)
        maxDate = getDate(this.videos[this.videos.length - 1].date)
      }
      return {
        minDate: minDate,
        maxDate: maxDate
      }
    }
  },
  methods: {
    update: function () {
      this.isLoading = true
      axios.get(this.motionPrefix).then(response => {
        this.isLoading = false
        this.videos = response.data.filter(file => {
          return file.name.endsWith('.jpg') && !file.name.endsWith('-sprite.jpg')
        }).map(file => {
          const m = file.name.match(/^(\d{4})-(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})\./)
          const date = new Date(`${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`)
          const baseName = this.motionPrefix + file.name.replace(/\.jpg$/, '')
          return {
            baseName: baseName,
            date: date
          }
        })
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
  }
}
</script>

<style lang="sass">
@import '~bulma/bulma'
</style>
