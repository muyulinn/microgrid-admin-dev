const rule = {}

// 验证elementUi表单输入

function innerValidate(check) {
  return (rule, value, callback) => {
    try {
      check(rule, value)
      callback()
    } catch (e) {
      callback(e)
    }
  }
}

/**
 * 断言
 * @param {*} condition
 * @param {*} msg
 */
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg)
  }
}

// 验证是否为空
rule.noEmpty = innerValidate((rule, value) => {
  assert(value && value !== '', '请完整填写该项')
})

// 正整数
rule.mustInt = (rule, value, callback) => {
  const exp = /^\+?[1-9][0-9]*$/
  exp.test(value) ? callback() : callback(new Error('请填写正确格式(正整数)'))
}

// 钱正则
rule.money = (rule, value, callback) => {
  const exp = /^[1-9]+\d*(\.\d{0,2})?$|^0?\.\d{0,2}$/
  exp.test(value) ? callback() : callback(new Error('请填写正确格式(正数,小数点后最多两位)'))
}

// 电话正则
rule.telExe = (rule, value, callback) => {
  const txe = /^1[3456789]\d{9}$/
  txe.test(value) ? callback() : callback(new Error('手机号格式不正确'))
}

// 身份证正则
rule.identity = (rule, value, callback) => {
  const id = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  id.test(value) ? callback() : callback(new Error('请输入合法身份证号码'))
}

rule.numAndLetter = innerValidate((rule, value) => {
  assert(/^[0-9a-zA-Z]+$/.test(value), '请输入数字和字母组合')
})

export default rule

export function initValidate(check, opt = {}) {
  return {
    validator: innerValidate((rule, val) => check(val, assert)),
    trigger: ['blur', 'change'],
    // message: '数据格式不正确',
    ...opt
  }
}
export function regExpValidate(reg, opt) {
  if (typeof opt === 'string') {
    opt = { message: opt }
  }
  return initValidate(val => assert(reg.test(val), opt.message), opt)
}

export const required = {
  required: true, message: '选项必填', trigger: ['blur', 'change']
}
export const emailType = {
  required: true, type: 'email', trigger: ['blur', 'change']
}
export const numAndLetter = {
  validator: rule.numAndLetter, trigger: ['blur', 'change']
}

export const array = {
  type: 'array', required: true, message: '请至少选择一选', trigger: ['blur', 'change']
}
export const numberOnly = initValidate(val => {
  assert(/^\+?[1-9][0-9]*$/.test(val), '请输入数字')
})

export const letterOnly = initValidate(val => {
  assert(/^[a-zA-Z]*$/.test(val), '请输入字母')
})
export const moneyNumber = initValidate(val => {
  assert(/((^[1-9]\d*)|^0)(\.\d{0,3}){0,1}$/.test(val), '请输入有效金额')
})

export const doubleOnly = initValidate(val => {
  assert(val * 0 + 1 > 0, '请输入数字')
})
