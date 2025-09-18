// 查询 user_1 的菜单树 ,代码写在main_find_menu_tree2.ts中

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// 菜单树节点接口
interface MenuTreeNode {
  id: string
  name: string
  path?: string
  remark?: string
  parent_id?: string
  actions?: string
  children?: MenuTreeNode[]
}

// 构建菜单树的递归函数
function build_menu_tree(menus: MenuTreeNode[], parent_id: string | null = null): MenuTreeNode[] {
  const filtered_menus = menus.filter(menu => {
    const menu_parent_id = menu.parent_id || null
    return menu_parent_id === parent_id
  })
  
  return filtered_menus.map(menu => ({
    ...menu,
    children: build_menu_tree(menus, menu.id)
  }))
}

// 查询用户菜单树的主函数
async function find_user_menu_tree(user_id: string) {
  try {
    console.log(`开始查询用户 ${user_id} 的菜单树...`)

    // 1. 查询用户信息
    const user = await db.sys_user.findUnique({
      where: { id: user_id },
      select: { id: true, name: true, phone: true }
    })

    if (!user) {
      console.log(`用户 ${user_id} 不存在`)
      return null
    }

    console.log(`用户信息: ${user.name} (${user.phone})`)

    // 2. 查询用户的所有角色
    const user_departs = await db.ref_user_depart.findMany({
      where: { user_id: user_id },
      include: {
        sys_depart: {
          select: { id: true, name: true, is_depart: true, remark: true }
        }
      }
    })

    console.log(`用户角色数量: ${user_departs.length}`)
    user_departs.forEach(relation => {
      console.log(`  - ${relation.sys_depart.name} (${relation.sys_depart.is_depart ? '部门' : '角色'})`)
    })

    // 3. 查询用户角色对应的菜单权限
    const depart_ids = user_departs.map(relation => relation.depart_id)
    
    const menu_permissions = await db.ref_depart_menu.findMany({
      where: { 
        depart_id: { in: depart_ids }
      },
      include: {
        sys_menu: {
          select: { 
            id: true, 
            name: true, 
            path: true, 
            remark: true, 
            parent_id: true 
          }
        },
        sys_depart: {
          select: { name: true }
        }
      }
    })

    console.log(`菜单权限数量: ${menu_permissions.length}`)

    // 4. 去重并构建菜单数据
    const menu_map = new Map<string, MenuTreeNode>()
    
    menu_permissions.forEach(permission => {
      const menu = permission.sys_menu
      const key = menu.id
      
      if (!menu_map.has(key)) {
        menu_map.set(key, {
          id: menu.id,
          name: menu.name,
          path: menu.path || undefined,
          remark: menu.remark || undefined,
          parent_id: menu.parent_id || undefined,
          actions: permission.actions || undefined,
          children: []
        })
      } else {
        // 合并操作权限
        const existing = menu_map.get(key)!
        if (permission.actions && existing.actions) {
          const existing_actions = existing.actions.split(',')
          const new_actions = permission.actions.split(',')
          const all_actions = [...new Set([...existing_actions, ...new_actions])]
          existing.actions = all_actions.join(',')
        }
      }
    })

    // 5. 获取所有需要的父菜单
    const menu_ids = Array.from(menu_map.keys())
    const parent_menu_ids = new Set<string>()
    
    // 收集所有父菜单ID
    menu_map.forEach(menu => {
      if (menu.parent_id) {
        parent_menu_ids.add(menu.parent_id)
      }
    })

    // 查询父菜单信息
    if (parent_menu_ids.size > 0) {
      const parent_menus = await db.sys_menu.findMany({
        where: {
          id: { in: Array.from(parent_menu_ids) }
        },
        select: {
          id: true,
          name: true,
          path: true,
          remark: true,
          parent_id: true
        }
      })

      // 添加父菜单到菜单映射中
      parent_menus.forEach(menu => {
        if (!menu_map.has(menu.id)) {
          menu_map.set(menu.id, {
            id: menu.id,
            name: menu.name,
            path: menu.path || undefined,
            remark: menu.remark || undefined,
            parent_id: menu.parent_id || undefined,
            actions: 'find', // 父菜单默认只有查看权限
            children: []
          })
        }
      })
    }

    const menu_list = Array.from(menu_map.values())
    console.log(`去重后菜单数量: ${menu_list.length}`)

    // 调试：打印菜单列表
    console.log('\n=== 菜单列表详情 ===')
    menu_list.forEach(menu => {
      console.log(`菜单: ${menu.name} (ID: ${menu.id}, 父ID: ${menu.parent_id || 'null'})`)
    })

    // 6. 构建菜单树
    console.log('\n=== 开始构建菜单树 ===')
    const menu_tree = build_menu_tree(menu_list)

    // 7. 显示菜单树结构
    console.log('\n=== 用户菜单树结构 ===')
    function print_menu_tree(menus: MenuTreeNode[], level: number = 0) {
      const indent = '  '.repeat(level)
      menus.forEach(menu => {
        const actions_info = menu.actions ? ` (${menu.actions})` : ''
        const path_info = menu.path ? ` [${menu.path}]` : ''
        console.log(`${indent}${menu.name}${path_info}${actions_info}`)
        
        if (menu.children && menu.children.length > 0) {
          print_menu_tree(menu.children, level + 1)
        }
      })
    }

    print_menu_tree(menu_tree)

    // 8. 返回完整的菜单树数据
    return {
      user: user,
      roles: user_departs.map(relation => relation.sys_depart),
      menu_tree: menu_tree,
      menu_list: menu_list
    }

  } catch (error) {
    console.error('查询用户菜单树失败:', error)
    return null
  }
}

// 执行查询
async function main() {
  try {
    const result = await find_user_menu_tree('user_1')
    
    if (result) {
      console.log('\n=== 查询结果摘要 ===')
      console.log(`用户: ${result.user.name}`)
      console.log(`角色数量: ${result.roles.length}`)
      console.log(`菜单数量: ${result.menu_list.length}`)
      console.log(`菜单树层级: ${JSON.stringify(result.menu_tree, null, 2)}`)
    }
  } catch (error) {
    console.error('执行失败:', error)
  } finally {
    await db.$disconnect()
  }
}

// 导出函数供其他模块使用
export { find_user_menu_tree, build_menu_tree, MenuTreeNode }

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
  main()
}