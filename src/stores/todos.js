import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todos', () => {
  const favoritesKey = 'nux-favorites'

  const todos = ref([])
  const loading = ref(false)
  const error = ref('')

  const statusFilter = ref('all')
  const userFilter = ref('all')
  const searchTitle = ref('')

  const newUserId = ref('')
  const newTitle = ref('')
  const createError = ref('')

  const favorites = ref(loadFavorites())

  const userIdOptions = computed(() => {
    return new Set(todos.value.map((todo) => todo.userId))
  })

  const filteredTodos = computed(() => {
    const term = searchTitle.value.toLowerCase()

    return todos.value.filter((todo) => {
      const matchesStatus =
        statusFilter.value === 'all' ||
        (statusFilter.value === 'completed' && todo.completed) ||
        (statusFilter.value === 'uncompleted' && !todo.completed) ||
        (statusFilter.value === 'favorites' && favorites.value.includes(todo.id))

      const matchesUser = userFilter.value === 'all' || Number(userFilter.value) === todo.userId

      const matchesTitle = term.length === 0 || todo.title.toLowerCase().includes(term)

      return matchesStatus && matchesUser && matchesTitle
    })
  })

  async function fetchTodos() {
    loading.value = true
    error.value = ''

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?completed=true')
      todos.value = await response.json()
    } catch (err) {
      error.value = 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  function isFavorite(todoId) {
    return favorites.value.includes(todoId)
  }

  function toggleFavorite(todoId) {
    const newArray = favorites.value.includes(todoId)
      ? favorites.value.filter((id) => id !== todoId)
      : [...favorites.value, todoId]

    favorites.value = newArray
    saveFavorites(newArray)
  }

  async function createTodo() {
    createError.value = ''
    const userId = Number(newUserId.value)
    const title = newTitle.value.trim()

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          title,
          completed: false,
        }),
      })

      const data = await response.json()

      todos.value = [
        {
          id: data.id,
          userId,
          title,
          completed: false,
        },
        ...todos.value,
      ]

      newUserId.value = ''
      newTitle.value = ''
    } catch (err) {
      createError.value = 'Failed to create todo'
    }
  }

  function loadFavorites() {
    const raw = localStorage.getItem(favoritesKey)
    const parsed = raw ? JSON.parse(raw) : []
    return parsed.filter((id) => Number(id))
  }

  function saveFavorites(ids) {
    localStorage.setItem(favoritesKey, JSON.stringify(ids))
  }

  return {
    todos,
    loading,
    error,
    statusFilter,
    userFilter,
    searchTitle,
    newUserId,
    newTitle,
    createError,
    favorites,
    userIdOptions,
    filteredTodos,
    fetchTodos,
    isFavorite,
    toggleFavorite,
    createTodo,
  }
})
