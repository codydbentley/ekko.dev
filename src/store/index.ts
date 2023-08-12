import { createStore } from 'vuex'
import { markRaw } from 'vue'
import { System, Application } from '@/ekko'

const state: System = {
  apps: []
}

const mutations = {
  exec(state: System, app: Application) {
    state.apps.push(markRaw(app))
  },
  term(state: System, appId: string) {
    state.apps = state.apps.filter(app => {
      if (app.id !== appId) {
        return true
      }
    })
  }
}

const actions = {}

export default createStore({
  state,
  mutations,
  actions,
  modules: {}
})
