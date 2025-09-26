const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6]
const P8 = [6, 3, 7, 4, 8, 5, 10, 9]


/**
 * 10-bit置换盒
 *
 * @param {string} key 二进制字符串 
 * @returns {string} 置换后的二进制字符串
 */
export function permutation10(key) {
  const keyArray = key.split('')
  return P10.map(i => keyArray[i - 1]).join('')
}

export function permutation8(key) {
  const keyArray = key.split('')
  return P8.map(i => keyArray[i - 1]).join('')
}


/**
 * 循环左移函数
 *
 * @param {*} str 数据字符串
 * @param {*} n 移动位数
 * @returns {*} 
 */
function leftShift(str, n) {
  return str.slice(n) + str.slice(0, n)
}

export function getKeys(key) {
  const resultP10 = permutation10(key)

  // 分成左右两半
  let left = resultP10.slice(0, 5)  // 前5位
  let right = resultP10.slice(5, 10) // 后5位

  // 第一次左移 1 位
  left = leftShift(left, 1)
  right = leftShift(right, 1)

  // 拼接后过P8 → K1
  const key1 = permutation8(left + right)

  // 第二次左移 2 位
  left = leftShift(left, 1)
  right = leftShift(right, 1)

  // 拼接后过P8 → K2
  const key2 = permutation8(left + right)

  return { key1, key2 }
}