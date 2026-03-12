<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑分类' : '新建分类'"
    width="400px"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入分类名称"
          maxlength="100"
          show-word-limit
          @keyup.enter="handleSubmit"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoryStore } from '@/stores/category'
import { useTodoStore } from '@/stores/todo'

const categoryStore = useCategoryStore()
const todoStore = useTodoStore()

const visible = ref(false)
const loading = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)

const form = ref({ name: '' })
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const open = (category = null) => {
  visible.value = true
  if (category) {
    isEdit.value = true
    editId.value = category.id
    form.value.name = category.name
  } else {
    isEdit.value = false
    editId.value = null
    form.value.name = ''
  }
  nextTick(() => formRef.value?.clearValidate())
}

const resetForm = () => {
  form.value.name = ''
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    if (isEdit.value) {
      await categoryStore.editCategory(editId.value, form.value.name)
      ElMessage.success('修改成功')
    } else {
      const newCategory = await categoryStore.addCategory(form.value.name)
      ElMessage.success('创建成功')
      // 自动加载新分类的待办
      todoStore.fetchTodos(newCategory.id)
    }
    visible.value = false
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>