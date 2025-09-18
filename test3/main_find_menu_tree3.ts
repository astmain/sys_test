import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()
const user_id = 'user_2'

main()

async function main() {
  try {
    let aaa = await db.$queryRaw`SELECT * FROM user_menu_permissions WHERE user_id = ${user_id}` as any;
    const all_menu_ids = aaa.map((item: any) => item.menu_id)
    console.log(`111---222:`, all_menu_ids)
    const all_menus = await db.sys_menu.findMany({
      where: { id: { in: [...all_menu_ids] } },

      orderBy: { sort_order: 'asc' },
    })

    console.log('最终查询到的菜单数量:', all_menus)

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
