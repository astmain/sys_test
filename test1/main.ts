// main.ts - 修改后的完整初始化代码
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  await db.user.deleteMany()
  await db.department.deleteMany()
  await db.permission.deleteMany()
  await db.role.deleteMany()
  await db.menu.deleteMany()
  await db.role_permission.deleteMany()
  await db.user_department.deleteMany()
  await db.user_role.deleteMany()

  // 1. 创建用户数据
  const users = await Promise.all([
    db.user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110',} }),
    db.user.create({ data: { id: 'user_2', name: '二狗', phone: '15160315002', } }),
    db.user.create({ data: { id: 'user_3', name: '张三', phone: '15160315003', } }),
    db.user.create({ data: { id: 'user_4', name: '李四', phone: '15160315004', } }),
    db.user.create({ data: { id: 'user_5', name: '王五', phone: '15160315005',} })
  ])

  // 2. 创建部门数据 - 先创建父级部门
  const parentDepartments = await Promise.all([
    db.department.create({ data: { id: 'depart_1', name: '用户部', code: 'user_dept', level: 1, sort: 1 } }),
    db.department.create({ data: { id: 'depart_2', name: '技术部', code: 'tech_dept', level: 1, sort: 2 } }),
    db.department.create({ data: { id: 'depart_3', name: '客服部', code: 'service_dept', level: 1, sort: 3 } }),
    db.department.create({ data: { id: 'depart_4', name: '财务部', code: 'finance_dept', level: 1, sort: 4 } })
  ])

  // 再创建子级部门
  const childDepartments = await Promise.all([
    db.department.create({ data: { id: 'depart_1001', name: '用户部一普通', code: 'user_normal', level: 2, sort: 1, parent_id: 'depart_1' } }),
    db.department.create({ data: { id: 'depart_1002', name: '用户部一贵宾', code: 'user_vip', level: 2, sort: 2, parent_id: 'depart_1' } }),
    db.department.create({ data: { id: 'depart_2001', name: '技术部一职员', code: 'tech_staff', level: 2, sort: 1, parent_id: 'depart_2' } }),
    db.department.create({ data: { id: 'depart_2002', name: '技术部一主管', code: 'tech_manager', level: 2, sort: 2, parent_id: 'depart_2' } }),
    db.department.create({ data: { id: 'depart_3001', name: '客服部一职员', code: 'service_staff', level: 2, sort: 1, parent_id: 'depart_3' } }),
    db.department.create({ data: { id: 'depart_3002', name: '客服部一主管', code: 'service_manager', level: 2, sort: 2, parent_id: 'depart_3' } }),
    db.department.create({ data: { id: 'depart_4001', name: '财务部一职员', code: 'finance_staff', level: 2, sort: 1, parent_id: 'depart_4' } }),
    db.department.create({ data: { id: 'depart_4002', name: '财务部一主管', code: 'finance_manager', level: 2, sort: 2, parent_id: 'depart_4' } })
  ])

  // 3. 创建权限数据 - 先创建父级权限
  const parentPermissions = await Promise.all([
    db.permission.create({ data: { id: 'permiss_1', name: '首页访问', code: 'home:view', type: 'menu', level: 1, sort: 1 } }),
    db.permission.create({ data: { id: 'permiss_2', name: '系统管理', code: 'sys:view', type: 'menu', level: 1, sort: 2 } }),
    db.permission.create({ data: { id: 'permiss_6', name: '商城管理', code: 'mall:view', type: 'menu', level: 1, sort: 3 } })
  ])

  // 再创建子级权限
  const childPermissions = await Promise.all([
    db.permission.create({ data: { id: 'permiss_3', name: '用户管理', code: 'user:manage', type: 'menu', level: 2, sort: 1, parent_id: 'permiss_2' } }),
    db.permission.create({ data: { id: 'permiss_4', name: '菜单管理', code: 'menu:manage', type: 'menu', level: 2, sort: 2, parent_id: 'permiss_2' } }),
    db.permission.create({ data: { id: 'permiss_5', name: '部门管理', code: 'depart:manage', type: 'menu', level: 2, sort: 3, parent_id: 'permiss_2' } }),
    db.permission.create({ data: { id: 'permiss_7', name: '订单管理', code: 'order:manage', type: 'menu', level: 2, sort: 1, parent_id: 'permiss_6' } }),
    db.permission.create({ data: { id: 'permiss_8', name: '商品管理', code: 'product:manage', type: 'menu', level: 2, sort: 2, parent_id: 'permiss_6' } }),
    db.permission.create({ data: { id: 'permiss_9', name: '财务管理', code: 'finance:manage', type: 'menu', level: 2, sort: 3, parent_id: 'permiss_6' } })
  ])

  // 4. 创建角色数据
  const roles = await Promise.all([
    db.role.create({ data: { id: 'role_1', name: '用户部普通', code: 'user_normal', sort: 1 } }),
    db.role.create({ data: { id: 'role_2', name: '用户部贵宾', code: 'user_vip', sort: 2 } }),
    db.role.create({ data: { id: 'role_3', name: '技术部职员', code: 'tech_staff', sort: 3 } }),
    db.role.create({ data: { id: 'role_4', name: '技术部主管', code: 'tech_manager', sort: 4 } }),
    db.role.create({ data: { id: 'role_5', name: '客服部职员', code: 'service_staff', sort: 5 } }),
    db.role.create({ data: { id: 'role_6', name: '客服部主管', code: 'service_manager', sort: 6 } }),
    db.role.create({ data: { id: 'role_7', name: '财务部职员', code: 'finance_staff', sort: 7 } }),
    db.role.create({ data: { id: 'role_8', name: '财务部主管', code: 'finance_manager', sort: 8 } })
  ])

  // 5. 创建菜单数据 - 先创建父级菜单
  const parentMenus = await Promise.all([
    db.menu.create({ data: { id: 'menu_1', name: '首页', code: 'home', path: '/home', level: 1, sort: 1, permission_id: 'permiss_1' } }),
    db.menu.create({ data: { id: 'menu_2', name: '系统管理', code: 'sys', path: '/sys', level: 1, sort: 2, permission_id: 'permiss_2' } }),
    db.menu.create({ data: { id: 'menu_6', name: '商城管理', code: 'mall', path: '/mall', level: 1, sort: 3, permission_id: 'permiss_6' } })
  ])

  // 再创建子级菜单
  const childMenus = await Promise.all([
    db.menu.create({ data: { id: 'menu_3', name: '系统管理一用户管理', code: 'user_manage', path: '/user', level: 2, sort: 1, parent_id: 'menu_2', permission_id: 'permiss_3' } }),
    db.menu.create({ data: { id: 'menu_4', name: '系统管理一菜单管理', code: 'menu_manage', path: '/menu', level: 2, sort: 2, parent_id: 'menu_2', permission_id: 'permiss_4' } }),
    db.menu.create({ data: { id: 'menu_5', name: '系统管理一部门管理', code: 'depart_manage', path: '/depart', level: 2, sort: 3, parent_id: 'menu_2', permission_id: 'permiss_5' } }),
    db.menu.create({ data: { id: 'menu_7', name: '商城管理一订单管理', code: 'order_manage', path: '/mall/order', level: 2, sort: 1, parent_id: 'menu_6', permission_id: 'permiss_7' } }),
    db.menu.create({ data: { id: 'menu_8', name: '商城管理一商品管理', code: 'product_manage', path: '/mall/product', level: 2, sort: 2, parent_id: 'menu_6', permission_id: 'permiss_8' } }),
    db.menu.create({ data: { id: 'menu_9', name: '商城管理一财务管理', code: 'finance_manage', path: '/mall/finance', level: 2, sort: 3, parent_id: 'menu_6', permission_id: 'permiss_9' } })
  ])

  // 6. 创建角色权限关联 - 修复后的权限分配
  const rolePermissions = [
    // 用户部普通 - 只有首页
    { role_id: 'role_1', permission_id: 'permiss_1' },

    // 用户部贵宾 - 只有首页
    { role_id: 'role_2', permission_id: 'permiss_1' },

    // 技术部职员 - 系统管理 + 商城管理 + 用户管理、菜单管理、订单管理、商品管理
    { role_id: 'role_3', permission_id: 'permiss_2' }, // 添加系统管理权限（父菜单）
    { role_id: 'role_3', permission_id: 'permiss_6' }, // 添加商城管理权限（父菜单）
    { role_id: 'role_3', permission_id: 'permiss_3' }, // 用户管理（子菜单）
    { role_id: 'role_3', permission_id: 'permiss_4' }, // 菜单管理（子菜单）
    { role_id: 'role_3', permission_id: 'permiss_7' }, // 订单管理（子菜单）
    { role_id: 'role_3', permission_id: 'permiss_8' }, // 商品管理（子菜单）

    // 技术部主管 - 系统管理、商城管理、用户管理、菜单管理、部门管理、订单管理、商品管理、财务管理
    { role_id: 'role_4', permission_id: 'permiss_2' }, // 系统管理权限
    { role_id: 'role_4', permission_id: 'permiss_6' }, // 商城管理权限
    { role_id: 'role_4', permission_id: 'permiss_3' },
    { role_id: 'role_4', permission_id: 'permiss_4' },
    { role_id: 'role_4', permission_id: 'permiss_5' },
    { role_id: 'role_4', permission_id: 'permiss_7' },
    { role_id: 'role_4', permission_id: 'permiss_8' },
    { role_id: 'role_4', permission_id: 'permiss_9' },

    // 客服部职员 - 商城管理 + 订单管理
    { role_id: 'role_5', permission_id: 'permiss_6' }, // 商城管理权限（父菜单）
    { role_id: 'role_5', permission_id: 'permiss_7' }, // 订单管理权限（子菜单）

    // 客服部主管 - 系统管理 + 商城管理 + 用户管理、订单管理、商品管理
    { role_id: 'role_6', permission_id: 'permiss_2' }, // 添加系统管理权限（父菜单）
    { role_id: 'role_6', permission_id: 'permiss_6' }, // 商城管理权限（父菜单）
    { role_id: 'role_6', permission_id: 'permiss_3' }, // 用户管理（子菜单）
    { role_id: 'role_6', permission_id: 'permiss_7' }, // 订单管理（子菜单）
    { role_id: 'role_6', permission_id: 'permiss_8' }, // 商品管理（子菜单）

    // 财务部职员 - 商城管理、订单管理、商品管理、财务管理
    { role_id: 'role_7', permission_id: 'permiss_6' }, // 商城管理权限
    { role_id: 'role_7', permission_id: 'permiss_7' },
    { role_id: 'role_7', permission_id: 'permiss_8' },
    { role_id: 'role_7', permission_id: 'permiss_9' },

    // 财务部主管 - 系统管理 + 商城管理 + 用户管理、订单管理、商品管理、财务管理
    { role_id: 'role_8', permission_id: 'permiss_2' }, // 添加系统管理权限（父菜单）
    { role_id: 'role_8', permission_id: 'permiss_6' }, // 商城管理权限（父菜单）
    { role_id: 'role_8', permission_id: 'permiss_3' }, // 用户管理（子菜单）
    { role_id: 'role_8', permission_id: 'permiss_7' }, // 订单管理（子菜单）
    { role_id: 'role_8', permission_id: 'permiss_8' }, // 商品管理（子菜单）
    { role_id: 'role_8', permission_id: 'permiss_9' }  // 财务管理（子菜单）
  ]

  await Promise.all(rolePermissions.map(o => db.role_permission.create({ data: o })))

  // 7. 创建用户部门关联
  const userDepartments = [
    // 许鹏 - 用户部一贵宾、技术部一主管、客服部一主管、财务部一主管
    { user_id: 'user_1', department_id: 'depart_1002', is_primary: true },
    { user_id: 'user_1', department_id: 'depart_2002', is_primary: false },
    { user_id: 'user_1', department_id: 'depart_3002', is_primary: false },
    { user_id: 'user_1', department_id: 'depart_4002', is_primary: false },

    // 二狗 - 用户部一贵宾、客服部一职员
    { user_id: 'user_2', department_id: 'depart_1002', is_primary: true },
    { user_id: 'user_2', department_id: 'depart_3001', is_primary: false },

    // 张三 - 用户部一贵宾、客服部一主管
    { user_id: 'user_3', department_id: 'depart_1002', is_primary: true },
    { user_id: 'user_3', department_id: 'depart_3002', is_primary: false },

    // 李四 - 用户部一贵宾、财务部一职员
    { user_id: 'user_4', department_id: 'depart_1002', is_primary: true },
    { user_id: 'user_4', department_id: 'depart_4001', is_primary: false },

    // 王五 - 用户部一贵宾、财务部一主管
    { user_id: 'user_5', department_id: 'depart_1002', is_primary: true },
    { user_id: 'user_5', department_id: 'depart_4002', is_primary: false }
  ]

  await Promise.all(userDepartments.map(ud => db.user_department.create({ data: ud })))

  // 8. 创建用户角色关联（根据部门分配角色）
  const userRoles = [
    // 许鹏 - 用户部贵宾、技术部主管、客服部主管、财务部主管
    { user_id: 'user_1', role_id: 'role_2' },
    { user_id: 'user_1', role_id: 'role_4' },
    { user_id: 'user_1', role_id: 'role_6' },
    { user_id: 'user_1', role_id: 'role_8' },

    // 二狗 - 用户部贵宾、客服部职员
    { user_id: 'user_2', role_id: 'role_2' },
    { user_id: 'user_2', role_id: 'role_5' },

    // 张三 - 用户部贵宾、客服部主管
    { user_id: 'user_3', role_id: 'role_2' },
    { user_id: 'user_3', role_id: 'role_6' },

    // 李四 - 用户部贵宾、财务部职员
    { user_id: 'user_4', role_id: 'role_2' },
    { user_id: 'user_4', role_id: 'role_7' },

    // 王五 - 用户部贵宾、财务部主管
    { user_id: 'user_5', role_id: 'role_2' },
    { user_id: 'user_5', role_id: 'role_8' }
  ]

  await Promise.all(userRoles.map(ur => db.user_role.create({ data: ur })))

  console.log('数据初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })





/*

我想通过用户的id得到菜单        应该怎么写prisma的查询语句
我想通过用户的id得到菜单树      应该怎么写prisma的查询语句



帮我阅读test2的代码,将 部门表 的id 设置 "depart_"开头   例如 "depart_1"
帮我阅读test2的代码,将 菜单表 的id 设置 "menu_"开头     例如 "menu_1"
帮我阅读test2的代码,将 权限表 的id 设置 "permiss_"开头     例如 "permiss_1"
帮我阅读test2的代码,将 角色表 的id 设置 "role_"开头     例如 "role_1"
帮我阅读test2的代码,将 用户表 的id 设置 "user_"开头     例如 "user_1"


我的用户是下面的数据
let user_list = [
    { id: 'user_1', name: '许鹏', phone: '15160315110' },
    { id: 'user_2', name: '二狗', phone: '15160315002' },
    { id: 'user_3', name: '张三', phone: '15160315003' },
    { id: 'user_4', name: '李四', phone: '15160315004' },
    { id: 'user_5', name: '王五', phone: '15160315005' }
]


我的部门是下面的数据
let depart_list = [
    { id: 'depart_1', name: '用户部',},
    { id: 'depart_2', name: '技术部', },
    { id: 'depart_3', name: '客服部', },
    { id: 'depart_4', name: '财务部',  },
    { id: 'depart_1001', name: '用户部一普通', parent_id: 'depart_1' },
    { id: 'depart_1002', name: '用户部一贵宾', parent_id: 'depart_1' },
    { id: 'depart_2001', name: '技术部一职员', parent_id: 'depart_2' },
    { id: 'depart_2002', name: '技术部一主管', parent_id: 'depart_2' },
    { id: 'depart_3001', name: '客服部一职员', parent_id: 'depart_3' },
    { id: 'depart_3002', name: '客服部一主管', parent_id: 'depart_3' },
    { id: 'depart_4001', name: '财务部一职员', parent_id: 'depart_4' },
    { id: 'depart_4002', name: '财务部一主管', parent_id: 'depart_4' }
]

我的权限是下面的数据
let permission_list = [
    { id: 'permiss_1', name: '首页访问', code: 'home:view', type: 'menu', level: 1, sort: 1 },
    { id: 'permiss_2', name: '系统管理', code: 'sys:view', type: 'menu', level: 1, sort: 2 },
    { id: 'permiss_3', name: '用户管理', code: 'user:manage', type: 'menu', level: 2, sort: 1, parent_id: 'permiss_2' },
    { id: 'permiss_4', name: '菜单管理', code: 'menu:manage', type: 'menu', level: 2, sort: 2, parent_id: 'permiss_2' },
    { id: 'permiss_5', name: '部门管理', code: 'depart:manage', type: 'menu', level: 2, sort: 3, parent_id: 'permiss_2' },
    { id: 'permiss_6', name: '商城管理', code: 'mall:view', type: 'menu', level: 1, sort: 3 },
    { id: 'permiss_7', name: '订单管理', code: 'order:manage', type: 'menu', level: 2, sort: 1, parent_id: 'permiss_6' },
    { id: 'permiss_8', name: '商品管理', code: 'product:manage', type: 'menu', level: 2, sort: 2, parent_id: 'permiss_6' },
    { id: 'permiss_9', name: '财务管理', code: 'finance:manage', type: 'menu', level: 2, sort: 3, parent_id: 'permiss_6' }
]

我的菜单是下面的数据
let menu_list = [
    { id: 'menu_1', name: '首页', path: '/home', permission_id: 'permiss_1' },
    { id: 'menu_2', name: '系统管理', path: '/sys', permission_id: 'permiss_2' },        // 系统管理
    { id: 'menu_3', name: '系统管理一用户管理', path: '/user', parent_id: 'menu_2', permission_id: 'permiss_3' },
    { id: 'menu_4', name: '系统管理一菜单管理', path: '/menu',  parent_id: 'menu_2', permission_id: 'permiss_4' },
    { id: 'menu_5', name: '系统管理一部门管理', path: '/depart', parent_id: 'menu_2', permission_id: 'permiss_5' },
    { id: 'menu_6', name: '商城管理', path: '/mall', permission_id: 'permiss_6'},      // 商城管理
    { id: 'menu_7', name: '商城管理一订单管理', path: '/mall/order', parent_id: 'menu_6', permission_id: 'permiss_7'},
    { id: 'menu_8', name: '商城管理一商品管理', path: '/mall/product', parent_id: 'menu_6', permission_id: 'permiss_8' },
    { id: 'menu_9', name: '商城管理一财务管理', path: '/mall/finance', parent_id: 'menu_6', permission_id: 'permiss_9' }
]


// 部门对应的菜单
用户部一普通  可以看到菜单   首页
用户部一贵宾  可以看到菜单   首页
技术部一职员  可以看到菜单   系统管理一用户管理  系统管理一菜单管理                       商城管理一订单管理  商城管理一商品管理
技术部一主管  可以看到菜单   系统管理一用户管理  系统管理一菜单管理  系统管理一部门管理     商城管理一订单管理  商城管理一商品管理   商城管理一财务管理
客服部一职员  可以看到菜单                                                             商城管理一订单管理
客服部一主管  可以看到菜单   系统管理一用户管理                                         商城管理一订单管理  商城管理一商品管理
财务部一职员  可以看到菜单                                                             商城管理一订单管理  商城管理一商品管理  商城管理一财务管理
财务部一主管  可以看到菜单   系统管理一用户管理                                          商城管理一订单管理  商城管理一商品管理  商城管理一财务管理


// 用户对于的部门
用户:  许鹏 是:用户部一贵宾  技术部一主管  客服部一主管  财务部一主管
用户:  二狗 是:用户部一贵宾  客服部一职员
用户:  张三 是:用户部一贵宾  客服部一主管
用户:  李四 是:用户部一贵宾  财务部一职员
用户:  王五 是:用户部一贵宾  财务部一主管




帮我生成prisma的初始化数据
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()



*/

