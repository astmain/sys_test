import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
let user_id = 'user_2'

async function main({table_name, ids}: {table_name: string, ids: string[]}) {
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
    console.log(`查询结果11112:`, result)
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    await db.$disconnect()
  }
}

main({table_name: 'sys_menu', ids: ['688c6044-3b97-4568-8eac-2a3944a75676', '0038b708-e300-44f1-a83e-4f12b7ad188a', '1b911e93-6dd1-4285-8dfd-c199d65a3dde', '836e17d5-cf5b-4d25-b679-50a27492f5ed', 'f159741a-ffb1-41fd-abb4-fd0a3bd40f2b']}  )
