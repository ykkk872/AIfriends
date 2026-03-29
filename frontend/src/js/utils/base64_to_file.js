/**
 * 将 data URL 或纯 base64 转为 File，供 FormData 上传。
 */
export function base64ToFile(base64, filename = 'image.png') {
  if (!base64 || typeof base64 !== 'string') {
    throw new TypeError('base64ToFile: expected non-empty string')
  }
  const parts = base64.split(',')
  const payload = parts.length > 1 ? parts[1] : parts[0]
  const mimeMatch = parts[0]?.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const binary = atob(payload)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new File([bytes], filename, { type: mime })
}
