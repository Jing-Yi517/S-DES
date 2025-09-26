import { IP, IP_1, EP_Box, SP_Box, S_Box_1, S_Box_2 } from "@/utils/settings"


/**
 * 初次置换
 *
 * @param {*} message 明文
 * @returns {*} 置换后的八位字符串
 */
export const initialPermutation = (message) => {
  return IP.map(i => message[i - 1]).join('')
}


/**
 * 最终置换
 *
 * @param {*} message 经历两轮变换过后的字符串
 * @returns {*} 最终结果密文字符串
 */
export const lastPermutation = (message) => {
  return IP_1.map(i => message[i - 1]).join('')
}


/**
 * 轮函数实现
 *
 * @param {*} message 4bit 字符串
 * @param {*} key 密匙
 * @returns {*} 轮函数加密结果
 */
export const F = (message, key) => {
  try {
    console.log('F函数输入:', { message, key });
    
    if (message.length !== 4) throw new Error('message must be 4 bits')
    if (key.length !== 8) throw new Error('key must be 8 bits')

    // 1. 扩展置换 4 -> 8
    const expanded = EP_Box.map(i => message[i - 1])
    console.log('扩展置换结果:', expanded.join(''));

    // 2. 异或
    const xorResult = expanded.map((bit, idx) => {
      const result = (Number(bit) ^ Number(key[idx]))
      return result.toString()
    })
    console.log('异或结果:', xorResult.join(''));

    // 3. 分左右 4 位
    const left = xorResult.slice(0, 4)
    const right = xorResult.slice(4, 8)
    console.log('分割 - left:', left.join(''), 'right:', right.join(''));

    const sboxLookup = (input, sbox) => {
      const row = parseInt(input[0] + input[3], 2)
      const col = parseInt(input[1] + input[2], 2)
      const result = sbox[row][col].toString(2).padStart(2, '0')
      console.log(`S-Box查找: 行${row} 列${col} = ${result}`)
      return result
    }

    const sboxLeft = sboxLookup(left, S_Box_1)
    const sboxRight = sboxLookup(right, S_Box_2)

    // 4. 合并 S-Box 输出 + P4 置换
    const combined = (sboxLeft + sboxRight).split('')
    const finalResult = SP_Box.map(i => combined[i - 1]).join('')
    console.log('F函数最终结果:', finalResult);
    
    return finalResult
    
  } catch (error) {
    console.error('F函数错误:', error)
    throw error
  }
}


/**
 * 密文生成逻辑
 *
 * @param {*} message 明文
 * @param {*} key1 生成密匙1
 * @param {*} key2 生成密匙2
 * @returns {*} 密文
 */
export const encode = (message, key1, key2) => {
  try {
    console.log('encode 输入:', { message, key1, key2 });
    
    if (message.length !== 8) throw new Error('message must be 8 bits')
    if (key1.length !== 8) throw new Error('key1 must be 8 bits')
    if (key2.length !== 8) throw new Error('key2 must be 8 bits')

    // 1. 初始置换
    const ipResult = initialPermutation(message)
    console.log('初始置换结果:', ipResult);
    
    let left = ipResult.slice(0, 4)
    let right = ipResult.slice(4, 8)
    console.log('分割后 - left:', left, 'right:', right);

    // --- 第 1 轮 ---
    console.log('=== 第1轮开始 ===');
    const f1 = F(right, key1)
    console.log('F函数结果 f1:', f1);
    
    const leftArray = left.split('')
    const f1Array = f1.split('')
    console.log('left数组:', leftArray);
    console.log('f1数组:', f1Array);
    
    left = leftArray.map((bit, idx) => {
      const result = (Number(bit) ^ Number(f1Array[idx]))
      console.log(`位 ${idx}: ${bit} XOR ${f1Array[idx]} = ${result}`)
      return result.toString()
    }).join('')
    
    console.log('第1轮后 left:', left);

    // 2. 交换
    [left, right] = [right, left]
    console.log('交换后 - left:', left, 'right:', right);

    // --- 第 2 轮 ---
    console.log('=== 第2轮开始 ===');
    const f2 = F(right, key2)
    console.log('F函数结果 f2:', f2);
    
    left = left.split('').map((bit, idx) => {
      return (Number(bit) ^ Number(f2[idx])).toString()
    }).join('')
    
    console.log('第2轮后 left:', left);

    // 合并 + 最终置换
    const preoutput = left + right
    console.log('合并结果:', preoutput);
    
    const result = lastPermutation(preoutput)
    console.log('最终结果:', result);
    
    return result
    
  } catch (error) {
    console.error('encode 函数错误详情:', error)
    throw error
  }
}