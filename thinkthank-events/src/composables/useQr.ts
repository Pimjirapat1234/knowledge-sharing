import QRCode from 'qrcode'

/**
 * QR code payload for event check-in.
 * Contains everything HR needs to identify + verify participant at entry.
 * In production: include signed hash for tamper-proof.
 */
export interface QrPayload {
  v: 1                     // version
  eventId: string
  regId: string            // registration id
  userId: string
  name: string
  email: string
  dept: string
  event: {
    title: string
    startAt: string
    location: string
  }
  menuId?: string
  allergy?: string
  groupId?: string
  sig: string              // mock signature for demo
}

/** Generate QR payload for a participant registration */
export function buildQrPayload(params: {
  eventId: string
  userId: string
  name: string
  email: string
  dept: string
  eventTitle: string
  eventStart: string
  eventLocation: string
  menuId?: string
  allergy?: string
  groupId?: string
}): QrPayload {
  const regId = `reg-${params.eventId}-${params.userId}`
  // Mock signature — in prod would be HMAC(payload, secret)
  const sig = btoa(`${regId}-${Date.now()}`).slice(0, 16)
  return {
    v: 1,
    eventId: params.eventId,
    regId,
    userId: params.userId,
    name: params.name,
    email: params.email,
    dept: params.dept,
    event: {
      title: params.eventTitle,
      startAt: params.eventStart,
      location: params.eventLocation,
    },
    menuId: params.menuId,
    allergy: params.allergy,
    groupId: params.groupId,
    sig,
  }
}

/** Encode payload to string for QR */
export function encodeQrPayload(p: QrPayload): string {
  return 'TTEV://' + btoa(unescape(encodeURIComponent(JSON.stringify(p))))
}

/** Parse string back to payload · returns null if invalid */
export function parseQrPayload(raw: string): QrPayload | null {
  try {
    if (!raw.startsWith('TTEV://')) return null
    const json = decodeURIComponent(escape(atob(raw.slice(7))))
    const parsed = JSON.parse(json) as QrPayload
    if (parsed.v !== 1 || !parsed.regId || !parsed.userId) return null
    return parsed
  } catch { return null }
}

/** Generate QR code as data URL (PNG) */
export async function qrToDataUrl(payload: QrPayload, opts?: { size?: number; margin?: number; color?: string }): Promise<string> {
  const encoded = encodeQrPayload(payload)
  return QRCode.toDataURL(encoded, {
    width: opts?.size ?? 300,
    margin: opts?.margin ?? 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: opts?.color ?? '#231F20',
      light: '#FFFFFF',
    },
  })
}

/** Generate QR code as SVG string (sharp, scalable) */
export async function qrToSvg(payload: QrPayload, opts?: { color?: string; margin?: number }): Promise<string> {
  const encoded = encodeQrPayload(payload)
  return QRCode.toString(encoded, {
    type: 'svg',
    margin: opts?.margin ?? 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: opts?.color ?? '#231F20',
      light: '#FFFFFF',
    },
  })
}
