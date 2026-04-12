import { defineStore } from 'pinia'
import { ref } from 'vue'

// 实现全局状态
export const useUserStore = defineStore('user', () => {
    const id = ref(0)
    const username = ref('')
    const photo = ref('')
    const profile = ref('')
    const accessToken = ref('')
    const hasPulledUserInfo = ref(false)

    function isLogin() { // 判断是否登陆
        return !!accessToken.value  // 必须带value!!!!!!!!!
    }

    function setAccessToken(token) {
        accessToken.value = token
    }

    // data和backend/web/views/user/account/login.py中返回的Response中的data一致
    function setUserInfo(data) {
        id.value = data.user_id
        username.value = data.username
        photo.value = data.photo
        profile.value = data.profile
    }

    function logout() {
        id.value = 0
        username.value = ''
        photo.value = ''
        profile.value = ''
        accessToken.value = ''
    }

    function setHasPulledUserInfo(newStatus) {
        hasPulledUserInfo.value = newStatus
    }

    return {
        id,
        username,
        photo,
        profile,
        accessToken,  // 千万不要忘了！！！！
        isLogin,
        setAccessToken,
        setUserInfo,
        logout,
        hasPulledUserInfo,
        setHasPulledUserInfo,
    }
})
