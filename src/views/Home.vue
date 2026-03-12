<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主内容 -->
    <div class="main-content">
      <!-- 头部 -->
      <AppHeader />

      <!-- 待办内容 -->
      <div class="todo-container">
        <!-- 快速添加 -->
        <div class="todo-input-bar" v-if="categoryStore.activeCategoryId">
          <el-input
            v-model="newTodoTitle"
            placeholder="添加新待办，按回车确认..."
            size="large"
            :prefix-icon="Plus"
            @keyup.enter="quickAddTodo"
            clearable
          />
          <el-button type="primary" size="large" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            详细添加
          </el-button>
        </div>

        <!-- 待办列表 -->
        <TodoList />
      </div>
    </div>

    <!-- 新建/编辑待办弹窗 -->
    <TodoForm ref="todoFormRef" />

    <!-- 待办详情抽屉 -->
    <TodoDetail ref="todoDetailRef" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Sidebar from '@/components/layout/Sidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import TodoList from '@/components/todo/TodoList.vue'
import TodoForm from '@/components/todo/TodoForm.vue'
import TodoDetail from '@/components/todo/TodoDetail.vue'
import { useCategoryStore } from '@/stores/category'
import { useTodoStore } from '@/stores/todo'

const categoryStore = useCategoryStore()
const todoStore = useTodoStore()
const todoFormRef = ref(null)
const todoDetailRef = ref(null)
const newTodoTitle = ref('')

// 快速添加
const quickAddTodo = async () => {
  const title = newTodoTitle.value.trim()
  if (!title) return
  if (!categoryStore.activeCategoryId) {
    ElMessage.warning('请先选择或创建一个分类')
    return
  }

  try {
    await todoStore.addTodo({
      categoryId: categoryStore.activeCategoryId,
      title
    })
    newTodoTitle.value = ''
    ElMessage.success('添加成功')
  } catch (e) {
    // handled by interceptor
  }
}

// 打开详细添加弹窗
const showAddDialog = () => {
  todoFormRef.value?.open()
}

// 提供给子组件调用
provide('openTodoForm', (todo) => {
  todoFormRef.value?.open(todo)
})

provide('openTodoDetail', (todo) => {
  todoDetailRef.value?.open(todo)
})
</script>