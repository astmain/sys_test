import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
main()
async function main() {
  console.log('\n=== 用户权限查询示例 ===')
  const user_permissions = await db.sys_user.findUnique({
    where: { id: 'user_1' },
    include: {
      ref_user_depart: {
        include: {
          sys_depart: {
            include: {
              ref_depart_menu: {
                include: {
                  sys_menu: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (user_permissions) {
    console.log(`用户 ${user_permissions.name} 的权限:`)
    user_permissions.ref_user_depart.forEach((relation) => {
      console.log(`  角色: ${relation.sys_depart.name}`)
      relation.sys_depart.ref_depart_menu.forEach((menu_relation) => {
        console.log(`    菜单: ${menu_relation.sys_menu.name} (${menu_relation.actions})`)
      })
    })
  }
}
