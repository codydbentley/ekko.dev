import { Application, WindowOptions } from '@/ekko'
import { defineAsyncComponent } from 'vue'

export const WelcomeApp = {
  id: 'welcome',
  window: {
    icon: 'fas fa-comment-dots',
    title: 'Welcome Message',
    resizable: true,
    width: 330,
    height: 185
  } as WindowOptions,
  state: {},
  component: defineAsyncComponent(() => import(/* webpackChunkName: "app-welcome" */ './welcome.vue'))
} as Application
