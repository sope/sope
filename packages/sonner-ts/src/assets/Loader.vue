<script lang="ts" setup>
const bars = Array(12).fill(0)

defineProps<{
  visible: boolean
}>()
</script>

<template>
  <div class="sonner-loading-wrapper" :data-visible="visible">
    <div class="sonner-spinner">
      <template v-for="_bar in bars" :key="`spinner-bar-${bar}`">
        <div class="sonner-loading-bar" />
      </template>
    </div>
  </div>
</template>
