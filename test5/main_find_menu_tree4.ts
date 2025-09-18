import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// 定义用户ID
let user_id = 'user_1'

async function main() {
  console.log(`开始查询用户 ${user_id} 的菜单树...`)
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
    console.log(`用户关联的部门/角色数量:`, user.sys_depart)

    // 2. 获取用户有权限的菜单ID列表
    let menu_ids = user.sys_depart.flatMap((depart) => depart.sys_menu.map((menu) => menu.id))
    console.log(`用户有权限的菜单ID数量: ${menu_ids.length}`)
    console.log(`菜单ID列表:`, menu_ids)  //根据menu_ids 找到 父子级菜单
    const menu_list = await db.sys_menu.findMany({ where: { id: { in: menu_ids } }, include: { parent: {include: {parent: {include: {parent: {include: {parent: true}}}}}}} })
    console.log(`菜单树:`, menu_list)

    // 遍历menu_list 得到所有父级菜单
    const parent_menu_ids = new Set<string>()
    menu_list.forEach((menu) => {
      if (menu.parent_id) {
        parent_menu_ids.add(menu.parent_id)
      }
    })
    console.log(`父级菜单ID列表:`, parent_menu_ids)









}


main()