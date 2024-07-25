import { apiUrl, type Dic } from '@/lib'
import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { pass } from '@/lib'

interface stateType {
  alert: string | null
  loading: boolean
  token: string | null
  user: Dic | null
  settings: Dic
  returnUrl: string | null
  awating: boolean
}

const getLocalItem = (key: string, isJson: boolean = false) => {
  const value = localStorage.getItem(key) || null

  if (value) {
    if (isJson) {
      return JSON.parse(value)
    }

    return value
  }
  return false
}

const defaultState: stateType = {
  alert: null,
  loading: true,
  token: getLocalItem('miy-ghost-token') || null,
  user: null,
  settings: getLocalItem('miy-ghost-music-settings', true) || { sidebar: '4em' },
  returnUrl: null,
  awating: false
}

console.log(defaultState, 'default state')

export const useStore = defineStore('store', () => {
  const state = reactive(defaultState)

  function setToken(token: string) {
    state.token = token
    localStorage.setItem('miy-ghost-token', token)
  }

  function setUser(user: Dic) {
    state.user = user
  }

  function resetAuth() {
    state.user = null
    state.token = null
    localStorage.removeItem('miy-ghost-token')
  }

  function sidebar(open: string) {
    state.settings = { ...state.settings, sidebar: open }
    localStorage.setItem('miy-ghost-music-settings', JSON.stringify(state.settings))
  }

  async function verifyUser() {
    try {
      const call = await fetch(`${apiUrl}/user/verify`, {
        headers: { Authorization: state.token ?? '' }
      })
      const response = await call.json()
      if (pass(call) && response?.user) {
        setUser(response.user)
        return true
      }

      throw 'Invalid token'
    } catch (e) {
      return false
    }
  }

  return {
    setToken,
    verifyUser,
    sidebar,
    setUser,
    resetAuth,
    state
  }
})
