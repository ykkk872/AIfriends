<script setup>
import NavBar from './components/nvabar/NavBar.vue';
import { useUserStore } from './stores/user'
import { onMounted } from 'vue'
import api from '@/js/http/api.js'
import { useRoute, useRouter } from 'vue-router'

const user = useUserStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const res = await api.get('/api/user/account/get_user_info/')
    const data = res.data
    if (data.result === 'success') { // 如果拉取用户信息成功
      user.setUserInfo(data) // 设置用户信息
      user.setHasPulledUserInfo(true) // 设置是否已经拉取过用户信息
    }
  } catch (error) { // 如果拉取用户信息失败
    // 失败（没登录或 token 全过期）→ 不做任何事，保持未登录
  } finally { // 无论成功失败，最终都会执行finally中的内容
    user.setHasPulledUserInfo(true) // 无论成功失败，标记"已尝试过"

    if (route.meta.needLogin && !user.isLogin()) {
      router.replace({
        name: 'user-account-login-index'
      })
      // 两种写法效果一样，但上面那种写法更通用
      // router.replace({
      //   path: '/user/account/login/'
      // })
    }
  }
})

</script>

<template>
  <NavBar >
    <router-view/>
  </NavBar >
</template>

<style scoped>

</style>
