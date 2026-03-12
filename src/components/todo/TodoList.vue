<template>
  <div v-loading="todoStore.loading">
    <!-- 无分类提示 -->
    <div v-if="!categoryStore.activeCategoryId" class="empty-state">
      <el-icon><Folder /></el-icon>
      <p>请先选择或创建一个分类</p>
    </div>

    <!-- 有分类但无待办 -->
    <div
      v-else-if="!todoStore.loading && todoStore.todos.length === 0"
      class="empty-state"
    >
      <el-icon><Document /></el-icon>
      <p>暂无待办，快来添加吧 ✨</p>
    </div>

    <!-- 待办列表 -->
    <template v-else>
      <!-- 未完成 -->
      <div v-if="unfinishedTodos.length > 0">
        <h4 style="margin-bottom: 12px; color: #606266; font-size: 13px;">
          📋 未完成（{{ unfinishedTodos.length }}）
        </h4>
        <draggable
          v-model="unfinishedList"
          item-key="id"
          handle=".drag-handle"
          animation="200"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <TodoItem :todo="element" />
          </template>
        </draggable>
      </div>

      <!-- 已完成 -->
      <div v-if="finishedTodos.length > 0" style="margin-top: 24px;">
        <el-collapse>
          <el-collapse-item>
            <template #title>
              <span style="font-size: 13px; color: #909399;">
                ✅ 已完成（{{ finishedTodos.length }}）
              </span>
            </template>
            <TodoItem
              v-for="todo in finishedTodos"
              :key="todo.id"
              :todo="todo"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Folder, Document } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import TodoItem from './TodoItem.vue'
import { useTodoStore } from '@/stores/todo'
import { useCategoryStore } from '@/stores/category'

const todoStore = useTodoStore()
const categoryStore = useCategoryStore()

const unfinishedTodos = computed(() =>
  todoStore.todos.filter((t) => t.status === 0)
)

const finishedTodos = computed(() =>
  todoStore.todos.filter((t) => t.status === 1)
)

// 未完成列表的拖拽排序
const unfinishedList = computed({
  get: () => unfinishedTodos.value,
  set: (val) => {
    // 合并已完成的保持不变
    const newList = [...val, ...finishedTodos.value]
    todoStore.updateSort(newList)
  }
})

const onDragEnd = () => {
  // computed set 已处理
}
</script>