<template>
<video class="motion-video" preload="none" :poster="poster" :controls="controls" :style="[styleSize, stylePos]" @click="play" @ended="ended" @mousemove="slide" @touchmove="slide" @mouseleave="reset">
  <source :src="mp4" type="video/mp4">
</video>
</template>

<script>
export default {
  props: ['baseName', 'spriteFrames'],
  data: function () {
    const baseName = this.baseName
    const jpg = `${baseName}.jpg`
    return {
      // read-only
      mp4: `${baseName}.mp4`,
      jpg: jpg,
      sprite: `${baseName}-sprite.jpg`,
      // read-write
      poster: jpg,
      controls: false,
      preview: false,
      styleSize: null,
      stylePos: null
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.reset)
  },
  mounted () {
    window.addEventListener('resize', this.reset)
  },
  methods: {
    play: function (event) {
      if (this.controls) return
      this.reset()
      event.currentTarget.play()
      this.controls = true
    },
    ended: function (event) {
      event.currentTarget.load()
      this.controls = false
    },
    slide: function (event) {
      if (this.controls) return
      const rect = event.target.getBoundingClientRect()
      const clientX = event.touches ? event.touches[0].clientX : event.clientX
      const left = clientX - rect.left
      const width = rect.right - rect.left
      let percent = left / width
      if (percent >= 0.99) percent = 0.99
      if (!this.preview) {
        if (percent < 0.2) {
          this.preview = true
          this.poster = this.sprite
          const height = rect.bottom - rect.top
          this.styleSize = {
            width: `${width}px`,
            height: `${height}px`
          }
        }
      } else {
        this.stylePos = {
          'object-position': `-${Math.floor(percent * this.spriteFrames) * width}px`
        }
      }
    },
    reset: function () {
      if (this.controls) return
      this.preview = false
      this.poster = this.jpg
      this.styleSize = null
      this.stylePos = null
    }
  }
}
</script>

<style>
video.motion-video {
  background-color: black;
  object-fit: cover;
}
</style>
