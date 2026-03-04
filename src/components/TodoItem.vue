<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle', 'remove', 'update'])

const editing = ref(false)
const draft = ref(props.todo.title)
const inputRef = ref(null)

watch(
  () => props.todo.title,
  (value) => {
    if (!editing.value) {
      draft.value = value
    }
  }
)

const startEdit = async () => {
  editing.value = true
  draft.value = props.todo.title
  await nextTick()
  inputRef.value?.focus()
}

const cancelEdit = () => {
  editing.value = false
  draft.value = props.todo.title
}

const saveEdit = () => {
  emit('update', props.todo.id, draft.value)
  editing.value = false
}
</script>

<template>
  <article class="todo-item" :class="{ 'todo-item--completed': todo.completed }">
    <label class="todo-item__check">
      <input type="checkbox" :checked="todo.completed" @change="emit('toggle', todo.id)" />
      <span></span>
    </label>

    <div class="todo-item__content">
      <template v-if="!editing">
        <p class="todo-item__title">{{ todo.title }}</p>
        <div class="todo-item__meta">{{ new Date(todo.createdAt).toLocaleString() }}</div>
      </template>
      <template v-else>
        <input
          ref="inputRef"
          v-model="draft"
          class="todo-item__input"
          type="text"
          @keydown.enter.prevent="saveEdit"
          @keydown.esc.prevent="cancelEdit"
          @blur="saveEdit"
        />
      </template>
    </div>

    <div class="todo-item__actions">
      <button type="button" @click="startEdit" v-if="!editing">编辑</button>
      <button type="button" class="ghost" @click="cancelEdit" v-else>取消</button>
      <button type="button" class="danger" @click="emit('remove', todo.id)">删除</button>
    </div>
  </article>
</template>
