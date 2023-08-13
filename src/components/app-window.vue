<template>
  <div ref="windowRef" :class="windowClass" :style="windowStyle">
    <div class="app-title-bar" @mousedown.self.prevent="drag">
      <div class="app-title" @mousedown.self.prevent="drag">
        <i :class="[options.icon, 'fa-fw', 'app-icon']" />
        {{ options.title }}
      </div>
      <div class="app-controls">
        <!--        <span class="control" @click.prevent="minimize"><i class="far fa-fw fa-window-minimize"></i></span>-->
        <!--        <span class="control" @click.prevent="maximize"><i class="far fa-fw fa-window-maximize"></i></span>-->
        <span class="control" @click.prevent="exit"><i class="far fa-fw fa-window-close"></i></span>
      </div>
    </div>
    <div class="app-content">
      <slot />
    </div>
    <div class="app-resize" v-if="options.resizable" @mousedown.prevent="resize">
      <i class="fas fa-caret-right"></i>
    </div>
  </div>
  <div
    ref="screen"
    class="screen"
    :style="{ 'z-index': window.moving || window.resizing ? 1000 : -1000 }"
    @mousemove="move"
    @mouseup="release"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, onMounted, PropType } from 'vue'
import { WindowOptions } from '@/ekko'

export default defineComponent({
  name: 'AppWindow',
  props: {
    options: {
      type: Object as PropType<WindowOptions>,
      required: true
    }
  },
  setup(props, { emit }) {
    // refs
    const windowRef = ref<HTMLDivElement>(document.createElement('div'))
    const screen = ref<HTMLDivElement>(document.createElement('div'))
    // state
    const window = reactive({
      posX: 0,
      posY: 0,
      width: props.options.width,
      height: props.options.height,
      moving: false,
      resizing: false,
      originX: 0,
      originY: 0,
      originWidth: 0,
      originHeight: 0,
      evX: 0,
      evY: 0,
      minimized: false,
      maximized: false
    })
    // computed
    const windowClass = computed(() => ({
      'app-window': true,
      maximized: window.maximized,
      minimized: window.minimized
    }))
    const windowStyle = computed(() => ({
      top: window.posY + 'px',
      left: window.posX + 'px',
      width: window.width + 'px',
      height: window.height + 'px'
    }))
    // methods
    const minimize = () => {
      console.log('minimize')
      window.minimized = !window.minimized
    }
    const maximize = () => {
      console.log('maximize')
      window.maximized = !window.maximized
    }
    const exit = () => {
      console.log('exit')
      emit('exit')
    }
    const drag = (ev: MouseEvent): void => {
      window.moving = true
      window.evX = ev.clientX
      window.evY = ev.clientY
      window.originX = window.posX
      window.originY = window.posY
    }
    const resize = (ev: MouseEvent): void => {
      window.resizing = true
      window.evX = ev.clientX
      window.evY = ev.clientY
      window.originWidth = windowRef.value.clientWidth
      window.originHeight = windowRef.value.clientHeight
    }
    const move = (ev: MouseEvent): void => {
      if (window.moving) {
        window.posX = window.originX + ev.clientX - window.evX
        window.posY = window.originY + ev.clientY - window.evY
      }
      if (window.resizing) {
        window.width = window.originWidth + ev.clientX - window.evX
        window.height = window.originHeight + ev.clientY - window.evY
      }
    }
    const release = (): void => {
      window.moving = false
      window.resizing = false
    }
    onMounted(() => {
      window.posX = screen.value.clientWidth / 2 - windowRef.value.clientWidth / 2
      window.posY = screen.value.clientHeight / 2 - windowRef.value.clientHeight / 2
    })
    return {
      window,
      windowClass,
      windowStyle,
      minimize,
      maximize,
      exit,
      drag,
      resize,
      move,
      release,
      windowRef,
      screen
    }
  }
})
</script>

<style lang="scss" scoped>
@import './../assets/variables';

.app-window {
  min-width: 122px;
  min-height: 30px;
  position: absolute;
  border: 1px solid $primary;
  overflow: hidden;
  background: rgba($black, 0.8);
  transition:
    opacity 250ms,
    height 250ms;
  &.maximized {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.minimized {
    position: fixed;
    top: -100px;
    height: 30px;
    opacity: 0;
  }
  .app-title-bar {
    display: flex;
    align-items: center;
    position: relative;
    cursor: grab;
    height: 30px;
    border-bottom: 1px solid $primary;
    background: linear-gradient(to top, rgba($primary, 0.2), rgba(darken($primary, 20%), 0.2));
    .app-title {
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 600;
      max-width: calc(100% - 90px);
    }
    .app-controls {
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      display: flex;
      align-items: center;
      .control {
        cursor: pointer;
        display: inline-block;
        margin-left: 5px;
      }
    }
  }
  .app-resize {
    height: 10px;
    width: 10px;
    cursor: nwse-resize;
    position: absolute;
    bottom: 0;
    right: 0;
    svg {
      transform: rotate(45deg) translateX(1px) translateY(-3px);
    }
  }
}

.screen {
  cursor: grabbing;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
