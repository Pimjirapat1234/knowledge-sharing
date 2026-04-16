import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
  function show(t: Omit<Toast, 'id'>) {
    const id = ++idCounter
    const toast = { ...t, id }
    toasts.value.push(toast)
    const duration = t.duration ?? 3000
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }

  function dismiss(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const success = (title: string, message?: string) =>
    show({ type: 'success', title, message })
  const error = (title: string, message?: string) =>
    show({ type: 'error', title, message, duration: 5000 })
  const info = (title: string, message?: string) =>
    show({ type: 'info', title, message })
  const warning = (title: string, message?: string) =>
    show({ type: 'warning', title, message })

  return { toasts, show, dismiss, success, error, info, warning }
}
