import axios from 'axios'
import { useUserStore } from '@/stores/user.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const user = useUserStore()
  if (user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

export default api
