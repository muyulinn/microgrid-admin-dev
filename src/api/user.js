import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export async function getInfo(token) {
  const [userInfo, rolePermissionList] = await Promise.all([request.get('/user/getUserInfo'), request.get('/user/getCurrentUserRolePermission')])
  const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  const permissions = (rolePermissionList || []).map(item => item.permissionValue)
  // const roles = ['admin']
  // if (roles.length === 0) roles.push('')
  // console.log('user info ', permissions);
  return { avatar, permissions, ...userInfo }
}

export function logout() {
  return Promise.resolve()
}
