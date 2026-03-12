<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑待办' : '新建待办'"
    width="520px"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
          <el-option
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入待办标题"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="详情">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="添加详情描述（可选）"
        />
      </el-form-item>

      <el-form-item label="截止日期">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="选择截止日期（可选）"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss"
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

const form = ref({
  categoryId: null,
  title: '',
  description: '',
  deadline: null
})

const rules = {
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
}

const open = (todo = null) => {
  visible.value = true
  if (todo) {
    isEdit.value = true
    editId.value = todo.id
    form.value = {
      categoryId: todo.categoryId,
      title: todo.title,
      description: todo.description || '',
      deadline: todo.deadline || null
    }
  } else {
    isEdit.value = false
    editId.value = null
    form.value = {
      categoryId: categoryStore.activeCategoryId,
      title: '',
      description: '',
      deadline: null
    }
  }
  nextTick(() => formRef.value?.clearValidate())
}

const resetForm = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const data = { ...form.value }
    if (!data.description) data.description = null
    if (!data.deadline) data.deadline = null

    if (isEdit.value) {
      await todoStore.editTodo(editId.value, data)
      ElMessage.success('修改成功')
    } else {
      await todoStore.addTodo(data)
      ElMessage.success('添加成功')
    }
    visible.value = false
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>