<script setup>
import { ref } from 'vue'
import { getKeys } from '@/utils/key'
import { encode } from '@/utils/encode'
import { ElMessage } from 'element-plus'
import { decode } from '@/utils/decode'

const cipherModeList = ['simple','ASCII','decode']
const cipherMode = ref('simple')
const formModel = ref({
  simple:'',
  ASCII:'',
  decode:'',
  key:'',
  result:''
})
const form = ref(null)

const rules = {
  key: [
    { required: true, message: '请输入密钥', trigger: 'blur' },
    { pattern: /^[01]{10}$/, message: '密钥必须是10位二进制', trigger: 'blur' }
  ],
  simple: [
    {
      validator: (rule, value, callback) => {
        if (cipherMode.value === 'simple') {
          if (!value) {
            return callback(new Error('请输入8位二进制数据'))
          }
          if (!/^[01]{8}$/.test(value)) {
            return callback(new Error('数据必须是8位二进制'))
          }
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  decode: [
    {
      validator: (rule, value, callback) => {
        if (cipherMode.value === 'decode') {
          if (!value) {
            return callback(new Error('请输入8位二进制数据'))
          }
          if (!/^[01]{8}$/.test(value)) {
            return callback(new Error('数据必须是8位二进制'))
          }
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
}

const switchCipherModel = () => {
  const index = cipherModeList.indexOf(cipherMode.value)
  if(index !== -1){
    if(index !== 2){
      cipherMode.value = cipherModeList[index+1]
    } else {
      cipherMode.value = cipherModeList[index-2]
    }
  }
}

const execute = async () => {
  try {
    await form.value.validate()
    
    if (cipherMode.value === 'simple') {
      // 加密模式
      const keys = getKeys(formModel.value.key)
      const encodeMessage = encode(formModel.value.simple, keys.key1, keys.key2)
      console.log('加密结果:', encodeMessage)
      formModel.value.result = encodeMessage
    } else if (cipherMode.value === 'decode') {
      // 解密模式
      const keys = getKeys(formModel.value.key)
      const decodeMessage = decode(formModel.value.decode, keys.key1, keys.key2)
      console.log('解密结果:', decodeMessage)
      formModel.value.result = decodeMessage
    } else if (cipherMode.value === 'ASCII') {
      // ASCII模式处理
      if (!formModel.value.ASCII) {
        ElMessage({type:'error', message: '请输入ASCII字符串'})
        return
      }
      // 这里需要实现ASCII到二进制的转换和加密逻辑
      ElMessage({type:'info', message: 'ASCII模式功能待实现'})
    }
  } catch (err) {
    console.error('执行错误:', err)
    ElMessage({type:'error', message: err.message || String(err)})
  }
}
</script>

<template>
  <div class="app-container">
    <el-row class="row">
      <el-col :offset="4" :span="16" class="col">
        <el-form class="form" :model="formModel" :rules="rules" ref="form">
          <h2 class="title">S-DES加密算法 
            <span>当前模式：{{ 
              cipherMode === 'decode' ? '解密模式' : 
              cipherMode === 'ASCII' ? 'ASCII模式' : '加密模式' 
            }}</span>
          </h2>
          
          <el-form-item v-if="cipherMode ==='simple'" prop="simple">
            <el-input placeholder="请输入需要加密的8-bit数据" size="large" v-model="formModel.simple"></el-input>
          </el-form-item>
          
          <el-form-item v-else-if="cipherMode === 'ASCII'" prop="ASCII">
            <el-input placeholder="请随意输入ASCII字符串" size="large" v-model="formModel.ASCII"></el-input>
          </el-form-item>
          
          <el-form-item v-else prop="decode">
            <el-input placeholder="请输入要解密的8-bit数据" size="large" v-model="formModel.decode"></el-input>
          </el-form-item>
          
          <el-form-item prop="key">
            <el-input placeholder="请输入10-bit密匙" size="large" v-model="formModel.key"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-input placeholder="这里会显示结果" size="large" v-model="formModel.result" readonly></el-input>
          </el-form-item>

          <el-form-item class="btn">
            <!-- 修正按钮类型 -->
            <el-button type="primary" @click="execute">
              {{ cipherMode === 'decode' ? '开始解密' : '开始加密' }}
            </el-button>
            <el-button @click="switchCipherModel">切换模式</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>


<style scoped>
.row{
  height: 700px;
  margin-top: 150px;
}
.col{
  background-color: rgb(169,169,169);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form{
  width: 500px;
  display: block;
  text-align: center;
}
:deep(.btn .el-form-item__content){
  justify-content: space-around;
}
</style>