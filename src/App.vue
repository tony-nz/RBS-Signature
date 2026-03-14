<script setup lang="ts">
import { computed } from 'vue'
import TemplatePicker from './components/editor/TemplatePicker.vue'
import FieldEditor from './components/editor/FieldEditor.vue'
import SignaturePreview from './components/preview/SignaturePreview.vue'
import ExportPanel from './components/export/ExportPanel.vue'
import { useSignatureStore } from './stores/signature'

const store = useSignatureStore()

const savedLabel = computed(() => {
  if (!store.lastSaved) return null
  return store.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <!-- Header + Template Picker -->
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white flex items-center shadow-sm">
      <!-- Branding: matches aside width exactly -->
      <div class="w-72 flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 border-r border-slate-200">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="leading-tight">
          <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Email</div>
          <div class="text-sm font-bold text-slate-800 tracking-tight">Signature Generator</div>
        </div>
      </div>
      <!-- Template picker + saved indicator -->
      <div class="flex-1 flex items-center gap-4 px-5 py-2.5">
        <TemplatePicker />
        <div class="ml-auto flex items-center gap-1.5 text-xs text-slate-400" v-if="savedLabel">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Saved {{ savedLabel }}
        </div>
      </div>
    </header>

    <!-- Main: Editor + Preview -->
    <main class="flex flex-1 overflow-hidden">

      <!-- Left: Field Editor -->
      <aside class="w-72 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
        <FieldEditor />
      </aside>

      <!-- Right: Preview + Export -->
      <section class="flex-1 flex flex-col overflow-hidden p-5 gap-4 bg-slate-50">
        <div class="flex-1 min-h-0">
          <SignaturePreview />
        </div>
        <div class="flex-shrink-0">
          <ExportPanel />
        </div>
      </section>

    </main>
  </div>
</template>
