const EXAM_WINDOW_NAME = 'psycho-test-exam'

export function openExamWindow(url: string) {
  const width = Math.min(1400, window.screen.availWidth - 80)
  const height = Math.min(900, window.screen.availHeight - 80)
  const left = Math.round((window.screen.availWidth - width) / 2)
  const top = Math.round((window.screen.availHeight - height) / 2)

  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'scrollbars=yes',
    'resizable=yes',
  ].join(',')

  return window.open(url, EXAM_WINDOW_NAME, features)
}

export function isExamPopupWindow() {
  return typeof window !== 'undefined' && Boolean(window.opener)
}
