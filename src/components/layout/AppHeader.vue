<template>
  <header class="app-header">
    <h2>
      {{ categoryStore.activeCategory?.name || '全部待办' }}
      <el-tag size="small" type="info" style="margin-left: 8px" v-if="todoStore.todos.length">
        {{ todoStore.unfinishedCount }} / {{ todoStore.todos.length }}
      </el-tag>
    </h2>
    <div class="header-right">
      <span style="font-size: 14px; color: #909399">
        👋 {{ authStore.username }}
      </span>
      <el-button text @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        退出
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'
import { useTodoStore } from '@/stores/todo'
import { ElMessageBox } from 'element-plus'

const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const todoStore = useTodoStore()

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authStore.logout()
  }).catch(() => {})
}
</script>