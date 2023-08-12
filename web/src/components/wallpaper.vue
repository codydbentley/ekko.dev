<template>
  <div id="wallpaper" style="touch-action: none" @mousemove="move"></div>
</template>

<script>
import { defineComponent } from 'vue'
import * as THREE from 'three'

const vertexShader = `attribute float scale;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = scale * ( 300.0 / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}`

const fragmentShader = `uniform vec3 color;
void main() {
  if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
  gl_FragColor = vec4( color, 1.0 );
}`

export default defineComponent({
  name: 'wallpaper',
  setup() {
    return {
      viewport: null,
      camera: new THREE.PerspectiveCamera(120, 16 / 9, 1, 10000),
      scene: null,
      renderer: null,
      particles: 0,
      count: 0,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: 0,
      windowHalfY: 0,
      controls: {
        visible: false,
        playing: true,
        particles: {
          sep: 40,
          amtX: 130,
          amtY: 40
        },
        fx: {
          speed: 0.1,
          mxf: 0.25, // move freq x
          myf: 0.5, // move freq y
          mxa: 35, // move amplitude x
          mya: 40, // move amplitude y
          sxf: 0.35, // scale freq x
          syf: 0.3, // scale freq y
          sxa: 1, // scale amplitude x
          sya: 1 // scale amplitude y
        }
      },
      camControl: {
        rangeX: 100,
        rangeY: 150,
        shiftX: 0,
        shiftY: 0
      }
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init() {
      this.viewport = document.getElementById('wallpaper')
      this.windowHalfX = this.viewport.clientWidth / 2
      this.windowHalfY = this.viewport.clientHeight / 2
      this.camera = new THREE.PerspectiveCamera(120, this.viewport.clientWidth / this.viewport.clientHeight, 1, 10000)
      this.camera.position.z = 900
      this.scene = new THREE.Scene()
      const numParticles = this.controls.particles.amtX * this.controls.particles.amtY
      const positions = new Float32Array(numParticles * 3)
      const scales = new Float32Array(numParticles)
      let i = 0
      let j = 0
      for (let ix = 0; ix < this.controls.particles.amtX; ix++) {
        for (let iy = 0; iy < this.controls.particles.amtY; iy++) {
          positions[i] =
            ix * this.controls.particles.sep - (this.controls.particles.amtX * this.controls.particles.sep) / 2 // x
          positions[i + 1] = 0 // y
          positions[i + 2] =
            iy * this.controls.particles.sep - (this.controls.particles.amtY * this.controls.particles.sep) / 2 // z
          scales[j] = 1
          i += 3
          j++
        }
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x58cced) }
        },
        vertexShader,
        fragmentShader
      })
      this.particles = new THREE.Points(geometry, material)
      this.scene.add(this.particles)
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight)
      this.renderer.setClearColor(0x0f0f0f, 1)
      this.viewport.appendChild(this.renderer.domElement)
      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      this.camera.aspect = this.viewport.clientWidth / this.viewport.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.viewport.clientWidth, this.viewport.clientHeight)
    },
    animate() {
      this.controls.playing = true
      this.animationId = requestAnimationFrame(this.animate)
      this.render()
    },
    render() {
      this.camera.position.x = this.camControl.shiftX
      this.camera.position.y = this.camControl.shiftY
      this.camera.lookAt(this.scene.position)
      const positions = this.particles.geometry.attributes.position.array
      const scales = this.particles.geometry.attributes.scale.array
      let i = 0
      let j = 0
      for (let ix = 0; ix < this.controls.particles.amtX; ix++) {
        for (let iy = 0; iy < this.controls.particles.amtY; iy++) {
          positions[i + 1] =
            Math.sin((ix + this.count) * this.controls.fx.mxf) * this.controls.fx.mxa +
            Math.sin((iy + this.count) * this.controls.fx.myf) * this.controls.fx.mya
          scales[j] =
            (Math.sin((ix + this.count) * this.controls.fx.sxf) + 0.5) * this.controls.fx.sxa +
            (Math.sin((iy + this.count) * this.controls.fx.syf) + 0.5) * this.controls.fx.sya
          i += 3
          j++
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true
      this.particles.geometry.attributes.scale.needsUpdate = true
      this.renderer.render(this.scene, this.camera)
      this.count += this.controls.fx.speed
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onWindowResize, false)
    },
    stopPlayback() {
      cancelAnimationFrame(this.animationId)
      this.controls.playing = false
    },
    toggleControls() {
      this.controls.visible = !this.controls.visible
    },
    move(ev) {
      this.camControl.shiftX = this.camShift(ev.clientX - this.windowHalfX, this.windowHalfX, this.camControl.rangeX)
      this.camControl.shiftY = -this.camShift(ev.clientY - this.windowHalfY, this.windowHalfY, this.camControl.rangeY)
    },
    camShift(val, valRange, shiftRange) {
      return (shiftRange * ((val - -valRange) / (valRange - -valRange)) - shiftRange / 2) * 2
    }
  }
})
</script>

<style lang="scss" scoped>
@import './../assets/variables';

#wallpaper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
</style>
