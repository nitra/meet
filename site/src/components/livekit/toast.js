import { shallowRef } from 'vue'

const toasts = shallowRef([])
let hideTimer = null

export function useToast() {
  function toast(message, options = {}) {
    const id = Math.random().toString(36).slice(2)
    const duration = options.duration ?? 3000
    const entry = {
      id,
      message,
      icon: options.icon,
      className: options.className,
      style: options.style
    }
    toasts.value = [...toasts.value, entry]
    if (duration > 0) {
      if (hideTimer) clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, duration)
    }
    return () => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }
  }
  toast.error = (message, opts = {}) =>
    toast(message, {
      ...opts,
      icon: '❌',
      className: opts.className ?? 'lk-button',
      style: { backgroundColor: 'var(--lk-danger3)', color: 'var(--lk-fg)', ...opts.style }
    })
  return { toasts, toast }
}

export const toastsRef = toasts
