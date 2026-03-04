<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  try {
    await axios.post('/api/users/register', {
      username: username.value,
      password: password.value,
    })
    router.push('/login')
  } catch (err) {
    error.value = err?.response?.data || err?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth">
    <h1>注册</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="username" placeholder="用户名" autocomplete="username" />
      <input v-model="password" type="password" placeholder="密码" autocomplete="new-password" />
      <button type="submit" :disabled="loading">注册</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="hint">已有账号？<router-link to="/login">登录</router-link></p>
    </form>
  </main>
</template>