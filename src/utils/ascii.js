import { encode } from "./encode"


/**
 * 将ASCII码字符串转化为二进制字符串
 *
 * @param {*} str ASCII码字符串
 * @returns {*} 二进制字符串
 */
export const asciiToBinary = (str) => {
  return str.split('').map((value)=>{
    return value.charCodeAt(0).toString(2).padStart(8, '0') // 如果不足八位，前面补0
  }).join('')
}

/**
 * 对二进制字符串进行分组
 * @param {*} str 需要分组的字符串
 * @param {*} size 分组大小
 * @returns 分组完成的数组
 */
export const chunkString = (str, size) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

/**
 * ASCII加密 S-DES算法
 *
 * @param {*} str 需要加密的ASCII字符串
 * @param {*} key1 密钥1
 * @param {*} key2 密钥2
 * @returns {*} ASCII字符串
 */
export const encodeAscii = (str, key1, key2) => {
  const binaryStr = asciiToBinary(str)
  const chunks = chunkString(binaryStr, 8)

  const encrypted = chunks.map((value) => {
    const bin = encode(value, key1, key2) // 得到8位二进制
    return String.fromCharCode(parseInt(bin, 2)) // 转成ASCII字符
  })

  return encrypted.join('')
}