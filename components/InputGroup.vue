<template>
  <div ref="groupWrapper" @input="onInputEvent">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  group: {
    type: Object,
    required: true
  }
})
const model = defineModel({ required: true })
const groupWrapper = ref()
const inputNodes = []

const findInputOrSelectNodes = (childNodes) => {
  for (const child of childNodes) {
    if (child.tagName === 'INPUT' || child.tagName === 'SELECT') {
      inputNodes.push(child)
    } else {
      findInputOrSelectNodes(child.childNodes)
    }
  }
}

const onInputEvent = (evt) => {
  const value = evt.target.value
  model.value[evt.target.name] = Number(value)
}

onMounted(() => {
  findInputOrSelectNodes(groupWrapper.value.childNodes)
  for (const input of inputNodes) {
    if (!input.name) return false
    input.value = model.value[input.name]
  }
})
</script>
