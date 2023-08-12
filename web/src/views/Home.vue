<template>
  <Wallpaper />
  <AppWindow v-for="(app, idx) in apps" :options="app.window" :key="idx" @exit="terminate(app.id)">
    <component :is="app.component" />
  </AppWindow>
  <!--  <Taskbar />-->
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Wallpaper from '@/components/wallpaper.vue'
import AppWindow from '@/components/app-window.vue'
import { WelcomeApp } from '@/components/apps'
import Taskbar from '@/components/taskbar.vue'

export default defineComponent({
  name: 'Home',
  components: { Taskbar, Wallpaper, AppWindow },
  setup() {
    const store = useStore()
    const terminate = (appId: string) => {
      store.commit('term', appId)
    }
    onMounted(() => {
      store.commit('exec', WelcomeApp)
    })
    return {
      apps: computed(() => store.state.apps),
      terminate
    }
  }
})
</script>

<style></style>
