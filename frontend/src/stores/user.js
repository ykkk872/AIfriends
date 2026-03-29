import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'access'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref(
    typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) || '' : '',
  )
  const id = ref(null)
  const username = ref('')
  const profile = ref('')
  const photo = ref('')

  const isLoggedIn = computed(() => Boolean(accessToken.value))

  function setAccessToken(token) {
    accessToken.value = token || ''
    if (typeof localStorage !== 'undefined') {
      if (token) localStorage.setItem(STORAGE_KEY, token)
      else localStorage.removeItem(STORAGE_KEY)
    }
  }

  function setUserInfo(data) {
    if (!data || typeof data !== 'object') return
    if (data.access) setAccessToken(data.access)
    if (data.user_id != null) id.value = data.user_id
    else if (data.id != null) id.value = data.id
    if (data.username != null) username.value = data.username
    if (data.profile != null) profile.value = data.profile
    if (data.photo != null) photo.value = data.photo
  }

  function logout() {
    setAccessToken('')
    id.value = null
    username.value = ''
    profile.value = ''
    photo.value = ''
  }

  return {
    accessToken,
    id,
    username,
    profile,
    photo,
    isLoggedIn,
    setAccessToken,
    setUserInfo,
    logout,
  }
})
