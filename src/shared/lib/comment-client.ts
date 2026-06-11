const COMMENT_DEVICE_ID_KEY = 'stellux-comment-device-id'

type CommentStorage = Pick<Storage, 'getItem' | 'setItem'>
type CommentCrypto = Pick<Crypto, 'randomUUID'> | undefined

function rotateLeft(value: number, shift: number) {
  return (value << shift) | (value >>> (32 - shift))
}

function addUnsigned(left: number, right: number) {
  return (left + right) >>> 0
}

function md5Cycle(state: number[], block: number[]) {
  let [a, b, c, d] = state

  const ff = (x: number, y: number, z: number) => (x & y) | (~x & z)
  const gg = (x: number, y: number, z: number) => (x & z) | (y & ~z)
  const hh = (x: number, y: number, z: number) => x ^ y ^ z
  const ii = (x: number, y: number, z: number) => y ^ (x | ~z)
  const cmn = (q: number, x: number, y: number, s: number, t: number) =>
    addUnsigned(rotateLeft(addUnsigned(addUnsigned(x, q), t), s), y)

  const step = (
    fn: (x: number, y: number, z: number) => number,
    x: number,
    y: number,
    z: number,
    w: number,
    blockIndex: number,
    shift: number,
    constant: number
  ) => cmn(fn(y, z, w), x, y, shift, addUnsigned(block[blockIndex], constant))

  a = step(ff, a, b, c, d, 0, 7, 0xd76aa478)
  d = step(ff, d, a, b, c, 1, 12, 0xe8c7b756)
  c = step(ff, c, d, a, b, 2, 17, 0x242070db)
  b = step(ff, b, c, d, a, 3, 22, 0xc1bdceee)
  a = step(ff, a, b, c, d, 4, 7, 0xf57c0faf)
  d = step(ff, d, a, b, c, 5, 12, 0x4787c62a)
  c = step(ff, c, d, a, b, 6, 17, 0xa8304613)
  b = step(ff, b, c, d, a, 7, 22, 0xfd469501)
  a = step(ff, a, b, c, d, 8, 7, 0x698098d8)
  d = step(ff, d, a, b, c, 9, 12, 0x8b44f7af)
  c = step(ff, c, d, a, b, 10, 17, 0xffff5bb1)
  b = step(ff, b, c, d, a, 11, 22, 0x895cd7be)
  a = step(ff, a, b, c, d, 12, 7, 0x6b901122)
  d = step(ff, d, a, b, c, 13, 12, 0xfd987193)
  c = step(ff, c, d, a, b, 14, 17, 0xa679438e)
  b = step(ff, b, c, d, a, 15, 22, 0x49b40821)

  a = step(gg, a, b, c, d, 1, 5, 0xf61e2562)
  d = step(gg, d, a, b, c, 6, 9, 0xc040b340)
  c = step(gg, c, d, a, b, 11, 14, 0x265e5a51)
  b = step(gg, b, c, d, a, 0, 20, 0xe9b6c7aa)
  a = step(gg, a, b, c, d, 5, 5, 0xd62f105d)
  d = step(gg, d, a, b, c, 10, 9, 0x02441453)
  c = step(gg, c, d, a, b, 15, 14, 0xd8a1e681)
  b = step(gg, b, c, d, a, 4, 20, 0xe7d3fbc8)
  a = step(gg, a, b, c, d, 9, 5, 0x21e1cde6)
  d = step(gg, d, a, b, c, 14, 9, 0xc33707d6)
  c = step(gg, c, d, a, b, 3, 14, 0xf4d50d87)
  b = step(gg, b, c, d, a, 8, 20, 0x455a14ed)
  a = step(gg, a, b, c, d, 13, 5, 0xa9e3e905)
  d = step(gg, d, a, b, c, 2, 9, 0xfcefa3f8)
  c = step(gg, c, d, a, b, 7, 14, 0x676f02d9)
  b = step(gg, b, c, d, a, 12, 20, 0x8d2a4c8a)

  a = step(hh, a, b, c, d, 5, 4, 0xfffa3942)
  d = step(hh, d, a, b, c, 8, 11, 0x8771f681)
  c = step(hh, c, d, a, b, 11, 16, 0x6d9d6122)
  b = step(hh, b, c, d, a, 14, 23, 0xfde5380c)
  a = step(hh, a, b, c, d, 1, 4, 0xa4beea44)
  d = step(hh, d, a, b, c, 4, 11, 0x4bdecfa9)
  c = step(hh, c, d, a, b, 7, 16, 0xf6bb4b60)
  b = step(hh, b, c, d, a, 10, 23, 0xbebfbc70)
  a = step(hh, a, b, c, d, 13, 4, 0x289b7ec6)
  d = step(hh, d, a, b, c, 0, 11, 0xeaa127fa)
  c = step(hh, c, d, a, b, 3, 16, 0xd4ef3085)
  b = step(hh, b, c, d, a, 6, 23, 0x04881d05)
  a = step(hh, a, b, c, d, 9, 4, 0xd9d4d039)
  d = step(hh, d, a, b, c, 12, 11, 0xe6db99e5)
  c = step(hh, c, d, a, b, 15, 16, 0x1fa27cf8)
  b = step(hh, b, c, d, a, 2, 23, 0xc4ac5665)

  a = step(ii, a, b, c, d, 0, 6, 0xf4292244)
  d = step(ii, d, a, b, c, 7, 10, 0x432aff97)
  c = step(ii, c, d, a, b, 14, 15, 0xab9423a7)
  b = step(ii, b, c, d, a, 5, 21, 0xfc93a039)
  a = step(ii, a, b, c, d, 12, 6, 0x655b59c3)
  d = step(ii, d, a, b, c, 3, 10, 0x8f0ccc92)
  c = step(ii, c, d, a, b, 10, 15, 0xffeff47d)
  b = step(ii, b, c, d, a, 1, 21, 0x85845dd1)
  a = step(ii, a, b, c, d, 8, 6, 0x6fa87e4f)
  d = step(ii, d, a, b, c, 15, 10, 0xfe2ce6e0)
  c = step(ii, c, d, a, b, 6, 15, 0xa3014314)
  b = step(ii, b, c, d, a, 13, 21, 0x4e0811a1)
  a = step(ii, a, b, c, d, 4, 6, 0xf7537e82)
  d = step(ii, d, a, b, c, 11, 10, 0xbd3af235)
  c = step(ii, c, d, a, b, 2, 15, 0x2ad7d2bb)
  b = step(ii, b, c, d, a, 9, 21, 0xeb86d391)

  state[0] = addUnsigned(state[0], a)
  state[1] = addUnsigned(state[1], b)
  state[2] = addUnsigned(state[2], c)
  state[3] = addUnsigned(state[3], d)
}

