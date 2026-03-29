<script setup>
import HomepageIcon from './icons/HomepageIcon.vue';
import FriendIcon from './icons/FriendIcon.vue';
import CreateIcon from './icons/CreateIcon.vue';
import MenuIcon from './icons/MenuIcon.vue';
import UserLogoutIcon from './icons/UserLogoutIcon.vue';
import UserProfileIcon from './icons/UserProfileIcon.vue';
import SearchIcon from './icons/SearchIcon.vue';
</script>

<template>
    <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <!-- <nav>                              ← navbar，全宽
        ├── navbar-start                 ← logo + 菜单按钮
        ├── navbar-center w-4/5          ← ① 占 nav 的 80%（最大 180 = max-w-180）
        │     └── join w-4/5             ← ② 占 navbar-center 的 80%
        │           ├── input w-4/5      ← ③ 占 join 容器的 80%（输入框）
        │           └── button           ← 剩下的空间（搜索按钮）
        └── navbar-end                   ← 登录按钮 -->
    <div class="drawer-content">
        <!-- Navbar -->
        <nav class="navbar w-full bg-base-100 shadow-sm">
        <div class="navbar-start">
            <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <!-- Sidebar toggle icon -->
                <MenuIcon />
            </label>
            <div class="px-2 font-bold text-xl">AIFriends</div>
        </div>
        <div class="navbar-center w-4/5 max-w-180 flex justify-center">
            <div class="join w-4/5 flex justify-center">
                <input class="input join-item rounded-l-full w-4/5" placeholder="搜索你感兴趣的内容" />
                <button class="btn join-item rounded-r-full">
                    <SearchIcon/>
                </button>
            </div>
        </div>
        <div class="navbar-end">
            <button class="btn btn-ghost text-lg">
                <UserLogoutIcon/>
            </button>
        </div>
        </nav>
        <!-- slot显示App.vue中两个NavBar中的内容 -->
         <slot></slot> 
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
        <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-54">
        <!-- Sidebar content here -->
        <ul class="menu w-full grow">
            <!-- List item -->
            <li>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-4" data-tip="首页">
                <!-- Home icon -->
                <HomepageIcon/>
                <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">首页</span>
            </button>
            </li>
            <li>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-4" data-tip="好友">
                <!-- Home icon -->
                <FriendIcon/>
                <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">好友</span>
            </button>
            </li>
            <li>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-4" data-tip="创作">
                <!-- Home icon -->
                <CreateIcon/>
                <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">创作</span>
            </button>
            </li>
        </ul>
        </div>
    </div>
    </div>
</template>

<style scoped>

</style>
