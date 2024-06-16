<template>
  <div class="flex w-[12%] min-w-fit flex-col">
    <label :for="type">
      <slot>{{ label }}</slot>
    </label>
    <div class="flex items-center gap-1">
      <input
        v-if="type !== 'select'"
        :id="type"
        v-model="model"
        :min
        :max
        :type
        class="w-1/2 rounded border border-slate-600 py-0.5 pl-2"
        :class="inputClass" />
      <select v-if="type === 'select'" v-model="model" class="w-1/2 rounded py-0.5 pl-2" :class="inputClass">
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.key }}</option>
      </select>
      <slot name="suffix">
        <span>{{ suffix }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  suffix: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 999999999
  },
  options: {
    type: Array,
    default: () => []
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const model = defineModel({ required: true })
</script>
