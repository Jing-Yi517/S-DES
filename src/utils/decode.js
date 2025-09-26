import { IP, IP_1, EP_Box, SP_Box, S_Box_1, S_Box_2 } from "@/utils/settings"
import { F ,initialPermutation,lastPermutation } from "@/utils/encode"



/**
 * 密文解析
 *
 * @param {*} cipher 密文
 * @param {*} key1 生成密匙1
 * @param {*} key2 生成密匙2
 * @returns {*} 明文
 */
export const decode = (cipher, key1, key2) => {
  try {
    console.log('decode 输入:', { cipher, key1, key2 });
    
    if (cipher.length !== 8) throw new Error('cipher must be 8 bits')
    if (key1.length !== 8) throw new Error('key1 must be 8 bits')
    if (key2.length !== 8) throw new Error('key2 must be 8 bits')

    // 1. 初始置换（与加密相同）
    const ipResult = initialPermutation(cipher)
    console.log('初始置换结果:', ipResult);
    
    let left = ipResult.slice(0, 4)
    let right = ipResult.slice(4, 8)
    console.log('分割后 - left:', left, 'right:', right);

    // --- 第 1 轮（使用 key2）---
    console.log('=== 第1轮开始（解密使用key2）===');
    const f1 = F(right, key2)  // 解密时先使用key2
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

    // --- 第 2 轮（使用 key1）---
    console.log('=== 第2轮开始（解密使用key1）===');
    const f2 = F(right, key1)  // 解密时后使用key1
    console.log('F函数结果 f2:', f2);
    
    left = left.split('').map((bit, idx) => {
      return (Number(bit) ^ Number(f2[idx])).toString()
    }).join('')
    
    console.log('第2轮后 left:', left);

    // 合并 + 最终置换
    const preoutput = left + right
    console.log('合并结果:', preoutput);
    
    const result = lastPermutation(preoutput)
    console.log('解密结果:', result);
    
    return result
    
  } catch (error) {
    console.error('decode 函数错误详情:', error)
    throw error
  }
}