import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()

let user_id = '5'
main()

// 查询用户有权限的菜单树
async function main() {
  try {
    // 查询用户有权限的菜单
    const menus = await db.menu.findMany({
      where: {
        permission: {
          role_permissions: {
            some: {
              role: {
                user_roles: {
                  some: {
                    user_id: user_id
                  }
                }
              }
            }
          }
        }
      },
      include: {
        children: {
          include: {
            children: true // 支持多级菜单
          }
        },
        parent: true,
        permission: true
      },
      orderBy: [
        { level: 'asc' },
        { sort: 'asc' }
      ]
    })

    // 构建菜单树
    let menu_tree = build_menu_tree(menus)

    // 输出结果
    console.log('菜单树结构:')
    console.log(JSON.stringify(menu_tree, null, 2))

    // 保存到文件
    const dataDir = 'data'
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync('data/main_find_menu_tree.json', JSON.stringify(menu_tree, null, 2))
    console.log('菜单树已保存到 data/main_find_menu_tree.json')
    let is_debugger=true

  } catch (error) {
    console.error('查询菜单树时出现错误:', error)
  } finally {
    await db.$disconnect()
  }
}

// 构建菜单树的辅助函数
function build_menu_tree(menus: any[]) {
  const menu_map = new Map()
  const root_menus = []

  // 创建菜单映射
  menus.forEach(menu => {
    menu_map.set(menu.id, {
      id: menu.id,
      name: menu.name,
      code: menu.code,
      path: menu.path,
      level: menu.level,
      sort: menu.sort,
      permission_id: menu.permission_id,
      parent_id: menu.parent_id,
      children: [],
      parent: menu.parent
    })
  })

  // 构建树形结构
  menus.forEach(menu => {
    if (menu.parent_id) {
      const parent = menu_map.get(menu.parent_id)
      if (parent) {
        parent.children.push(menu_map.get(menu.id))
      }
    } else {
      root_menus.push(menu_map.get(menu.id))
    }
  })

  return root_menus
}