const { compile } = require('vue-template-compiler')

/**
   * 解析所有有 v-permission 指令的组件
   * @param {*} ast
   * @returns
   */
const getPermissionButtonList = ast => {
  if (!ast?.attrsList) return []

  let attr = ast.attrsList.find(({ name }) => name === 'v-permission')
  if (attr) {
    let attrText
    if (ast?.children[0]?.type === 3) {
      attrText = ast.children[0].text.trim()
    } else {
      attrText = (ast.attrsList.find(({ name }) => ['label', 'v-text', 'v-html'].find(n => n === name)) || attr).value
    }
    const value = attr.value.replace(/'|\[|\]/g, '')
    attr = { ...attr, label: attrText + ' : ' + value, value }
  }
  const list1 = ast.children?.map(sub => getPermissionButtonList(sub)).flat()
  const list2 = ast.scopedSlots ? Object.values(ast.scopedSlots).map(sub => getPermissionButtonList(sub)).flat() : []
  return list1.concat(list2).concat(attr || [])
}

module.exports = function(source) {
  // console.log(compile(source).ast)
  // console.log('======', getPermissionButtonList(compile(source).ast))
  return `\nexport default ${JSON.stringify(getPermissionButtonList(compile(source).ast))}`
}
