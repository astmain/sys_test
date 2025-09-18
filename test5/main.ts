import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  try {
    // 清空现有数据
    await db.ref_depart_menu.deleteMany()
    await db.ref_user_depart.deleteMany()
    await db.sys_menu.deleteMany()
    await db.sys_depart.deleteMany()
    await db.sys_user.deleteMany()

    console.log('已清空现有数据')

    // 1. 创建用户数据
    const users = await db.sys_user.createMany({
      data: [
        { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456' },
        { id: 'user_2', name: '二狗', phone: '15160315002', password: '123456' },
        { id: 'user_3', name: '张三', phone: '15160315003', password: '123456' },
        { id: 'user_4', name: '李四', phone: '15160315004', password: '123456' },
        { id: 'user_5', name: '王五', phone: '15160315005', password: '123456' },
      ],
    })
    console.log(`创建了 ${users.count} 个用户`)

    // 2. 创建部门/角色数据
    const departments = await db.sys_depart.createMany({
      data: [
        // 部门
        { id: 'depart_1', name: '客户部', is_depart: true, remark: '客户服务部门' },
        { id: 'depart_2', name: '技术部', is_depart: true, remark: '技术开发部门' },
        { id: 'depart_3', name: '财务部', is_depart: true, remark: '财务管理部门' },
        // 客户部角色
        { id: 'depart_4', name: '客户普通', is_depart: false, parent_id: 'depart_1', remark: '普通客户服务人员' },
        { id: 'depart_5', name: '客户高级', is_depart: false, parent_id: 'depart_1', remark: '高级客户服务人员' },
        // 技术部角色
        { id: 'depart_6', name: '技术职员', is_depart: false, parent_id: 'depart_2', remark: '技术部门普通员工' },
        { id: 'depart_7', name: '技术主管', is_depart: false, parent_id: 'depart_2', remark: '技术部门主管' },
        // 财务部角色
        { id: 'depart_8', name: '财务职员', is_depart: false, parent_id: 'depart_3', remark: '财务部门普通员工' },
        { id: 'depart_9', name: '财务主管', is_depart: false, parent_id: 'depart_3', remark: '财务部门主管' },
      ],
    })
    console.log(`创建了 ${departments.count} 个部门/角色`)

    // 3. 创建菜单数据
    const menus = await db.sys_menu.createMany({
      data: [
        // 一级菜单
        { id: 'menu_1', name: '首页', path: '/home', remark: '系统首页' },
        { id: 'menu_2', name: '系统设置', path: '/system', remark: '系统设置模块' },
        { id: 'menu_3', name: '商城管理', path: '/mall', remark: '商城管理模块' },
        // 系统设置子菜单
        { id: 'menu_4', name: '组织人员', path: '/system/user', parent_id: 'menu_2', remark: '组织人员管理' },
        { id: 'menu_5', name: '组织管理', path: '/system/depart', parent_id: 'menu_2', remark: '组织部门管理' },
        // 商城管理子菜单
        { id: 'menu_6', name: '订单管理', path: '/mall/order', parent_id: 'menu_3', remark: '订单管理' },
        { id: 'menu_7', name: '商品管理', path: '/mall/product', parent_id: 'menu_3', remark: '商品管理' },
        { id: 'menu_8', name: '财务管理', path: '/mall/finance', parent_id: 'menu_3', remark: '财务管理' },
      ],
    })
    console.log(`创建了 ${menus.count} 个菜单`)

    // 4. 创建用户部门关系
    const user_depart_relations = await db.ref_user_depart.createMany({
      data: [
        // 许鹏 - 技术主管
        { id: 'ref_user_depart_1', user_id: 'user_1', depart_id: 'depart_7', remark: '许鹏担任技术主管' },
        //许鹏 还是- 客户高级
        { id: 'ref_user_depart_2999', user_id: 'user_1', depart_id: 'depart_5', remark: '许鹏担任客户高级' },
        // 二狗 - 客户高级
        { id: 'ref_user_depart_2', user_id: 'user_2', depart_id: 'depart_5', remark: '二狗担任客户高级' },
        // 张三 - 技术职员
        { id: 'ref_user_depart_3', user_id: 'user_3', depart_id: 'depart_6', remark: '张三担任技术职员' },
        // 李四 - 财务职员
        { id: 'ref_user_depart_4', user_id: 'user_4', depart_id: 'depart_8', remark: '李四担任财务职员' },
        // 王五 - 财务主管
        { id: 'ref_user_depart_5', user_id: 'user_5', depart_id: 'depart_9', remark: '王五担任财务主管' },
      ],
    })
    console.log(`创建了 ${user_depart_relations.count} 个用户部门关系`)

    // 5. 创建部门菜单权限关系
    const depart_menu_relations = await db.ref_depart_menu.createMany({
      data: [
        // 客户普通权限
        { id: 'ref_depart_menu_1', depart_id: 'depart_4', menu_id: 'menu_1', actions: 'find', remark: '客户普通可查看首页' },

        // 客户高级权限
        { id: 'ref_depart_menu_2', depart_id: 'depart_5', menu_id: 'menu_1', actions: 'find', remark: '客户高级可查看首页' },

        // 技术职员权限 - 添加父菜单权限
        { id: 'ref_depart_menu_3', depart_id: 'depart_6', menu_id: 'menu_2', actions: 'find', remark: '技术职员可查看系统设置' },
        { id: 'ref_depart_menu_4', depart_id: 'depart_6', menu_id: 'menu_4', actions: 'find,create,update', remark: '技术职员可管理组织人员' },
        { id: 'ref_depart_menu_5', depart_id: 'depart_6', menu_id: 'menu_3', actions: 'find', remark: '技术职员可查看商城管理' },
        { id: 'ref_depart_menu_6', depart_id: 'depart_6', menu_id: 'menu_6', actions: 'find,create,update,delete', remark: '技术职员可管理订单' },
        { id: 'ref_depart_menu_7', depart_id: 'depart_6', menu_id: 'menu_7', actions: 'find,create,update,delete', remark: '技术职员可管理商品' },
        { id: 'ref_depart_menu_8', depart_id: 'depart_6', menu_id: 'menu_8', actions: 'find', remark: '技术职员可查看财务' },

        // 技术主管权限 - 添加父菜单权限
        { id: 'ref_depart_menu_9', depart_id: 'depart_7', menu_id: 'menu_2', actions: 'find,create,update,delete', remark: '技术主管可管理系统设置' },
        { id: 'ref_depart_menu_10', depart_id: 'depart_7', menu_id: 'menu_5', actions: 'find,create,update,delete', remark: '技术主管可管理组织' },
        { id: 'ref_depart_menu_11', depart_id: 'depart_7', menu_id: 'menu_4', actions: 'find,create,update,delete', remark: '技术主管可管理组织人员' },
        { id: 'ref_depart_menu_12', depart_id: 'depart_7', menu_id: 'menu_3', actions: 'find,create,update,delete', remark: '技术主管可管理商城管理' },
        { id: 'ref_depart_menu_13', depart_id: 'depart_7', menu_id: 'menu_6', actions: 'find,create,update,delete', remark: '技术主管可管理订单' },
        { id: 'ref_depart_menu_14', depart_id: 'depart_7', menu_id: 'menu_7', actions: 'find,create,update,delete', remark: '技术主管可管理商品' },
        { id: 'ref_depart_menu_15', depart_id: 'depart_7', menu_id: 'menu_8', actions: 'find,create,update,delete', remark: '技术主管可管理财务' },

        // 财务职员权限 - 添加父菜单权限
        { id: 'ref_depart_menu_16', depart_id: 'depart_8', menu_id: 'menu_3', actions: 'find', remark: '财务职员可查看商城管理' },
        { id: 'ref_depart_menu_17', depart_id: 'depart_8', menu_id: 'menu_6', actions: 'find', remark: '财务职员可查看订单' },
        { id: 'ref_depart_menu_18', depart_id: 'depart_8', menu_id: 'menu_8', actions: 'find,create,update', remark: '财务职员可管理财务' },

        // 财务主管权限 - 添加父菜单权限
        { id: 'ref_depart_menu_19', depart_id: 'depart_9', menu_id: 'menu_2', actions: 'find', remark: '财务主管可查看系统设置' },
        { id: 'ref_depart_menu_20', depart_id: 'depart_9', menu_id: 'menu_4', actions: 'find', remark: '财务主管可查看组织人员' },
        { id: 'ref_depart_menu_21', depart_id: 'depart_9', menu_id: 'menu_3', actions: 'find,create,update,delete', remark: '财务主管可管理商城管理' },
        { id: 'ref_depart_menu_22', depart_id: 'depart_9', menu_id: 'menu_6', actions: 'find,create,update,delete', remark: '财务主管可管理订单' },
        { id: 'ref_depart_menu_23', depart_id: 'depart_9', menu_id: 'menu_7', actions: 'find,create,update,delete', remark: '财务主管可管理商品' },
        { id: 'ref_depart_menu_24', depart_id: 'depart_9', menu_id: 'menu_8', actions: 'find,create,update,delete', remark: '财务主管可管理财务' },
      ],
    })
    console.log(`创建了 ${depart_menu_relations.count} 个部门菜单权限关系`)

    console.log('数据库初始化完成！')

    // 验证数据
    console.log('\n=== 数据验证 ===')

    const user_count = await db.sys_user.count()
    const depart_count = await db.sys_depart.count()
    const menu_count = await db.sys_menu.count()
    const user_depart_count = await db.ref_user_depart.count()
    const depart_menu_count = await db.ref_depart_menu.count()

    console.log(`用户数量: ${user_count}`)
    console.log(`部门/角色数量: ${depart_count}`)
    console.log(`菜单数量: ${menu_count}`)
    console.log(`用户部门关系数量: ${user_depart_count}`)
    console.log(`部门菜单权限数量: ${depart_menu_count}`)

    // 查询用户权限示例
    console.log('\n=== 用户权限查询示例 ===')
    const user_permissions = await db.sys_user.findUnique({
      where: { id: 'user_1' },
      include: {
        ref_user_depart: {
          include: {
            sys_depart: {
              include: {
                ref_depart_menu: {
                  include: {
                    sys_menu: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (user_permissions) {
      console.log(`用户 ${user_permissions.name} 的权限:`)
      user_permissions.ref_user_depart.forEach((relation) => {
        console.log(`  角色: ${relation.sys_depart.name}`)
        relation.sys_depart.ref_depart_menu.forEach((menu_relation) => {
          console.log(`    菜单: ${menu_relation.sys_menu.name} (${menu_relation.actions})`)
        })
      })
    }
  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    await db.$disconnect()
  }
}

// 执行初始化
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
