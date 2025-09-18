import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
main()

async function main() {
  const user = await db.sys_user.findUnique({
    where: { id: 'user_1' },
    include: {
      sys_depart: {
        include: {
          sys_menu: true,
        },
      },
    },
  })
  // console.log(JSON.stringify(user, null, 2))

  let depart_ids = user.sys_depart.map((depart) => depart.id)
  console.log(`depart_ids---`, depart_ids)

  let menu_ids = user.sys_depart.flatMap((depart) => depart.sys_menu.map((menu) => menu.id))
  console.log(`menu_ids---:`, menu_ids)

  // 使用CTE递归查询组织层级   找 menu_ids 的菜单
  const menu_tree_query = `
    WITH RECURSIVE menu_hierarchy AS (
        -- 基础查询：获取所有menu_ids对应的菜单
        SELECT 
            id,
            name,
            path,
            parent_id,
            is_permiss,
            is_view,
            is_find,
            is_save,
            is_del,
            0 as level,
            CAST(id as TEXT) as path_ids
        FROM sys_menu 
        WHERE id IN (${menu_ids.map((id) => `'${id}'`).join(',')})
        
        UNION ALL
        
        -- 递归查询：向上查找父级菜单
        SELECT 
            m.id,
            m.name,
            m.path,
            m.parent_id,
            m.is_permiss,
            m.is_view,
            m.is_find,
            m.is_save,
            m.is_del,
            mh.level + 1 as level,
            m.id || ',' || mh.path_ids as path_ids
        FROM sys_menu m
        INNER JOIN menu_hierarchy mh ON m.id = mh.parent_id
        WHERE mh.level < 10  -- 防止无限递归
    )
    SELECT DISTINCT
        id,
        name,
        path,
        parent_id,
        is_permiss,
        is_view,
        is_find,
        is_save,
        is_del,
        level,
        path_ids
    FROM menu_hierarchy
    ORDER BY level DESC, name
`

  const menu_tree_result = await db.$queryRawUnsafe(menu_tree_query)
  // 修复 BigInt 序列化问题
  const serialized_result = JSON.parse(JSON.stringify(menu_tree_result, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ))
  
  console.log('菜单层级结构:', JSON.stringify(serialized_result, null, 2))



  // let menu_per_ids= user.sys_depart.sys_menu.filter(menu => menu.is_permiss).map(menu => menu.id)

  let is_debugger = true
}
