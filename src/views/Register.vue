<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>📝 待办注册</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名（3-50字符）"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码（至少6位）"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input
              v-model="form.captcha"
              placeholder="请输入验证码"
              size="large"
            />
            <img
              v-if="captchaImage"
              :src="captchaImage"
              class="captcha-img"
              @click="loadCaptcha"
              title="点击刷新验证码"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="auth-btn"
            :loading="loading"
            @click="handleRegister"
          >
            注 册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { getCaptcha } from '@/api/auth'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const formRef = ref(null)
const loading = ref(false)
const captchaImage = ref('')

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  captchaId: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '长度3-50字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const loadCaptcha = async () => {
  try {
    const res = await getCaptcha()
    captchaImage.value = res.data.image
    form.value.captchaId = res.data.captchaId
  } catch (e) {
    console.error('获取验证码失败', e)
  }
}

const handleRegister = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await authStore.register({
      username: form.value.username,
      password: form.value.password,
      captcha: form.value.captcha,
      captchaId: form.value.captchaId
    })
    ElMessage.success('注册成功，请登录')
  } catch (e) {
    loadCaptcha()
    form.value.captcha = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCaptcha()
})
</script>