// 查询 user_1 的菜单树 ,代码写在main_find_menu_tree3.ts中

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const user_id = 'user_3'
main()
async function main() {
  const depart_ids = (await db.ref_user_depart.findMany({ where: { user_id: user_id } })).map((relation) => relation.depart_id)
  const menu_per = await db.ref_depart_menu.findMany({ where: { depart_id: { in: depart_ids } } })
  console.log(`111---menu_per:`, menu_per)
  const menu_ids = menu_per.map((permission) => permission.menu_id)
  console.log(`222---menu_ids:`, menu_ids)
  const menu_tree = await db.sys_menu.findMany({ where: { id: { in: menu_per.map((permission) => permission.menu_id) } }, include: { children: true } })
  console.log(`333---menu_tree:`, menu_tree)
}


