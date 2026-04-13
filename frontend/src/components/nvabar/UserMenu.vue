<script setup>
import { useUserStore } from '@/stores/user.js';
import UserSpaceIndex from './icons/UserSpaceIndex.vue';
import UserProfileIcon from './icons/UserProfileIcon.vue';
import UserLogoutIcon from './icons/UserLogoutIcon.vue';
const user = useUserStore() // 获取在user.js中用pinia定义的全局用户状态
import api from "@/js/http/api.js"
import { useRouter } from 'vue-router';
const router = useRouter

function closeMenu() { // 
    const element = document.activeElement
    if (element && element instanceof HTMLElement) element.blur()
}

async function handleLogout() {
    try {
        const result = await api.post('/api/user/account/logout/')
        if (result.data.result === 'success') {
            user.logout()
        }
        await router.push({
            name: 'homepage-index'
        })
    } catch (err) {
        console.log(err)
    }
}

</script>

<template>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="avatar btn btn-circle w-8 h-8 mr-6">
            <div class="w-8 rounded-full">
                <img :src="user.photo" alt="">
            </div>
        </div>
        <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-lg">
            <li>
                <router-link @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}">
                    <div class="avatar btn btn-circle w-10 h-8 mr-6">
                        <div class="w-8 rounded-full">
                            <img :src="user.photo" alt="">
                        </div>
                    </div>
                    <span text-base font-bold line-clamp-1>{{ user.username}}</span>
                </router-link>
            </li>
            <li>
                <router-link @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}"" class="text-base font-bold py-3" >
                    <UserSpaceIndex/>
                    个人空间
                </router-link>
                <router-link @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}"" class="text-base font-bold py-3" >
                    <UserProfileIcon/>
                    编辑资料
                </router-link>
                <li class="menu-title p-0"><hr class="my-1 border-base-300"></li>
                <a @click="handleLogout" class="text-base font-bold py-3">
                    <UserLogoutIcon/>
                    退出登录
                </a>
            </li>
        </ul>
    </div>
</template> 

<style>

</style>