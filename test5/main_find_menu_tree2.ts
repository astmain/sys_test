import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
let user_id = 'user_2'
main()

//阅读main.js代码,然后 根据用户id查询菜单树,代码写在main_find_menu_tree2.ts中

async function main() {
  // let list=await db.sys_depart.findMany({ include: { sys_user: { where: { id: user_id } } } })
  let list = await db.sys_depart.findMany({
    where: { sys_user: { some: { id: user_id } } },
    include: { sys_menu: true },
  })
  // console.log(`111---list:`, JSON.stringify(list, null, 2))

  let menu_ids = [...new Set(list.flatMap((depart) => depart.sys_menu.map((menu) => menu.id)))]
  console.log(`menu_ids---:`, menu_ids)



  let all_ids = await get_all_ids({table_name: 'sys_menu', ids: menu_ids})
  console.log(`all_ids---:`, all_ids)

  let is_debugger = true
}




async function get_all_ids({table_name, ids}: {table_name: string, ids: string[]}) {
  try {
    // 测试数据
    // const menu_ids = ['688c6044-3b97-4568-8eac-2a3944a75676', '0038b708-e300-44f1-a83e-4f12b7ad188a', '1b911e93-6dd1-4285-8dfd-c199d65a3dde', '836e17d5-cf5b-4d25-b679-50a27492f5ed', 'f159741a-ffb1-41fd-abb4-fd0a3bd40f2b']

    // const table_name = 'sys_menu'

    // 测试递归SQL语句
    const recursive_sql = `
      WITH RECURSIVE menu_hierarchy AS (
          -- 基础查询：获取所有menu_ids对应的菜单
          SELECT 
              id,
              parent_id,
              0 as level
          FROM ${table_name} 
          WHERE id IN (${ids.map((id) => `'${id}'`).join(',')})
          
          UNION ALL
          
          -- 递归查询：向上查找父级菜单
          SELECT 
              m.id,
              m.parent_id,
              mh.level + 1
          FROM ${table_name} m
          INNER JOIN menu_hierarchy mh ON m.id = mh.parent_id
          WHERE mh.level < 10  -- 防止无限递归
      )
      SELECT DISTINCT id
      FROM menu_hierarchy
      ORDER BY id
    `

    // console.log(`执行的SQL:`, recursive_sql)

    const result = await db.$queryRawUnsafe(recursive_sql)
    // console.log(`查询结果11112:`, result)
    return result
  } catch (error) {
    console.error('查询失败:', error)
  } 
}

// all_ids({table_name: 'sys_menu', ids: ['688c6044-3b97-4568-8eac-2a3944a75676', '0038b708-e300-44f1-a83e-4f12b7ad188a', '1b911e93-6dd1-4285-8dfd-c199d65a3dde', '836e17d5-cf5b-4d25-b679-50a27492f5ed', 'f159741a-ffb1-41fd-abb4-fd0a3bd40f2b']}  )
