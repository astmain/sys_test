// 查询 user_1 的菜单树 ,代码写在main_find_menu_tree3.ts中

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// 菜单树节点接口
interface MenuTreeNode {
  id: string
  name: string
  path?: string
  parent_id?: string
  actions?: string
  children?: MenuTreeNode[]
}

// 构建菜单树的递归函数
function build_menu_tree(menus: MenuTreeNode[], parent_id: string | null = null): MenuTreeNode[] {
  return menus
    .filter((menu) => (menu.parent_id || null) === parent_id)
    .map((menu) => ({
      ...menu,
      children: build_menu_tree(menus, menu.id),
    }))
}

// 查询用户菜单树的主函数
async function find_user_menu_tree(user_id: string) {
  try {
    // 1. 查询用户角色
    const user_departs = await db.ref_user_depart.findMany({
      where: { user_id: user_id },
      select: { depart_id: true },
    })

    if (user_departs.length === 0) {
      return null
    }

    // 2. 查询菜单权限
    const depart_ids = user_departs.map((relation) => relation.depart_id)
    const menu_permissions = await db.ref_depart_menu.findMany({
      where: { depart_id: { in: depart_ids } },
      include: {
        sys_menu: {
          select: { id: true, name: true, path: true, parent_id: true },
        },
      },
    })

    // 3. 去重并构建菜单数据
    const menu_map = new Map<string, MenuTreeNode>()

    menu_permissions.forEach((permission) => {
      const menu = permission.sys_menu
      const key = menu.id

      if (!menu_map.has(key)) {
        menu_map.set(key, {
          id: menu.id,
          name: menu.name,
          path: menu.path || undefined,
          parent_id: menu.parent_id || undefined,
          actions: permission.actions || undefined,
          children: [],
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

    // 4. 自动添加父菜单权限
    const menu_list = Array.from(menu_map.values())
    const has_root_menus = menu_list.some((menu) => !menu.parent_id)

    if (!has_root_menus && menu_list.length > 0) {
      const parent_menu_ids = new Set<string>()
      menu_list.forEach((menu) => {
        if (menu.parent_id) {
          parent_menu_ids.add(menu.parent_id)
        }
      })

      if (parent_menu_ids.size > 0) {
        const parent_menus = await db.sys_menu.findMany({
          where: { id: { in: Array.from(parent_menu_ids) } },
          select: { id: true, name: true, path: true, parent_id: true },
        })

        parent_menus.forEach((menu) => {
          if (!menu_map.has(menu.id)) {
            menu_map.set(menu.id, {
              id: menu.id,
              name: menu.name,
              path: menu.path || undefined,
              parent_id: menu.parent_id || undefined,
              actions: 'find',
              children: [],
            })
          }
        })
      }
    }

    // 5. 构建并返回菜单树
    const final_menu_list = Array.from(menu_map.values())
    return build_menu_tree(final_menu_list)
  } catch (error) {
    console.error('查询用户菜单树失败:', error)
    return null
  }
}

// 执行查询
async function main() {
  try {
    const menu_tree = await find_user_menu_tree('user_1')

    if (menu_tree) {
      console.log('用户菜单树:')
      console.log(JSON.stringify(menu_tree, null, 2))
    } else {
      console.log('未找到菜单树')
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
