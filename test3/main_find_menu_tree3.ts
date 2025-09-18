import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()
const user_id = 'user_1'

main()

async function main() {
  try {
    // 最简单的方案：分两步查询
    // 第一步：获取用户有权限的菜单ID
    const user_menu_ids = (await db.$queryRaw`
      SELECT DISTINCT m.id
      FROM sys_menu m
      INNER JOIN zoom_role_menu rm ON m.id = rm.menu_id
      INNER JOIN zoom_org_role_user oru ON rm.role_id = oru.role_id
      WHERE oru.user_id = ${user_id}
    `) as { id: string }[]

    const menu_ids = user_menu_ids.map((m) => m.id)
    console.log('用户权限菜单数量:', menu_ids.length)

    // 第二步：获取这些菜单及其所有父级菜单
    const all_menus = await db.sys_menu.findMany({
      where: {
        OR: [{ id: { in: menu_ids } }, { children: { some: { id: { in: menu_ids } } } }],
      },
      include: {
        zoom_role_menu: {
          where: {
            sys_role: {
              zoom_org_role_user: {
                some: { user_id },
              },
            },
          },
        },
      },
      orderBy: { sort_order: 'asc' },
    })

    console.log('最终菜单数量:', all_menus.length)

    // 构建菜单树
    const menu_tree = build_menu_tree(all_menus)

    // 保存菜单树
    const json_data = { all_menus: all_menus, menu_tree: menu_tree }
    fs.writeFileSync(__dirname + '/data/main_find_menu_tree3.json', JSON.stringify(json_data, null, 2))
    console.log('菜单树已保存到 data/main_find_menu_tree3.json')
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
