<template>
  <fieldset class="space-y-5">
    <div v-for="checkbox in checkboxList" :key="checkbox.key" class="relative flex items-start">
      <div class="flex h-6 items-center">
        <input
          :id="checkbox.name"
          :name="checkbox.name"
          type="checkbox"
          :checked="checkbox.checked ?? false"
          :disabled="checkbox.disabled"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-200" />
      </div>
      <div class="ml-3 text-sm leading-6">
        <label :for="checkbox.name" class="font-medium" :class="checkbox.disabled ? 'text-gray-300' : 'text-gray-900'">
          {{ checkbox.title }}
        </label>
        <p :class="checkbox.disabled ? 'text-gray-200' : 'text-gray-500'">{{ checkbox.description }}</p>
      </div>
    </div>
  </fieldset>
</template>

<script setup>
defineProps({
  checkboxList: {
    type: Array,
    required: true
  }
})
</script>
