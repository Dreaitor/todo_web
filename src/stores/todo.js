import { defineStore } from 'pinia'
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  sortTodos
} from '@/api/todo'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false
  }),

  getters: {
    unfinishedCount: (state) =>
      state.todos.filter((t) => t.status === 0).length,
    finishedCount: (state) =>
      state.todos.filter((t) => t.status === 1).length
  },

  actions: {
    async fetchTodos(categoryId) {
      this.loading = true
      try {
        const params = {}
        if (categoryId) params.categoryId = categoryId
        const res = await getTodos(params)
        this.todos = res.data
      } finally {
        this.loading = false
      }
    },

    async addTodo(data) {
      const res = await createTodo(data)
      this.todos.push(res.data)
      return res.data
    },

    async editTodo(id, data) {
      const res = await updateTodo(id, data)
      const index = this.todos.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.todos[index] = res.data
      }
    },

    async toggle(id) {
      const res = await toggleTodo(id)
      const index = this.todos.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.todos[index] = res.data
      }
    },

    async removeTodo(id) {
      await deleteTodo(id)
      this.todos = this.todos.filter((t) => t.id !== id)
    },

    async updateSort(newList) {
      this.todos = newList
      const items = newList.map((item, index) => ({
        id: item.id,
        sortOrder: index
      }))
      await sortTodos({ items })
    }
  }
})