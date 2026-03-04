import { ref, computed } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const useTodos = () => {
  const todos = ref([])
  const filter = ref('all')
  const loading = ref(false)
  const error = ref('')

  const loadTodos = async () => {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/todos')
      todos.value = data
    } catch (err) {
      error.value = err?.response?.data || err?.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (title) => {
    const trimmed = title.trim()
    if (!trimmed) return
    try {
      const { data } = await api.post('/todos', { title: trimmed })
      todos.value.unshift(data)
    } catch (err) {
      error.value = err?.response?.data || err?.message || '新增失败'
    }
  }

  const toggleTodo = async (id) => {
    const target = todos.value.find((todo) => todo.id === id)
    if (!target) return
    try {
      const { data } = await api.patch(`/todos/${id}`, {
        completed: !target.completed,
      })
      Object.assign(target, data)
    } catch (err) {
      error.value = err?.response?.data || err?.message || '更新失败'
    }
  }

  const removeTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`)
      todos.value = todos.value.filter((todo) => todo.id !== id)
    } catch (err) {
      error.value = err?.response?.data || err?.message || '删除失败'
    }
  }

  const updateTodo = async (id, title) => {
    const trimmed = title.trim()
    if (!trimmed) {
      return removeTodo(id)
    }
    try {
      const { data } = await api.patch(`/todos/${id}`, { title: trimmed })
      const target = todos.value.find((todo) => todo.id === id)
      if (target) Object.assign(target, data)
    } catch (err) {
      error.value = err?.response?.data || err?.message || '更新失败'
    }
  }

  const clearCompleted = async () => {
    try {
      await api.post('/todos/clear-completed')
      todos.value = todos.value.filter((todo) => !todo.completed)
    } catch (err) {
      error.value = err?.response?.data || err?.message || '清理失败'
    }
  }

  const remainingCount = computed(() =>
    todos.value.reduce((count, todo) => count + (todo.completed ? 0 : 1), 0)
  )

  const completedCount = computed(() =>
    todos.value.reduce((count, todo) => count + (todo.completed ? 1 : 0), 0)
  )

  const allCompleted = computed({
    get: () => todos.value.length > 0 && remainingCount.value === 0,
    set: async (value) => {
      try {
        const { data } = await api.post('/todos/toggle-all', {
          completed: value,
        })
        todos.value = data
      } catch (err) {
        error.value = err?.response?.data || err?.message || '批量更新失败'
      }
    },
  })

  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter((todo) => !todo.completed)
    if (filter.value === 'completed') return todos.value.filter((todo) => todo.completed)
    return todos.value
  })

  return {
    todos,
    filter,
    filteredTodos,
    remainingCount,
    completedCount,
    allCompleted,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    loadTodos,
    loading,
    error,
  }
}