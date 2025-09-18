import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()
const user_id = 'user_2'

main()

async function main() {
  try {
    // 使用原生SQL一次性获取完整的菜单树 - 最简洁的方案
    const menu_tree = (await db.$queryRaw`
      WITH RECURSIVE menu_hierarchy AS (
        -- 获取用户有直接权限的菜单
        SELECT DISTINCT 
          m.id, m.name, m.path, m.parent_id, m.menu_type, 
          m.permission, m.sort_order, m.remark,
          GROUP_CONCAT(rm.actions) as actions,
          0 as level
        FROM sys_menu m
        INNER JOIN zoom_role_menu rm ON m.id = rm.menu_id
        INNER JOIN zoom_org_role_user oru ON rm.role_id = oru.role_id
        WHERE oru.user_id = ${user_id}
        GROUP BY m.id, m.name, m.path, m.parent_id, m.menu_type, m.permission, m.sort_order, m.remark
        
        UNION ALL
        
        -- 递归获取父级菜单
        SELECT 
          p.id, p.name, p.path, p.parent_id, p.menu_type,
          p.permission, p.sort_order, p.remark,
          '' as actions,
          mh.level + 1 as level
        FROM sys_menu p
        INNER JOIN menu_hierarchy mh ON p.id = mh.parent_id
        WHERE mh.level < 10  -- 防止无限递归
      )
      SELECT DISTINCT 
        id, name, path, parent_id, menu_type, 
        permission, sort_order, remark, actions
      FROM menu_hierarchy
      ORDER BY sort_order ASC
    `) as any[]

    console.log('查询到的菜单数量:', menu_tree.length)

    // 构建菜单树结构
    const menu_map = new Map()
    const root_menus = []

    // 创建菜单节点映射
    menu_tree.forEach((menu) => {
      menu_map.set(menu.id, {
        id: menu.id,
        name: menu.name,
        path: menu.path,
        parent_id: menu.parent_id,
        menu_type: menu.menu_type,
        permission: menu.permission,
        sort_order: menu.sort_order,
        remark: menu.remark,
        actions: menu.actions,
        children: [],
      })
    })

    // 构建树形结构
    menu_tree.forEach((menu) => {
      const menu_node = menu_map.get(menu.id)
      if (menu.parent_id) {
        const parent = menu_map.get(menu.parent_id)
        if (parent) parent.children.push(menu_node)
      } else {
        root_menus.push(menu_node)
      }
    })

    // 保存菜单树
    const json_data = JSON.stringify(root_menus, null, 2)
    fs.writeFileSync(__dirname + '/data/main_find_menu_tree3.json', json_data)
    console.log('菜单树已保存到 data/main_find_menu_tree3.json')
  } catch (error) {
    console.error('查询菜单树时出现错误:', error)
  } finally {
    await db.$disconnect()
  }
}
