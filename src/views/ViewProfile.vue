<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import TodoBoard from '@/components/todos/TodoBoard.vue'
import VButton from '@/components/ui/VButton.vue'
import router from '@/router'

const userStore = useUserStore()

const user = computed(() => userStore.currentUser)
const profileLoading = computed(() => userStore.loading)
const profileError = computed(() => userStore.error)

const logout = () => {
  userStore.logout()
  router.push('/')
}

onMounted(async () => {
  if (!userStore.currentUser && userStore.users.length === 0) {
    await userStore.fetchUsers()
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-start px-2 py-10">
    <div class="w-full max-w-6xl rounded-md bg-gray-100 p-4 shadow-lg">
      <div class="flex items-center justify-between gap-4">
        <div class="">
          <div class="text-xs uppercase mb-2">Profile</div>
          <h1 class="text-3xl font-semibold text-slate-900">
            {{ user?.name || 'Welcome' }}
          </h1>
        </div>
        <VButton @click="logout">Logout</VButton>
      </div>

      <p v-if="profileLoading" class="mt-8 text-sm text-slate-500">Loading profile...</p>
      <p v-else-if="profileError" class="mt-8 text-sm text-red-500">{{ profileError }}</p>
      <p v-else-if="!user" class="mt-8 text-sm text-slate-500">
        No user selected. Please log in again.
      </p>

      <div v-else class="rounded-md border border-slate-200 bg-gray-100 p-4 mt-4">
        <p class="text-sm text-slate-700">Username: {{ user.username }}</p>
        <p class="text-sm text-slate-700">Email: {{ user.email }}</p>
        <p class="text-sm text-slate-700">Phone: {{ user.phone }}</p>
        <p class="text-sm text-slate-700">Website: {{ user.website }}</p>
      </div>

      <TodoBoard />
    </div>
  </div>
</template>
