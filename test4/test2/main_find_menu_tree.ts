import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()

let user_id = 'user_1'
main()

// 简化版本 - 直接查询用户有权限的菜单
async function main() {
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
      parent: true
    },
    orderBy: [
      { level: 'asc' },
      { sort: 'asc' }
    ]
  })

  // 构建菜单树
  let res = build_menu_tree(menus)
  console.log(JSON.stringify(res, null, 2))
  //使用fs将res写入到文件中
  fs.writeFileSync('data/main_find_menu_tree.json', JSON.stringify(res, null, 2))
  let zzz = 1
}

// 构建菜单树的辅助函数
function build_menu_tree(menus: any[]) {
  const menu_map = new Map()
  const root_menus = []

  // 创建菜单映射
  menus.forEach(menu => {
    menu_map.set(menu.id, { ...menu, children: [] })
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