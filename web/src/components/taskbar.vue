<template>
  <div id="app-taskbar">
    <div id="app-launcher">eKKo</div>
    <div id="app-window-launcher">
      <div class="app-window-taskbar" v-for="(app, idx) in apps" :key="idx">
        {{ app.window.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Taskbar',
  setup() {
    const store = useStore()
    return {
      apps: computed(() => store.state.apps)
    }
  }
})
</script>

<style lang="scss" scoped>
@import './../assets/variables';

#app-taskbar {
  padding: 0 5px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  border-top: 1px solid $primary;
  display: flex;
  align-items: center;
  justify-content: start;
}
#app-launcher {
  margin-right: 10px;
  height: 30px;
  width: 50px;
  border: 1px solid $primary;
  cursor: pointer;
  font-weight: bold;
  line-height: 30px;
  text-align: center;
  background: linear-gradient(to top, rgba($primary, 0.1), rgba(darken($primary, 30%), 0.1));
}
#app-window-launcher {
  display: flex;
  width: 100%;
  .app-window-taskbar {
    margin-right: 2px;
    width: 100%;
    max-width: 100px;
    height: 30px;
    line-height: 30px;
    border: 1px solid $primary;
    cursor: pointer;
  }
}
</style>
