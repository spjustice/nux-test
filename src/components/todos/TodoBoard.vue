<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todos'
import TodoCreate from '@/components/todos/TodoCreate.vue'
import VInput from '@/components/ui/VInput.vue'
import VButton from '@/components/ui/VButton.vue'

const todoStore = useTodoStore()

const { loading, error, statusFilter, userFilter, searchTitle, userIdOptions, filteredTodos } =
  storeToRefs(todoStore)

const { fetchTodos, toggleFavorite, isFavorite } = todoStore

onMounted(async () => {
  await fetchTodos()
})
</script>

<template>
  <div class="mt-10 grid gap-4 lg:grid-cols-[2fr_1fr] items-start">
    <section class="rounded-md border border-slate-200 bg-gray-100 p-4">
      <h3 class="text-2xl font-semibold mb-4">Todo list</h3>

      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase">Status</label>
          <select v-model="statusFilter" class="p-3 rounded-md border border-slate-200 bg-white">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase">User</label>
          <select v-model="userFilter" class="p-3 rounded-md border border-slate-200 bg-white">
            <option value="all">All Users</option>
            <option v-for="id in userIdOptions" :key="id" :value="String(id)">
              {{ id }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase">Search</label>
          <VInput v-model.trim="searchTitle" class="" placeholder="Search by title" type="text" />
        </div>
      </div>

      <div v-if="loading" class="mt-6 text-sm">Loading todos...</div>
      <div v-else-if="error" class="mt-6 text-sm text-red-500">{{ error }}</div>
      <div v-else-if="!filteredTodos.length" class="mt-6 text-lg">No todos found</div>
      <div v-else class="mt-6 space-y-3">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="flex flex-col lg:flex-row lg:items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 p-3"
        >
          <div class="">
            <h5 class="font-semibold">{{ todo.title }}</h5>
            <p class="text-sm">
              User {{ todo.userId }} · {{ todo.completed ? 'Completed' : 'Uncompleted' }}
            </p>
          </div>
          <VButton class="flex-none" @click="toggleFavorite(todo.id)">
            {{ isFavorite(todo.id) ? 'Remove from favorites' : 'Add to favorites' }}
          </VButton>
        </div>
      </div>
    </section>

    <TodoCreate />
  </div>
</template>
