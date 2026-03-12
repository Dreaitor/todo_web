import request from '@/utils/request'

// 获取待办列表
export function getTodos(params) {
  return request.get('/todos', { params })
}

// 获取待办详情
export function getTodo(id) {
  return request.get(`/todos/${id}`)
}

// 创建待办
export function createTodo(data) {
  return request.post('/todos', data)
}

// 更新待办
export function updateTodo(id, data) {
  return request.put(`/todos/${id}`, data)
}

// 切换完成状态
export function toggleTodo(id) {
  return request.patch(`/todos/${id}/toggle`)
}

// 删除待办
export function deleteTodo(id) {
  return request.delete(`/todos/${id}`)
}

// 排序待办
export function sortTodos(data) {
  return request.put('/todos/sort', data)
}