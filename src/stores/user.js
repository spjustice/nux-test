import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const storageKey = 'nux-user'
  const users = ref([])
  const currentUser = ref(loadStoredUser())
  const loading = ref(false)
  const error = ref('')

  function loadStoredUser() {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : null
    } catch (err) {
      return null
    }
  }

  function saveUser(user) {
    if (!user) {
      localStorage.removeItem(storageKey)
      return
    }

    localStorage.setItem(storageKey, JSON.stringify(user))
  }

  async function fetchUsers() {
    loading.value = true
    error.value = ''

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      users.value = await response.json()
    } catch (err) {
      error.value = 'Failed to load users.'
    } finally {
      loading.value = false
    }
  }

  async function login(username, phone) {
    error.value = ''
    await fetchUsers()

    if (error.value) {
      return false
    }

    const match = users.value.find((user) => user.username === username && user.phone === phone)

    if (!match) {
      currentUser.value = null
      saveUser(null)
      error.value = 'User not found.'
      return false
    }

    currentUser.value = match
    saveUser(match)
    return true
  }

  function logout() {
    currentUser.value = null
    saveUser(null)
  }

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    login,
    logout,
  }
})
