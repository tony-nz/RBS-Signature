import { defineStore } from 'pinia'
import { reactive, ref, computed, watch } from 'vue'
import type { SignatureData } from '../types'
import { templates } from '../templates'

const STORAGE_KEY = 'signature-generator'

const defaults: SignatureData = {
  name: 'Jane Smith',
  title: 'Marketing Manager',
  company: 'Acme Corp',
  email: 'jane@acmecorp.com',
  phone: '+1 (555) 000-0000',
  mobile: '',
  website: 'acmecorp.com',
  address: '',
  tagline: '',
  meetingUrl: '',
  meetingLabel: 'Book a meeting',
  disclaimer: '<strong>Important:</strong> The contents of this email message and any attachments may be confidential and/or privileged information. The contents are intended for the original email recipients only. If you have received this email in error, please contact COMPANY_NAME_HERE immediately and delete this email. Thank you.',
  avatar: '',
  logo: '',
  socials: { linkedin: '', twitter: '', github: '', instagram: '', youtube: '', tiktok: '' },
  accentColor: '#6366f1',
  fieldColors: { name: '#111827', title: '#6b7280', body: '#374151', muted: '#9ca3af' },
  cta: { text: 'Book a Meeting', url: '', bgColor: '#6366f1', textColor: '#ffffff' },
  style: {
    fontFamily: 'Arial',
    fontSize: 'md',
    fontSizeCustomPx: 13,
    avatarShape: 'circle',
    avatarSize: 'md',
    avatarSizeCustomPx: 56,
    logoSize: 'md',
    logoSizeCustomPx: 56,
    dividerStyle: 'line',
    socialStyle: 'icons',
  },
  visibility: {
    avatar: true,
    logo: false,
    socials: false,
    meetingUrl: false,
    cta: false,
    disclaimer: false,
    divider: true,
  },
}

function loadSaved(): { data: SignatureData; templateId: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: { ...defaults }, templateId: 'modern' }
    const saved = JSON.parse(raw)
    return {
      data: {
        ...defaults,
        ...saved.data,
        socials: { ...defaults.socials, ...saved.data?.socials },
        cta: { ...defaults.cta, ...saved.data?.cta },
        style: { ...defaults.style, ...saved.data?.style },
        visibility: { ...defaults.visibility, ...saved.data?.visibility },
        fieldColors: { ...defaults.fieldColors, ...saved.data?.fieldColors },
      },
      templateId: saved.templateId ?? 'modern',
    }
  } catch {
    return { data: { ...defaults }, templateId: 'modern' }
  }
}

export const useSignatureStore = defineStore('signature', () => {
  const saved = loadSaved()

  const data = reactive<SignatureData>(saved.data)
  const selectedTemplateId = ref(saved.templateId)

  const selectedTemplate = computed(
    () => templates.find((t) => t.id === selectedTemplateId.value) ?? templates[0]
  )

  const renderedHtml = computed(() => selectedTemplate.value.render(data))

  function selectTemplate(id: string) {
    selectedTemplateId.value = id
  }

  // Auto-save with debounce
  const lastSaved = ref<Date | null>(saved ? new Date() : null)
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  watch(
    [() => JSON.stringify(data), selectedTemplateId],
    () => {
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, templateId: selectedTemplateId.value }))
        lastSaved.value = new Date()
      }, 500)
    },
    { deep: true }
  )

  function resetToDemo(): void {
    const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="60" fill="#6366f1"/><text x="60" y="76" text-anchor="middle" font-family="Arial" font-size="42" font-weight="bold" fill="white">JS</text></svg>`
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="44"><rect width="160" height="44" rx="6" fill="#6366f1"/><text x="80" y="30" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="white">ACME</text></svg>`
    const demoAvatar = `data:image/svg+xml;base64,${btoa(avatarSvg)}`
    const demoLogo = `data:image/svg+xml;base64,${btoa(logoSvg)}`

    Object.assign(data, {
      ...defaults,
      avatar: demoAvatar,
      logo: demoLogo,
      tagline: 'Making the world a better place, one campaign at a time.',
      phone: '+1 (555) 000-0000',
      mobile: '+1 (555) 111-2222',
      website: 'acmecorp.com',
      address: '123 Main St, San Francisco, CA 94105',
      meetingUrl: 'https://cal.com/janesmith',
      meetingLabel: 'Book a meeting',
      socials: { linkedin: 'janesmith', twitter: 'janesmith', github: '', instagram: '', youtube: '', tiktok: '' },
      cta: { text: 'View Portfolio', url: 'https://acmecorp.com', bgColor: '#6366f1', textColor: '#ffffff' },
      accentColor: '#6366f1',
      fieldColors: { ...defaults.fieldColors },
      style: { ...defaults.style },
      visibility: {
        avatar: true,
        logo: true,
        socials: true,
        meetingUrl: true,
        cta: true,
        disclaimer: false,
        divider: true,
      },
    })
    selectedTemplateId.value = 'modern'
  }

  function exportSettings(): void {
    const payload = JSON.stringify({ data, templateId: selectedTemplateId.value }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'signature-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importSettings(json: string): void {
    const parsed = JSON.parse(json)
    const incoming = {
      data: {
        ...defaults,
        ...parsed.data,
        socials: { ...defaults.socials, ...parsed.data?.socials },
        cta: { ...defaults.cta, ...parsed.data?.cta },
        style: { ...defaults.style, ...parsed.data?.style },
        visibility: { ...defaults.visibility, ...parsed.data?.visibility },
        fieldColors: { ...defaults.fieldColors, ...parsed.data?.fieldColors },
      },
      templateId: parsed.templateId ?? 'modern',
    }
    Object.assign(data, incoming.data)
    selectedTemplateId.value = incoming.templateId
  }

  return { data, selectedTemplateId, selectedTemplate, renderedHtml, selectTemplate, lastSaved, exportSettings, importSettings, resetToDemo }
})
