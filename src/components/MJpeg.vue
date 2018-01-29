<template>
<img ref="img" :src="url" @click="toggle" v-observe-visibility="imgVisibilityChanged">
</template>

<script>
import {ObserveVisibility} from 'vue-observe-visibility'

export default {
  name: 'MJpeg',
  props: ['src'],
  directives: {
    ObserveVisibility
  },
  data: function () {
    return {
      url: this.src,
      visible: true,
      play: true
    }
  },
  beforeDestroy: function () {
    document.removeEventListener('visibilitychange', this.docVisibilityChanged)
  },
  mounted () {
    document.addEventListener('visibilitychange', this.docVisibilityChanged)
  },
  methods: {
    docVisibilityChanged: function () {
      if (document.hidden) {
        this.pause()
      } else if (this.visible) {
        this.resume()
      }
    },
    imgVisibilityChanged: function (visible, entry) {
      this.visible = visible
      if (visible) {
        this.resume()
      } else {
        this.pause()
      }
    },
    toggle: function () {
      if (this.play) {
        this.pause()
      } else {
        this.resume()
      }
    },
    pause: function () {
      if (!this.play) return
      const img = this.$refs.img
      const canvas = document.createElement('canvas')
      let width = img.naturalWidth
      let height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (width) {
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0)
      } else {
        width = 640
        height = 480
        canvas.width = width
        canvas.height = height
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height)
      }
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.moveTo(width / 2 - 40, height / 2 - 50)
      ctx.lineTo(width / 2 - 40, height / 2 + 50)
      ctx.lineTo(width / 2 + 40, height / 2)
      ctx.fill()
      this.url = canvas.toDataURL('image/png')
      this.play = false
    },
    resume: function () {
      if (this.play) return
      const img = this.$refs.img
      const canvas = document.createElement('canvas')
      let width = img.naturalWidth
      let height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0)
      ctx.fillStyle = '#555'
      ctx.beginPath()
      ctx.moveTo(width / 2 - 30, height / 2 - 30)
      ctx.lineTo(width / 2 - 30, height / 2 + 30)
      ctx.lineTo(width / 2 + 20, height / 2)
      ctx.fill()
      this.url = canvas.toDataURL('image/png')
      setTimeout(() => {
        this.url = this.src
      }, 50)
      this.play = true
    }
  }
}
</script>
