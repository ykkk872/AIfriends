<script setup>
import {ref} from "vue";
import {useUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";
import api from "@/js/http/api.js";

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const user = useUserStore()
const router = useRouter()

// 当在登陆页面输入账号和密码后，点击登录按钮，会执行handleLogin函数
// 如果账号密码正确，则
// 设置accessToken和用户信息到全局状态(内存，一刷新就没了）
// 并跳转到首页

async function handleLogin() {
  errorMessage.value = '' // 每次点击登录按钮时，清空错误信息
  if (!username.value.trim()) {
    errorMessage.value = '用户名不能为空'
  } else if (!password.value.trim()) {
    errorMessage.value = '密码不能为空'
  } else {
    try {
      const res = await api.post('/api/user/account/login/', { // await 等待api.post请求完成
        username: username.value,
        password: password.value,
      })
      const data = res.data // res.data 是api.post请求返回的响应数据
      if (data.result === 'success') {
        user.setAccessToken(data.access) // 设置accessToken到全局状态
        user.setUserInfo(data) // 设置用户信息到全局状态
        await router.push({ // await 等待router.push请求完成，并跳转到首页
          name: 'homepage-index'
        })
      } else {
        errorMessage.value = data.result // 如果账号密码错误，则显示错误信息
      }
    } catch (err) {
    }
  }
}
</script>

<template>
  <div class="flex justify-center mt-30">
    <form @submit.prevent="handleLogin" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"> <!-- .prevent 防止表单提交时刷新页面 -->
      <label class="label">用户名</label> <!-- 用户名标签 -->
      <input v-model="username" type="text" class="input" placeholder="用户名" /> <!-- 用户名输入框 -->

      <label class="label">密码</label> <!-- 密码标签 -->
      <input v-model="password" type="password" class="input" placeholder="密码" /> <!-- 密码输入框 -->

      <p v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</p> <!-- 只有当有错误信息（密码错误）时，才显示错误信息 -->

      <button class="btn btn-neutral mt-4">登录</button> <!-- 登录按钮 -->
      <div class="flex justify-end"> <!-- 注册按钮 -->
        <RouterLink :to="{name: 'user-account-register-index'}" class="btn btn-sm btn-ghost text-gray-500"> <!-- 注册按钮 -->
          注册 <!-- 注册按钮 -->
        </RouterLink>
      </div>
    </form> <!-- 登录表单 -->
  </div>
</template>

<style scoped>

</style>