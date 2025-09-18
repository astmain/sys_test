import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()
const user_id = 'user_1'

main()

async function main() {
  try {
    // // 调试数据库数据
    // console.log('=== 调试数据库数据 ===')
    // const user_roles = await db.zoom_org_role_user.findMany({
    //   where: { user_id },
    //   include: { sys_role: true, sys_org: true },
    // })
    // console.log('用户角色关系:', user_roles.length, '个')
    // user_roles.forEach(ur => {
    //   console.log(`- ${ur.sys_org.name} -> ${ur.sys_role.name}`)
    // })

    // const role_ids = user_roles.map(ur => ur.role_id)
    // const role_menus = await db.zoom_role_menu.findMany({
    //   where: { role_id: { in: role_ids } },
    //   include: { sys_menu: true, sys_role: true },
    // })
    // console.log('角色菜单权限:', role_menus.length, '个')
    // role_menus.forEach(rm => {
    //   console.log(`- ${rm.sys_role.name} -> ${rm.sys_menu.name} (${rm.actions})`)
    // })
    // console.log('=== 调试结束 ===\n')

    // 查询用户有直接权限的菜单
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

    // 收集所有需要包含的菜单ID（包括父级菜单）
    const menu_ids = new Set<string>()
    direct_menus.forEach((menu) => {
      menu_ids.add(menu.id)
      let parent_id = menu.parent_id
      while (parent_id) {
        menu_ids.add(parent_id)
        const parent_menu = direct_menus.find((m) => m.id === parent_id)
        parent_id = parent_menu?.parent_id || null
      }
    })

    console.log('需要包含的菜单ID:', Array.from(menu_ids))

    // 查询所有需要的菜单
    const all_menus = await db.sys_menu.findMany({
      where: { id: { in: [...menu_ids] } },
      include: {
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

    // 构建菜单树
    const menu_tree = build_menu_tree(all_menus)

    // 保存菜单树
    const json_data = JSON.stringify(menu_tree, null, 2)
    fs.writeFileSync(__dirname + '/data/main_find_menu_tree2.json', json_data)
    console.log('菜单树已保存到 data/main_find_menu_tree2.json')
  } catch (error) {
    console.error('查询菜单树时出现错误:', error)
  } finally {
    await db.$disconnect()
  }
}

/**
 * 构建菜单树结构
 * @param all_menus 所有菜单数据
 * @returns 菜单树数组
 */
function build_menu_tree(all_menus: any[]) {
  const menu_map = new Map()
  const root_menus = []

  // 创建菜单节点映射
  all_menus.forEach((menu) => {
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

  // 构建树形结构
  all_menus.forEach((menu) => {
    const menu_node = menu_map.get(menu.id)
    if (menu.parent_id) {
      const parent = menu_map.get(menu.parent_id)
      if (parent) parent.children.push(menu_node)
    } else {
      root_menus.push(menu_node)
    }
  })

  return root_menus
}
