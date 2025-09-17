import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const db = new PrismaClient()

let user_id = '2'
main()

async function main() {
  let res = await db.menu.findMany({
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
  //使用fs将res写入到文件中
  fs.writeFileSync('data/main_find_one.json', JSON.stringify(res, null, 2))
  // fs.writeFileSync('data/main_find_one.json', JSON.stringify(res))
  let zzz = 1
}