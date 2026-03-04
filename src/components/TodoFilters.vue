<script setup>
const props = defineProps({
  filter: {
    type: String,
    required: true,
  },
  remainingCount: {
    type: Number,
    required: true,
  },
  completedCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['change-filter', 'clear-completed'])

const setFilter = (value) => emit('change-filter', value)
</script>

<template>
  <footer class="filters">
    <div class="filters__count">
      <span class="filters__number">{{ remainingCount }}</span>
      <span>未完成</span>
    </div>

    <div class="filters__buttons">
      <button type="button" :class="{ active: filter === 'all' }" @click="setFilter('all')">
        全部
      </button>
      <button type="button" :class="{ active: filter === 'active' }" @click="setFilter('active')">
        进行中
      </button>
      <button
        type="button"
        :class="{ active: filter === 'completed' }"
        @click="setFilter('completed')"
      >
        已完成
      </button>
    </div>

    <button
      type="button"
      class="filters__clear"
      :disabled="completedCount === 0"
      @click="emit('clear-completed')"
    >
      清除已完成 ({{ completedCount }})
    </button>
  </footer>
</template>
