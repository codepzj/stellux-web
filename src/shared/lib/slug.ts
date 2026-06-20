import { pinyin } from 'pinyin-pro'

const HAN_CHARACTER_RE = /[\u3400-\u9fff]/

export function createAliasFromTitle(title: string) {
  let pinyinText = ''
  let hanText = ''

  for (const char of title) {
    if (HAN_CHARACTER_RE.test(char)) {
      hanText += char
      continue
    }

    if (hanText) {
      pinyinText += ` ${pinyin(hanText, { toneType: 'none', separator: ' ' })} `
      hanText = ''
    }
    pinyinText += char
  }

  if (hanText) {
    pinyinText += ` ${pinyin(hanText, { toneType: 'none', separator: ' ' })} `
  }

  return pinyinText
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
