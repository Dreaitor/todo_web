<template>
  <div v-loading="categoryStore.loading">
    <draggable
      v-model="categoryList"
      item-key="id"
      handle=".drag-handle"
      animation="200"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <div
          class="category-item"
          :class="{ active: categoryStore.activeCategoryId === element.id }"
          @click="selectCategory(element.id)"
        >
          <el-icon class="drag-handle"><Rank /></el-icon>
          <span class="category-name">{{ element.name }}</span>
          <div class="category-actions" @click.stop>
            <el-button
              text
              size="small"
              @click="editCategory(element)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              text
              size="small"
              type="danger"
              @click="removeCategory(element)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
    </draggable>

    <el-empty
      v-if="!categoryStore.loading && categoryStore.categories.length === 0"
      description="暂无分类，点击上方 + 创建"
      :image-size="80"
    />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, watch } from 'vue'
import { Rank, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import { useCategoryStore } from '@/stores/category'
import { useTodoStore } from '@/stores/todo'

const categoryStore = useCategoryStore()
const todoStore = useTodoStore()
const openCategoryForm = inject('openCategoryForm')

const categoryList = computed({
  get: () => categoryStore.categories,
  set: (val) => categoryStore.updateSort(val)
})

const selectCategory = (id) => {
  categoryStore.setActive(id)
}

const editCategory = (category) => {
  openCategoryForm(category)
}

const removeCategory = (category) => {
  ElMessageBox.confirm(
    `确定删除分类「${category.name}」？该分类下的所有待办也会被删除`,
    '警告',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    await categoryStore.removeCategory(category.id)
    ElMessage.success('删除成功')
    // 重新加载待办
    if (categoryStore.activeCategoryId) {
      todoStore.fetchTodos(categoryStore.activeCategoryId)
    }
  }).catch(() => {})
}

// 拖拽结束
const onDragEnd = () => {
  // computed set 已经处理了
}

// 初始化加载分类
onMounted(() => {
  categoryStore.fetchCategories()
})

// 当选中分类变化时，加载对应待办
watch(
  () => categoryStore.activeCategoryId,
  (newId) => {
    if (newId) {
      todoStore.fetchTodos(newId)
    }
  }
)
</script>