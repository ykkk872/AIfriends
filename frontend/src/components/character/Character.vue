<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['remove'])
</script>

<template>
  <div class="card bg-base-200 shadow-md w-60 overflow-hidden">
    <figure class="aspect-square bg-base-300">
      <img
        v-if="character.photo"
        :src="character.photo"
        :alt="character.name || 'character'"
        class="w-full h-full object-cover"
      />
    </figure>
    <div class="card-body p-4 gap-2">
      <h2 class="card-title text-base line-clamp-2">
        {{ character.name || '未命名' }}
      </h2>
      <p v-if="character.profile" class="text-sm text-base-content/70 line-clamp-3">
        {{ character.profile }}
      </p>
      <div class="card-actions justify-end flex-wrap gap-2 mt-2">
        <RouterLink
          v-if="canEdit"
          :to="{ name: 'update-character', params: { character_id: character.id } }"
          class="btn btn-sm btn-primary"
        >
          编辑
        </RouterLink>
        <button
          v-if="canEdit"
          type="button"
          class="btn btn-sm btn-ghost text-error"
          @click="emit('remove', character.id)"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>
