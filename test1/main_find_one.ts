import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

let user_id = '1'
main()
async function main() {
  let res= await db.menu.findMany({
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
      permission: true,
      parent: true,
      children: true
    },
    orderBy: [
      { level: 'asc' },
      { sort: 'asc' }
    ]
  })

  console.log(JSON.stringify(res, null, 2))
}