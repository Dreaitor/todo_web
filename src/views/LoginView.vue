<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const { data } = await axios.post('/api/users/login', {
      username: username.value,
      password: password.value,
    })
    localStorage.setItem('token', data.token)
    router.push('/todos')
  } catch (err) {
    error.value = err?.response?.data || err?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth">
    <h1>登录</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="用户名" autocomplete="username" />
      <input v-model="password" type="password" placeholder="密码" autocomplete="current-password" />
      <button type="submit" :disabled="loading">登录</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="hint">没有账号？<router-link to="/register">注册</router-link></p>
    </form>
  </main>
</template>