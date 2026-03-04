<script setup>
import { ref, onMounted } from 'vue'
import { useTodos } from '../composables/useTodos'
import TodoItem from './TodoItem.vue'
import TodoFilters from './TodoFilters.vue'

const newTitle = ref('')

const {
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
} = useTodos()

const handleSubmit = () => {
  addTodo(newTitle.value)
  newTitle.value = ''
}

onMounted(() => {
  loadTodos()
})
</script>

<template>
  <main class="app">
    <header class="app__header">
      <div>
        <p class="app__eyebrow">今日计划</p>
        <h1 class="app__title">待办清单</h1>
      </div>
      <label class="toggle-all">
        <input type="checkbox" v-model="allCompleted" />
        <span>全部完成</span>
      </label>
    </header>

    <form class="composer" @submit.prevent="handleSubmit">
      <input
        v-model="newTitle"
        type="text"
        placeholder="添加一个待办事项…"
        autocomplete="off"
      />
      <button type="submit">添加</button>
    </form>

    <section v-if="loading" class="empty">
      <p>加载中...</p>
    </section>

    <section v-else-if="error" class="empty">
      <p>{{ error }}</p>
    </section>

    <section v-else-if="filteredTodos.length" class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo"
        @remove="removeTodo"
        @update="updateTodo"
      />
    </section>

    <section v-else class="empty">
      <p>暂无待办，先添加一个任务吧。</p>
    </section>

    <TodoFilters
      :filter="filter"
      :remaining-count="remainingCount"
      :completed-count="completedCount"
      @change-filter="filter = $event"
      @clear-completed="clearCompleted"
    />
  </main>
</template>