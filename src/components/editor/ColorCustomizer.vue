<script setup lang="ts">
import { useSignatureStore } from '../../stores/signature'

const store = useSignatureStore()

const presets = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#111827',
]
</script>

<template>
  <div class="flex items-center gap-1.5 flex-wrap">
    <button
      v-for="color in presets"
      :key="color"
      @click="store.data.accentColor = color"
      class="w-5 h-5 rounded-full transition-all hover:scale-110 ring-offset-1"
      :class="store.data.accentColor === color ? 'ring-2 ring-gray-400' : ''"
      :style="{ backgroundColor: color }"
      :title="color"
    />
    <input
      type="color"
      v-model="store.data.accentColor"
      title="Custom color"
      class="w-5 h-5 rounded-full cursor-pointer border border-gray-200 p-0 overflow-hidden bg-transparent"
      style="appearance:none; -webkit-appearance:none;"
    />
  </div>
</template>
