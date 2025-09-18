import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// 定义用户ID
let user_id = 'user_1' //阅读main.js代码,然后 根据用户id查询菜单树,代码写在main_find_menu_tree2.ts中

async function main() {
  console.log(`开始查询用户 ${user_id} 的菜单树...`)

  try {
    // 1. 根据用户ID查询用户信息及其关联的部门/角色
    const user = await db.sys_user.findUnique({
      where: { id: user_id },
      include: {
        sys_depart: {
          include: {
            sys_menu: true,
          },
        },
      },
    })

    if (!user) {
      console.log(`用户 ${user_id} 不存在`)
      return
    }

    // console.log(`用户信息: ${user.name} (${user.phone})`)
    // console.log(`用户关联的部门/角色数量: ${user.sys_depart.length}`)

    // 2. 获取用户有权限的菜单ID列表
    let menu_ids = user.sys_depart.flatMap((depart) => depart.sys_menu.map((menu) => menu.id))
    console.log(`用户有权限的菜单ID数量: ${menu_ids.length}`)
    console.log(`菜单ID列表:`, menu_ids)

    // 3. 使用CTE递归查询获取完整的菜单层级结构
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

    // 4. 修复 BigInt 序列化问题
    const serialized_result = JSON.parse(JSON.stringify(menu_tree_result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    // console.log('\n=== 菜单层级结构 ===')
    // console.log(JSON.stringify(serialized_result, null, 2))

    // 5. 构建菜单树结构
    const menu_tree = build_menu_tree(serialized_result)
    console.log('\n=== 构建的菜单树 ===')
    console.log(JSON.stringify(menu_tree, null, 2))



  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    await db.$disconnect()
  }
}

// 构建菜单树的辅助函数
function build_menu_tree(menu_list: any[]) {
  const menu_map = new Map()
  const root_menus = []
  
  // 创建菜单映射
  menu_list.forEach(menu => {
    menu_map.set(menu.id, {
      ...menu,
      children: []
    })
  })
  
  // 构建树结构
  menu_list.forEach(menu => {
    const menu_node = menu_map.get(menu.id)
    if (menu.parent_id && menu_map.has(menu.parent_id)) {
      const parent = menu_map.get(menu.parent_id)
      parent.children.push(menu_node)
    } else {
      root_menus.push(menu_node)
    }
  })
  
  return root_menus
}

// 过滤出用于前端显示的菜单（排除权限菜单）
function filter_display_menus(menu_tree: any[]) {
  return menu_tree.map(menu => {
    const filtered_menu = {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      remark: menu.remark,
      children: []
    }
    
    // 如果有子菜单，递归过滤
    if (menu.children && menu.children.length > 0) {
      filtered_menu.children = filter_display_menus(menu.children)
    }
    
    return filtered_menu
  }).filter(menu => {
    // 只保留有子菜单的根菜单或者非权限菜单
    return !menu.id.startsWith('menu_') || (menu.children && menu.children.length > 0)
  })
}

// 按层级分组菜单
function group_menus_by_level(menu_list: any[]) {
  const grouped = {}
  menu_list.forEach(menu => {
    const level = menu.level
    if (!grouped[level]) {
      grouped[level] = []
    }
    grouped[level].push(menu)
  })
  return grouped
}

// 执行main函数
main().catch((e) => {
  console.error(e)
  process.exit(1)
})