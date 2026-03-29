<script setup>
import UserInfoField from "@/views/user/space/components/UserInfoField.vue";
import {nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch} from "vue";
import {useRoute} from "vue-router";
import api from "@/js/http/api.js";
import Character from "@/components/character/Character.vue";

const userProfile = ref(null)
const characters = ref([])
const isLoading = ref(false)
const hasCharacters = ref(true)
const sentinelRef = useTemplateRef('sentinel-ref')
const route = useRoute()

function reset() {
  userProfile.value = null
  characters.value = []
  isLoading.value = false
  hasCharacters.value = true
  loadMore()
}

watch(() => route.params.user_id, () => {
  reset()
})

function checkSentinelVisible() {  // 判断哨兵是否能被看到
  if (!sentinelRef.value) return false

  const rect = sentinelRef.value.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

async function loadMore() {
  if (isLoading.value || !hasCharacters.value) return
  isLoading.value = true

  let newCharacters = []
  try {
    const res = await api.get('/api/create/character/get_list/', {
      params: {
        items_count: characters.value.length,
        user_id: route.params.user_id,
      }
    })
    const data = res.data
    if (data.result === 'success') {
      userProfile.value = data.user_profile
      newCharacters = data.characters
    }
  } catch (err) {
  } finally {
    isLoading.value = false
    if (newCharacters.length === 0) {
      hasCharacters.value = false
    } else {
      characters.value.push(...newCharacters)
      await nextTick()

      if (checkSentinelVisible()) {
        await loadMore()
      }
    }
  }
}

let observer = null
onMounted(async () => {
  await loadMore()

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadMore()
        }
      })
    },
    {root: null, rootMargin: '2px', threshold: 0}
  )
  observer.observe(sentinelRef.value)
})

function removeCharacter(characterId) {
  characters.value = characters.value.filter(c => c.id !== characterId)
}

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  用户空间页面: {{ route.params.user_id }}
</template>

<style scoped>

</style>