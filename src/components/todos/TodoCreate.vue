<script setup>
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todos'
import VInput from '@/components/ui/VInput.vue'
import VButton from '@/components/ui/VButton.vue'

const todoStore = useTodoStore()

const { newUserId, newTitle, createError } = storeToRefs(todoStore)
const { createTodo } = todoStore
</script>

<template>
  <form class="rounded-md border border-slate-200 bg-gray-100 p-4" @submit.prevent="createTodo">
    <div class="text-xs uppercase mb-2">Create todo</div>
    <div class="">
      <div class="space-y-5 mb-4">
        <VInput v-model.number="newUserId" placeholder="User ID" type="number" required />
        <VInput v-model.trim="newTitle" placeholder="Todo title" type="text" required />
      </div>
      <p v-if="createError" class="text-sm text-red-500 my-3">{{ createError }}</p>
      <VButton class="w-full" type="submit"> Add </VButton>
    </div>
  </form>
</template>
