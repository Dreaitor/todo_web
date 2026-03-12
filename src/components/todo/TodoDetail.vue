<template>
  <el-drawer
    v-model="visible"
    title="待办详情"
    size="400px"
    direction="rtl"
  >
    <div class="todo-detail" v-if="todo">
      <!-- 状态 -->
      <div class="detail-field">
        <label>状态</label>
        <div>
          <el-tag :type="todo.status === 1 ? 'success' : 'warning'" size="large">
            {{ todo.status === 1 ? '✅ 已完成' : '⏳ 未完成' }}
          </el-tag>
          <el-button
            style="margin-left: 12px"
            size="small"
            @click="handleToggle"
          >
            {{ todo.status === 1 ? '标为未完成' : '标为已完成' }}
          </el-button>
        </div>
      </div>

      <!-- 标题 -->
      <div class="detail-field">
        <label>标题</label>
        <div class="value">{{ todo.title }}</div>
      </div>

      <!-- 分类 -->
      <div class="detail-field">
        <label>分类</label>
        <div class="value">
          {{ categoryName }}
        </div>
      </div>

      <!-- 详情 -->
      <div class="detail-field" v-if="todo.description">
        <label>详情</label>
        <div
          class="value"
          style="white-space: pre-wrap; background: #f5f7fa;
                 padding: 12px; border-radius: 6px;"
        >
          {{ todo.description }}
        </div>
      </div>

      <!-- 截止日期 -->
      <div class="detail-field" v-if="todo.deadline">
        <label>截止日期</label>
        <div class="value">
          📅 {{ formatDate(todo.deadline) }}
          <el-tag
            v-if="isOverdue(todo.deadline) && todo.status === 0"
            type="danger"
            size="small"
            style="margin-left: 8px"
          >
            已过期
          </el-tag>
        </div>
      </div>

      <!-- 创建时间 -->
      <div class="detail-field">
        <label>创建时间</label>
        <div class="value">{{ formatDate(todo.createdAt) }}</div>
      </div>

      <!-- 更新时间 -->
      <div class="detail-field">
        <label>更新时间</label>
        <div class="value">{{ formatDate(todo.updatedAt) }}</div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCategoryStore } from '@/stores/category'
import { useTodoStore } from '@/stores/todo'
import { formatDate, isOverdue } from '@/utils/date'

const categoryStore = useCategoryStore()
const todoStore = useTodoStore()
const openTodoForm = inject('openTodoForm')

const visible = ref(false)
const todo = ref(null)

const categoryName = computed(() => {
  if (!todo.value) return ''
  const cat = categoryStore.categories.find(
    (c) => c.id === todo.value.categoryId
  )
  return cat?.name || '未知分类'
})

const open = (item) => {
  todo.value = { ...item }
  visible.value = true
}

const handleToggle = async () => {
  await todoStore.toggle(todo.value.id)
  todo.value.status = todo.value.status === 0 ? 1 : 0
}

const handleEdit = () => {
  visible.value = false
  openTodoForm(todo.value)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定删除这条待办？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await todoStore.removeTodo(todo.value.id)
    ElMessage.success('删除成功')
    visible.value = false
  }).catch(() => {})
}

defineExpose({ open })
</script>