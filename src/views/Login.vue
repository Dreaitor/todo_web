<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>📝 待办登录</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
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
            <el-skeleton v-else style="width: 130px; height: 40px" animated />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="auth-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
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
  captcha: '',
  captchaId: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await authStore.login(form.value)
    ElMessage.success('登录成功')
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