import * as APIUtil from '../util/api_util'
import {
  RECEIVE_GRAPH,
  FETCH_GRAPH,
  UPDATE_GRAPH,
  LOGIN,
  LOGOUT,
  RECEIVE_CURRENT_USER } from './mutation_types'

export default {
  [LOGIN] ({ commit }, { user }) {
    return APIUtil.login(user).then(
      user => console.log(user)
    )
  },
  [LOGOUT] ({ commit }) {
    return APIUtil.logout().then(
      () => commit(RECEIVE_CURRENT_USER, { user: null })
    )
  },
  [FETCH_GRAPH] ({ commit, state }) {
    return APIUtil.fetchGraph(state.currentUser.id).then(
      graphStr => commit(RECEIVE_GRAPH, { graphJSON: JSON.parse(graphStr) })
    )
  },
  [UPDATE_GRAPH] ({ commit }, { graphStr }) {
    return APIUtil.updateGraph(graphStr).then(
      graphStr => commit(RECEIVE_GRAPH, { graphJSON: JSON.parse(graphStr) })
    )
  }
}