function md5(input: string) {
  const bytes = Array.from(new TextEncoder().encode(input))
  const bitLength = bytes.length * 8
  bytes.push(0x80)

  while (bytes.length % 64 !== 56) {
    bytes.push(0)
  }

  for (let i = 0; i < 8; i += 1) {
    bytes.push(Math.floor(bitLength / 2 ** (8 * i)) & 0xff)
  }

  const state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const block = new Array<number>(16).fill(0)
    for (let i = 0; i < 64; i += 1) {
      block[i >> 2] |= bytes[offset + i] << ((i % 4) * 8)
    }
    md5Cycle(state, block)
  }

  return state
    .flatMap((value) => [
      value & 0xff,
      (value >>> 8) & 0xff,
      (value >>> 16) & 0xff,
      (value >>> 24) & 0xff,
    ])
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

function createFallbackId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function getBrowserFingerprintSeed() {
  const nav = globalThis.navigator
  const screen = globalThis.screen
  const location = globalThis.location

  return [
    nav?.userAgent,
    nav?.language,
    nav?.platform,
    nav?.hardwareConcurrency,
    screen?.width,
    screen?.height,
    screen?.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    location?.hostname,
  ]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .join('|')
}

export function getCommentAvatarUrl(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) {
    return ''
  }

  return `https://weavatar.com/avatar/${md5(normalizedEmail)}?s=80&d=wavatar`
}

export function getCommentDeviceId(
  storage: CommentStorage | undefined = globalThis.localStorage,
  cryptoSource: CommentCrypto = globalThis.crypto
) {
  try {
    const existing = storage?.getItem(COMMENT_DEVICE_ID_KEY)?.trim()
    if (existing) {
      return existing
    }
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  const rawId = cryptoSource?.randomUUID?.() ?? createFallbackId()
  const fingerprintSeed = getBrowserFingerprintSeed()
  const deviceId = `comment-device-${md5(`${fingerprintSeed}|${rawId}`)}`

  try {
    storage?.setItem(COMMENT_DEVICE_ID_KEY, deviceId)
  } catch {
    // A transient id is still better than blocking the comment form.
  }

  return deviceId
}
