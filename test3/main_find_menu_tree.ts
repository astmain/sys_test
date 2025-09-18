import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()

let user_id = 'user_1'
main()

async function main() {
  try {
    // 先进行调试
    await debug_database()

    // 第一步：查询用户有直接权限的菜单
    const direct_menus = await db.sys_menu.findMany({
      where: {
        zoom_role_menu: {
          some: {
            sys_role: {
              zoom_org_role_user: {
                some: { user_id },
              },
            },
          },
        },
      },
      include: {
        children: true,
        parent: true,
        zoom_role_menu: {
          include: {
            sys_role: {
              include: {
                zoom_org_role_user: {
                  where: { user_id },
                },
              },
            },
          },
        },
      },
      orderBy: { sort_order: 'asc' },
    })

    console.log('直接权限菜单数量:', direct_menus.length)

    // 第二步：收集所有需要包含的菜单ID（包括父级菜单）
    const menu_ids = new Set<string>()

    // 添加有直接权限的菜单
    direct_menus.forEach((menu) => {
      menu_ids.add(menu.id)

      // 添加所有父级菜单ID
      let current_parent_id = menu.parent_id
      while (current_parent_id) {
        menu_ids.add(current_parent_id)
        // 查找父菜单的父菜单ID
        const parent_menu = direct_menus.find((m) => m.id === current_parent_id)
        current_parent_id = parent_menu?.parent_id || null
      }
    })

    console.log('需要包含的菜单ID:', Array.from(menu_ids))

    // 第三步：查询所有需要的菜单（包括父级菜单）
    const all_menus = await db.sys_menu.findMany({
      where: {
        id: { in: [...menu_ids] },
      },
      include: {
        children: true,
        parent: true,
        zoom_role_menu: {
          include: {
            sys_role: {
              include: {
                zoom_org_role_user: {
                  where: { user_id },
                },
              },
            },
          },
        },
      },
      orderBy: { sort_order: 'asc' },
    })

    console.log('最终查询到的菜单数量:', all_menus.length)
    all_menus.forEach((menu) => {
      console.log(`- ${menu.name} (${menu.id})`)
    })

    // 构建菜单树
    let menu_tree = build_menu_tree(all_menus)

    let aaa = JSON.stringify(menu_tree, null, 2)

    console.log(aaa)
    fs.writeFileSync(__dirname + '/data/main_find_menu_tree.json', aaa)
    console.log('菜单树已保存到 data/main_find_menu_tree.json')
  } catch (error) {
    console.error('查询菜单树时出现错误:', error)
  } finally {
    await db.$disconnect()
  }
}

async function debug_database() {
  try {
    console.log('=== 调试数据库数据 ===')

    // 1. 检查用户数据
    const users = await db.sys_user.findMany()
    console.log('用户数据:', users.length, '个')

    // 2. 检查 user_1 的组织角色关系
    const user_roles = await db.zoom_org_role_user.findMany({
      where: { user_id: 'user_1' },
      include: { sys_role: true, sys_org: true },
    })
    console.log('user_1 的角色关系:', user_roles.length, '个')
    user_roles.forEach((ur) => {
      console.log(`- ${ur.sys_org.name} -> ${ur.sys_role.name}`)
    })

    // 3. 检查这些角色的菜单权限
    const role_ids = user_roles.map((ur) => ur.role_id)
    const role_menus = await db.zoom_role_menu.findMany({
      where: { role_id: { in: role_ids } },
      include: { sys_menu: true, sys_role: true },
    })
    console.log('角色菜单权限:', role_menus.length, '个')
    role_menus.forEach((rm) => {
      console.log(`- ${rm.sys_role.name} -> ${rm.sys_menu.name} (${rm.actions})`)
    })

    // 4. 检查所有菜单
    const all_menus = await db.sys_menu.findMany()
    console.log('所有菜单:', all_menus.length, '个')
    all_menus.forEach((menu) => {
      console.log(`- ${menu.name} (${menu.id})`)
    })

    console.log('=== 调试结束 ===\n')
  } catch (error) {
    console.error('调试失败:', error)
  }
}

function build_menu_tree(menus: any[]) {
  const menu_map = new Map()
  const root_menus = []

  menus.forEach((menu) => {
    menu_map.set(menu.id, {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      parent_id: menu.parent_id,
      menu_type: menu.menu_type,
      permission: menu.permission,
      sort_order: menu.sort_order,
      remark: menu.remark,
      actions: menu.zoom_role_menu.map((rm) => rm.actions).join(','),
      children: [],
    })
  })

  menus.forEach((menu) => {
    if (menu.parent_id) {
      const parent = menu_map.get(menu.parent_id)
      if (parent) parent.children.push(menu_map.get(menu.id))
    } else {
      root_menus.push(menu_map.get(menu.id))
    }
  })

  return root_menus
}
