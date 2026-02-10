<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import VInput from '@/components/ui/VInput.vue'
import VButton from '@/components/ui/VButton.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('Samantha')
const phoneNumber = ref('1-463-123-4447')

const usernameAllow = /\p{L}/u
const phoneAllow = /[0-9+()\-\s]/

const errorMessage = computed(() => userStore.error)

const onSubmit = async () => {
  const isLoggedIn = await userStore.login(username.value, phoneNumber.value)

  if (isLoggedIn) {
    router.push('/profile')
  }
}
</script>

<template>
  <div class="flex-auto flex flex-col justify-center items-center py-10 px-2">
    <div class="max-w-111.75 w-full bg-[#C3C3C3] rounded-md">
      <div class="p-4 text-center bg-[#A5A5A5] rounded-t-md">
        <h2 class="text-lg text-[#5F5F5F] -tracking-tight">Login form</h2>
      </div>
      <form class="px-6 pt-4 pb-8" @submit.prevent="onSubmit">
        <h3 class="-tracking-tight mb-3.5 text-[#5F5F5F]">Type your information</h3>
        <div class="space-y-5 mb-6">
          <VInput
            v-model.trim="username"
            :allow-pattern="usernameAllow"
            placeholder="Username"
            required
          />
          <VInput
            v-model.trim="phoneNumber"
            :allow-pattern="phoneAllow"
            type="tel"
            placeholder="Phone Number"
            required
          />
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm my-2">{{ errorMessage }}</p>
        <VButton type="submit" class="w-full">Login</VButton>
      </form>
    </div>
  </div>
</template>
