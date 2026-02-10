<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="rounded-md font-semibold transition -tracking-tight bg-[#519945] text-white px-8 py-2.5"
    :class="{ 'cursor-not-allowed opacity-60': props.disabled }"
  >
    <slot />
  </button>
</template>
