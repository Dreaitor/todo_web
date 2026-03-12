import { defineStore } from 'pinia'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  sortCategories
} from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    activeCategoryId: null,
    loading: false
  }),

  getters: {
    activeCategory: (state) =>
      state.categories.find((c) => c.id === state.activeCategoryId) || null
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const res = await getCategories()
        this.categories = res.data
        // 默认选中第一个分类
        if (this.categories.length > 0 && !this.activeCategoryId) {
          this.activeCategoryId = this.categories[0].id
        }
        // 如果当前选中的分类被删除了，重新选中第一个
        if (!this.categories.find((c) => c.id === this.activeCategoryId)) {
          this.activeCategoryId = this.categories[0]?.id || null
        }
      } finally {
        this.loading = false
      }
    },

    async addCategory(name) {
      const res = await createCategory({ name })
      this.categories.push(res.data)
      this.activeCategoryId = res.data.id
      return res.data
    },

    async editCategory(id, name) {
      const res = await updateCategory(id, { name })
      const index = this.categories.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.categories[index] = res.data
      }
    },

    async removeCategory(id) {
      await deleteCategory(id)
      this.categories = this.categories.filter((c) => c.id !== id)
      if (this.activeCategoryId === id) {
        this.activeCategoryId = this.categories[0]?.id || null
      }
    },

    setActive(id) {
      this.activeCategoryId = id
    },

    async updateSort(newList) {
      this.categories = newList
      const items = newList.map((item, index) => ({
        id: item.id,
        sortOrder: index
      }))
      await sortCategories({ items })
    }
  }
})