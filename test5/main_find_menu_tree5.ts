// 查询 user_1 的菜单树 ,代码写在main_find_menu_tree3.ts中

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const user_id = 'user_3'
main()
async function main() {
  const { menu_ids, map_action } = await menu_ids_AND_map_action(user_id)

  const menu_tree = await db.sys_menu.findMany({ where: { id: { in: menu_ids } }, include: { children: true } })

  // 为菜单添加权限信息
  const menu_tree_with_permissions = menu_tree.map((menu) => ({ ...menu, actions: map_action.get(menu.id) || '' }))

  console.log(`菜单树（含权限）:`, JSON.stringify(menu_tree_with_permissions, null, 2))
}

async function menu_ids_AND_map_action(user_id: string) {
  const ref_user_depart = await db.ref_user_depart.findMany({ where: { user_id: user_id } })
  const depart_ids = ref_user_depart.map((o) => o.depart_id)
  const menu_per = await db.ref_depart_menu.findMany({ where: { depart_id: { in: depart_ids } } })
  const map_action = new Map<string, string>()
  menu_per.forEach((permission) => {
    const existing = map_action.get(permission.menu_id)
    if (existing) {
      const existing_actions = existing.split(',')
      const new_actions = permission.actions?.split(',') || []
      const all_actions = [...new Set([...existing_actions, ...new_actions])]
      map_action.set(permission.menu_id, all_actions.join(','))
    } else {
      map_action.set(permission.menu_id, permission.actions || '')
    }
  })

  const menu_ids = menu_per.map((o) => o.menu_id)
  console.log(`menu_ids:`, menu_ids)
  console.log(`depart_ids:`, depart_ids)
  console.log(`map_action:`, map_action)
  return { map_action, menu_ids  ,depart_ids}
}
