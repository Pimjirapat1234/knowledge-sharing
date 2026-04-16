/**
 * Thai-first formatters per PRD §15.7.5 and §9.6
 */

const MONTHS_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

export function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${d.getFullYear()}`
}

export function formatTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso)} เวลา ${formatTime(iso)}`
}

export function formatDateRange(startIso: string, endIso: string) {
  const s = new Date(startIso)
  const e = new Date(endIso)
  const hhS = String(s.getHours()).padStart(2, '0')
  const mmS = String(s.getMinutes()).padStart(2, '0')
  const hhE = String(e.getHours()).padStart(2, '0')
  const mmE = String(e.getMinutes()).padStart(2, '0')
  return `${formatDate(startIso)} · ${hhS}:${mmS}–${hhE}:${mmE} น.`
}

export function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function pluralTh(n: number, unit: string) {
  return `${formatNumber(n)} ${unit}`
}
