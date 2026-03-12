import request from '@/utils/request'

// 获取验证码
export function getCaptcha() {
  return request.get('/captcha')
}

// 注册
export function register(data) {
  return request.post('/auth/register', data)
}

// 登录
export function login(data) {
  return request.post('/auth/login', data)
}