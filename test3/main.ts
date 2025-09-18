import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function init_data() {
  try {
    // 1. 清空所有表数据（按依赖关系倒序删除）
    console.log('清空现有数据...')
    await db.zoom_org_role_user.deleteMany()
    await db.zoom_role_menu.deleteMany()
    await db.sys_menu.deleteMany()
    await db.sys_role.deleteMany()
    await db.sys_org.deleteMany()
    await db.sys_user.deleteMany()

    // 2. 创建用户数据
    console.log('创建用户数据...')
    const users = await Promise.all([
      db.sys_user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', remark: '系统管理员' } }),
      db.sys_user.create({ data: { id: 'user_2', name: '二狗', phone: '15160315002', password: '123456', remark: '普通用户' } }),
      db.sys_user.create({ data: { id: 'user_3', name: '张三', phone: '15160315003', password: '123456', remark: '普通用户' } }),
      db.sys_user.create({ data: { id: 'user_4', name: '李四', phone: '15160315004', password: '123456', remark: '普通用户' } }),
      db.sys_user.create({ data: { id: 'user_5', name: '王五', phone: '15160315005', password: '123456', remark: '普通用户' } }),
    ])

    // 3. 创建组织数据
    console.log('创建组织数据...')
    const orgs = await Promise.all([db.sys_org.create({ data: { id: 'org_1', name: '用户部', remark: '用户管理部门' } }), db.sys_org.create({ data: { id: 'org_2', name: '技术部', remark: '技术开发部门' } }), db.sys_org.create({ data: { id: 'org_3', name: '客服部', remark: '客户服务部门' } }), db.sys_org.create({ data: { id: 'org_4', name: '财务部', remark: '财务管理部门' } })])

    // 4. 创建角色数据
    console.log('创建角色数据...')
    const roles = await Promise.all([
      // 用户部角色
      db.sys_role.create({ data: { id: 'role_1001', name: '用户部一普通', code: 'USER_NORMAL', org_id: 'org_1', remark: '用户部普通员工' } }),
      db.sys_role.create({ data: { id: 'role_1002', name: '用户部一贵宾', code: 'USER_VIP', org_id: 'org_1', remark: '用户部贵宾用户' } }),
      // 技术部角色
      db.sys_role.create({ data: { id: 'role_2001', name: '技术部一职员', code: 'TECH_STAFF', org_id: 'org_2', remark: '技术部普通员工' } }),
      db.sys_role.create({ data: { id: 'role_2002', name: '技术部一主管', code: 'TECH_MANAGER', org_id: 'org_2', remark: '技术部主管' } }),
      // 客服部角色
      db.sys_role.create({ data: { id: 'role_3001', name: '客服部一职员', code: 'SERVICE_STAFF', org_id: 'org_3', remark: '客服部普通员工' } }),
      db.sys_role.create({ data: { id: 'role_3002', name: '客服部一主管', code: 'SERVICE_MANAGER', org_id: 'org_3', remark: '客服部主管' } }),
      // 财务部角色
      db.sys_role.create({ data: { id: 'role_4001', name: '财务部一职员', code: 'FINANCE_STAFF', org_id: 'org_4', remark: '财务部普通员工' } }),
      db.sys_role.create({ data: { id: 'role_4002', name: '财务部一主管', code: 'FINANCE_MANAGER', org_id: 'org_4', remark: '财务部主管' } }),
    ])

    // 5. 创建菜单数据（分步创建，先创建父菜单，再创建子菜单）
    console.log('创建菜单数据...')

    // 先创建一级菜单
    const menu_1 = await db.sys_menu.create({ data: { id: 'menu_1', name: '首页', path: '/home', menu_type: 'MENU', permission: 'home', sort_order: 1, remark: '系统首页' } })
    const menu_2 = await db.sys_menu.create({ data: { id: 'menu_2', name: '系统管理', path: '/system', menu_type: 'DIR', permission: 'system', sort_order: 2, remark: '系统管理目录' } })
    const menu_3 = await db.sys_menu.create({ data: { id: 'menu_3', name: '商城管理', path: '/mall', menu_type: 'DIR', permission: 'mall', sort_order: 3, remark: '商城管理目录' } })

    // 再创建子菜单
    const sub_menus = await Promise.all([
      // 系统管理子菜单
      db.sys_menu.create({ data: { id: 'menu_2001', name: '系统管理一用户管理', path: '/system/user', parent_id: 'menu_2', menu_type: 'MENU', permission: 'system:user', sort_order: 1, remark: '用户管理页面' } }),
      db.sys_menu.create({ data: { id: 'menu_2002', name: '系统管理一菜单管理', path: '/system/menu', parent_id: 'menu_2', menu_type: 'MENU', permission: 'system:menu', sort_order: 2, remark: '菜单管理页面' } }),
      db.sys_menu.create({ data: { id: 'menu_2003', name: '系统管理一部门管理', path: '/system/org', parent_id: 'menu_2', menu_type: 'MENU', permission: 'system:org', sort_order: 3, remark: '部门管理页面' } }),
      // 商城管理子菜单
      db.sys_menu.create({ data: { id: 'menu_3001', name: '商城管理一订单管理', path: '/mall/order', parent_id: 'menu_3', menu_type: 'MENU', permission: 'mall:order', sort_order: 1, remark: '订单管理页面' } }),
      db.sys_menu.create({ data: { id: 'menu_3002', name: '商城管理一商品管理', path: '/mall/product', parent_id: 'menu_3', menu_type: 'MENU', permission: 'mall:product', sort_order: 2, remark: '商品管理页面' } }),
      db.sys_menu.create({ data: { id: 'menu_3003', name: '商城管理一财务管理', path: '/mall/finance', parent_id: 'menu_3', menu_type: 'MENU', permission: 'mall:finance', sort_order: 3, remark: '财务管理页面' } }),
    ])

    const menus = [menu_1, menu_2, menu_3, ...sub_menus]

    // 6. 创建角色菜单权限关系
    console.log('创建角色菜单权限...')
    const role_menu_permissions = [
      // 用户部一普通 - 首页
      { role_id: 'role_1001', menu_id: 'menu_1', actions: 'find' },
      // 用户部一贵宾 - 首页
      { role_id: 'role_1002', menu_id: 'menu_1', actions: 'find' },

      // 技术部一职员 - 系统管理用户、菜单 + 商城订单、商品
      { role_id: 'role_2001', menu_id: 'menu_2001', actions: 'find,create,update' },
      { role_id: 'role_2001', menu_id: 'menu_2002', actions: 'find,create,update' },
      { role_id: 'role_2001', menu_id: 'menu_3001', actions: 'find,create,update' },
      { role_id: 'role_2001', menu_id: 'menu_3002', actions: 'find,create,update' },

      // 技术部一主管 - 系统管理用户、菜单、部门 + 商城订单、商品、财务
      { role_id: 'role_2002', menu_id: 'menu_2001', actions: 'find,create,update,delete' },
      { role_id: 'role_2002', menu_id: 'menu_2002', actions: 'find,create,update,delete' },
      { role_id: 'role_2002', menu_id: 'menu_2003', actions: 'find,create,update,delete' },
      { role_id: 'role_2002', menu_id: 'menu_3001', actions: 'find,create,update,delete' },
      { role_id: 'role_2002', menu_id: 'menu_3002', actions: 'find,create,update,delete' },
      { role_id: 'role_2002', menu_id: 'menu_3003', actions: 'find,create,update,delete' },

      // 客服部一职员 - 商城订单
      { role_id: 'role_3001', menu_id: 'menu_3001', actions: 'find,update' },

      // 客服部一主管 - 系统管理用户 + 商城订单、商品
      { role_id: 'role_3002', menu_id: 'menu_2001', actions: 'find,create,update' },
      { role_id: 'role_3002', menu_id: 'menu_3001', actions: 'find,create,update,delete' },
      { role_id: 'role_3002', menu_id: 'menu_3002', actions: 'find,create,update' },

      // 财务部一职员 - 商城订单、商品、财务
      { role_id: 'role_4001', menu_id: 'menu_3001', actions: 'find' },
      { role_id: 'role_4001', menu_id: 'menu_3002', actions: 'find' },
      { role_id: 'role_4001', menu_id: 'menu_3003', actions: 'find,create,update' },

      // 财务部一主管 - 系统管理用户 + 商城订单、商品、财务
      { role_id: 'role_4002', menu_id: 'menu_2001', actions: 'find,create,update' },
      { role_id: 'role_4002', menu_id: 'menu_3001', actions: 'find,create,update' },
      { role_id: 'role_4002', menu_id: 'menu_3002', actions: 'find,create,update' },
      { role_id: 'role_4002', menu_id: 'menu_3003', actions: 'find,create,update,delete' },
    ]

    await Promise.all(role_menu_permissions.map((permission) => db.zoom_role_menu.create({ data: { id: `zoom_role_menu_${permission.role_id}_${permission.menu_id}`, role_id: permission.role_id, menu_id: permission.menu_id, actions: permission.actions, remark: `角色菜单权限` } })))

    // 7. 创建用户组织角色关系
    console.log('创建用户组织角色关系...')
    const user_org_role_relations = [
      // 许鹏: 用户部一贵宾、技术部一主管、客服部一主管、财务部一主管
      { user_id: 'user_1', org_id: 'org_1', role_id: 'role_1002' },
      { user_id: 'user_1', org_id: 'org_2', role_id: 'role_2002' },
      { user_id: 'user_1', org_id: 'org_3', role_id: 'role_3002' },
      { user_id: 'user_1', org_id: 'org_4', role_id: 'role_4002' },

      // 二狗: 用户部一贵宾、客服部一职员
      { user_id: 'user_2', org_id: 'org_1', role_id: 'role_1002' },
      { user_id: 'user_2', org_id: 'org_3', role_id: 'role_3001' },

      // 张三: 用户部一贵宾、客服部一主管
      { user_id: 'user_3', org_id: 'org_1', role_id: 'role_1002' },
      { user_id: 'user_3', org_id: 'org_3', role_id: 'role_3002' },

      // 李四: 用户部一贵宾、财务部一职员
      { user_id: 'user_4', org_id: 'org_1', role_id: 'role_1002' },
      { user_id: 'user_4', org_id: 'org_4', role_id: 'role_4001' },

      // 王五: 用户部一贵宾、财务部一主管
      { user_id: 'user_5', org_id: 'org_1', role_id: 'role_1002' },
      { user_id: 'user_5', org_id: 'org_4', role_id: 'role_4002' },
    ]

    await Promise.all(user_org_role_relations.map((relation) => db.zoom_org_role_user.create({ data: { id: `zoom_org_role_user_${relation.user_id}_${relation.org_id}_${relation.role_id}`, user_id: relation.user_id, org_id: relation.org_id, role_id: relation.role_id, remark: `用户组织角色关系` } })))

    console.log('数据初始化完成！')
    console.log(`创建了 ${users.length} 个用户`)
    console.log(`创建了 ${orgs.length} 个组织`)
    console.log(`创建了 ${roles.length} 个角色`)
    console.log(`创建了 ${menus.length} 个菜单`)
    console.log(`创建了 ${role_menu_permissions.length} 个角色菜单权限`)
    console.log(`创建了 ${user_org_role_relations.length} 个用户组织角色关系`)
  } catch (error) {
    console.error('初始化数据失败:', error)
  } finally {
    await db.$disconnect()
  }
}

// 执行初始化
init_data()

// 类似这个代码
// db.sys_user.create({
//   data: {
//     id: 'user_1',
//     name: '许鹏',
//     phone: '15160315110',
//     password: '123456',
//     remark: '系统管理员',
//   },
// }),
//帮格式化成一行代码
// db.sys_user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', remark: '系统管理员' } }),
// 帮我看main.ts代码,帮我格式化成一行代码
