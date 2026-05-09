/**
 * 将 enum 转为全局 filter
 * by lcs
 * 2021-02-28
 */

import Vue from 'vue'

export const initEnumFilter = enumData => {
  Object.keys(enumData).forEach(key1 => {
    Object.keys(enumData[key1]).forEach(key2 => {
      Vue.filter(`${key1}.${key2}`, val => {
        return enumData[key1][key2].filter(item => item.val === val).map(item => item.desc)[0]
      })
    })
  })
}
