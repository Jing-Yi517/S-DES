import { getKeys } from './key'
import { encode } from './encode'

/**
 * 单线程暴力破解
 *
 * @param {string} message - 明文
 * @param {string} cipher  - 密文
 * @param {Object} settings - 可选配置
 *    settings.all {boolean} - 是否返回所有可能 key（默认 false：找到第一个就停）
 *
 * @returns {Object} { found: [{key10, key1, key2}], elapsedMs, startISO, endISO }
 */
export const brute = (message, cipher, settings = {}) => {
  const { all = false, onProgress = null } = settings || {}

  // 严格校验：必须是单个 8-bit 二进制字符串
  if (typeof message !== 'string' || !/^[01]{8}$/.test(message)) {
    throw new Error('message must be a single 8-bit binary string, e.g. "01000001"')
  }
  if (typeof cipher !== 'string' || !/^[01]{8}$/.test(cipher)) {
    throw new Error('cipher must be a single 8-bit binary string, e.g. "10010001"')
  }

  const total = 1 << 10 // 1024
  const found = []

  const startISO = new Date().toISOString()
  const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()

  for (let k = 0; k < total; k++) {
    const key10 = k.toString(2).padStart(10, '0')
    const { key1, key2 } = getKeys(key10)

    const c = encode(message, key1, key2) // encode 返回 8-bit 字符串
    if (c === cipher) {
      found.push({ key10, key1, key2 })
      if (!all) break
    }
  }

  const t1 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
  const endISO = new Date().toISOString()
  const elapsedMs = Math.round(t1 - t0)

  return {
    found,
    elapsedMs,
    startISO,
    endISO
  }
}