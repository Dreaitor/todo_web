<template>
  <div
    class="todo-item"
    :class="{ completed: todo.status === 1 }"
    @click="openDetail"
  >
    <!-- 拖拽手柄 -->
    <el-icon v-if="todo.status === 0" class="drag-handle">
      <Rank />
    </el-icon>

    <!-- 复选框 -->
    <el-checkbox
      class="todo-checkbox"
      :model-value="todo.status === 1"
      @click.stop
      @change="handleToggle"
    />

    <!-- 待办信息 -->
    <div class="todo-info">
      <div class="todo-title">{{ todo.title }}</div>
      <div class="todo-meta" v-if="todo.deadline || todo.description">
        <span
          v-if="todo.deadline"
          :class="{ overdue: isOverdue(todo.deadline) && todo.status === 0 }"
        >
          📅 {{ formatDate(todo.deadline, 'MM-DD HH:mm') }}
          <template v-if="isOverdue(todo.deadline) && todo.status === 0">
            （已过期）
          </template>
        </span>
        <span v-if="todo.description">📝 有备注</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="todo-actions" @click.stop>
      <el-button text size="small" @click="handleEdit">
        <el-icon><Edit /></el-icon>
      </el-button>
      <el-button text size="small" type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { Rank, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTodoStore } from '@/stores/todo'
import { formatDate, isOverdue } from '@/utils/date'

const props = defineProps({
  todo: { type: Object, required: true }
})

const todoStore = useTodoStore()
const openTodoForm = inject('openTodoForm')
const openTodoDetail = inject('openTodoDetail')

const handleToggle = async () => {
  await todoStore.toggle(props.todo.id)
}

const handleEdit = () => {
  openTodoForm(props.todo)
}

const openDetail = () => {
  openTodoDetail(props.todo)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定删除这条待办？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await todoStore.removeTodo(props.todo.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>