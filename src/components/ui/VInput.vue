<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  allowPattern: {
    type: RegExp,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

function onInput(event) {
  const value = event.target.value
  const filteredValue = filterValue(value)

  if (filteredValue !== value) {
    event.target.value = filteredValue
  }

  emit('update:modelValue', filteredValue)
}

function onFocus(event) {
  emit('focus', event)
}

function onBlur(event) {
  emit('blur', event)
}

function filterValue(value) {
  if (props.allowPattern) {
    return Array.from(value)
      .filter((char) => props.allowPattern.test(char))
      .join('')
  }
  return value
}

function onBeforeInput(event) {
  if (!event.data || !props.allowPattern) {
    return
  }

  const nextValue = filterValue(event.data)

  if (nextValue !== event.data) {
    event.preventDefault()
  }
}
</script>

<template>
  <input
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :required="props.required"
    class="w-full rounded-md outline-none bg-white p-2.5 placeholder:text-[#353535] -tracking-tight"
    :class="{ 'cursor-not-allowed bg-slate-100 text-slate-400': props.disabled }"
    @input="onInput"
    @beforeinput="onBeforeInput"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>
