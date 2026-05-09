/**
 * 用户管理
 * by lcs
 * 2021-02-28
 */
import Layout from '@/layout'

export default [{
  path: '/admin-user',
  name: 'AdminUser',
  component: Layout,
  alwaysShow: true,
  redirect: 'userList',
  meta: { title: '用户管理', icon: 'el-icon-user', roles: [] },
  children: [{
    path: 'userList',
    name: 'UserList',
    component: () => import('@/views/admin-user/user/index'),
    meta: { title: '用户列表', icon: '', roles: [] },
    buttonList: [
      { name: 'btn-view-user', title: '查看', buttonList: [
        { name: 'col-user.name', title: '姓名' },
        { name: 'col-user.roleName', title: '角色' }
      ] },
      { name: 'btn-add-user', title: '添加登陆账号' },
      { name: 'btn-reset-password', title: '重置密码' },
      { name: 'btn-update-user-role', title: '设置角色' },
      { name: 'btn-edit-user', title: '编辑' }
    ]
  }, {
    path: 'roleList',
    name: 'RoleList',
    component: () => import('@/views/admin-user/role/index'),
    meta: { title: '角色列表', icon: '', roles: [] },
    buttonList: [
      { name: 'btn-view-role', title: '查看' },
      { name: 'btn-add-role', title: '添加角色' },
      { name: 'btn-edit-role', title: '编辑' },
      { name: 'btn-update-role-permission', title: '设置权限' }
    ]
  }]
}]
