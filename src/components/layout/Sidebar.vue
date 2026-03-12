<template>
  <aside class="sidebar">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h3>📂 分类</h3>
      <el-button type="primary" text @click="showAddCategory">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <!-- 分类列表 -->
    <div class="sidebar-body">
      <CategoryList />
    </div>

    <!-- 新建/编辑分类弹窗 -->
    <CategoryForm ref="categoryFormRef" />
  </aside>
</template>

<script setup>
import { ref, provide } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import CategoryList from '@/components/category/CategoryList.vue'
import CategoryForm from '@/components/category/CategoryForm.vue'

const categoryFormRef = ref(null)

const showAddCategory = () => {
  categoryFormRef.value?.open()
}

provide('openCategoryForm', (category) => {
  categoryFormRef.value?.open(category)
})
</script>