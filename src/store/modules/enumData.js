import { initEnumFilter } from '@/filters/enumFilter'
import api from '@/http'
// import { enumData } from '@/filters/enum'

const state = {
  enumData: {}
}

const mutations = {
  SET_ENUM_DATA: (state, data) => {
    state.enumData = data
  }
}

const actions = {
  getEnumData({ commit }, { url }) {
    return api.get(url).then(data => {
      commit('SET_ENUM_DATA', data)
      initEnumFilter(data)
      return data
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
