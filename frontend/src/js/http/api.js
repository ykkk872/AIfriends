/**
 * Axios 封装：统一加 Access Token、401 时用 Refresh Token 静默续期并重试原请求。
 *
 * 流程概览：
 * 1. 发请求前：若 Pinia 里有 accessToken，自动带上 `Authorization: Bearer ...`。
 * 2. 若接口返回 401：认为 access 已过期（或无效），用 Cookie 里的 refresh 调后端换新 access。
 * 3. 刷新成功：把新 access 写入 store，通知所有「正在排队等刷新」的请求用新 token 重放。
 * 4. 刷新失败：认为 refresh 也失效，执行 logout 清内存登录态；各请求按失败处理。
 *
 * 为何用「队列」：同一时刻可能多个请求同时 401，只允许发起一次 refresh，其余请求
 * 等刷新结束后再统一重试，避免并发打爆刷新接口。
 */

import axios from 'axios'
import { useUserStore } from '@/stores/user.js'

/** 与 Django 开发服务器一致；生产可改为 import.meta.env.VITE_API_BASE_URL */
const BASE_URL = 'http://127.0.0.1:8000'

// 用 axios.create 生成了名为 api 的 axios 实例，并写上默认配置，并在最后一行export
const api = axios.create({
  baseURL: BASE_URL,
  /** 跨域时把 Cookie（含 refresh_token）带给后端，刷新接口依赖 Cookie */
  withCredentials: true,
})

/** ---------- 请求拦截：自动挂 Bearer Access Token ---------- */
api.interceptors.request.use((config) => {
  const user = useUserStore()
  if (user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`
  }
  return config
})

/** 是否正在请求刷新接口（同一时间只允许一条刷新在飞） */
let isRefreshing = false

/**
 * 刷新完成后要执行的回调队列。
 * 每个因 401 被挂起的请求会往这里 push 一个 (token, err) => void，
 * 刷新成功传新 token，失败传 error。
 */
let refreshSubscribers = []

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback)
}

/** 刷新成功：把新 access 分发给所有挂起请求，并清空队列 */
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

/** 刷新失败：通知所有挂起请求失败，清空队列（通常随后会 logout） */
function onRefreshFailed(err) {
  refreshSubscribers.forEach((cb) => cb(null, err))
  refreshSubscribers = []
}

/** ---------- 响应拦截：401 → 尝试刷新 → 重试原请求 ---------- */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const user = useUserStore()
    const originalRequest = error?.config

    /** 网络错误、无 config 等，直接抛出 */
    if (!originalRequest) {
      return Promise.reject(error)
    }

    /**
     * 仅处理：HTTP 401，且本条请求还没重试过。
     * _retry 防止无限循环：重放后若仍 401，不再走刷新逻辑。
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      return new Promise((resolve, reject) => {
        /** 无论是否由本实例发起刷新，都先登记「刷新结束后我该干什么」 */
        subscribeTokenRefresh((token, refreshError) => {
          if (refreshError) {
            reject(refreshError)
          } else {
            originalRequest.headers.Authorization = `Bearer ${token}`
            /** 用更新后的 Authorization 重放原请求（仍走 api 实例，会再走请求拦截） */
            resolve(api(originalRequest))
          }
        })

        /** 只有第一个 401 负责真正调刷新接口，其余只排队等结果 */
        if (!isRefreshing) {
          isRefreshing = true
          axios
            .post(
              `${BASE_URL}/api/user/account/refresh_token/`,
              {},
              {
                withCredentials: true,
                timeout: 5000,
              },
            )
            .then((res) => {
              user.setAccessToken(res.data.access)
              onRefreshed(res.data.access)
            })
            .catch((err) => {
              user.logout()
              onRefreshFailed(err)
              reject(err)
            })
            .finally(() => {
              isRefreshing = false
            })
        }
      })
    }

    return Promise.reject(error)
  },
)

export default api
