# 这个表结构可以支持 不同部门中的职位 看到的菜单的权限吗?新增,修改,删除,查找的权限吗
<!-- 完全基于部门的权限模型(最简化版)不需要有角色表 -->
// 1 用户表
model user {
  id               String            @id @default(cuid())
  phone            String            @unique
  name             String
  password         String            @default("123456")
  // 支持多部门关联
  user_departments user_department[]
}

// 2 部门表
model department {
  id               String            @id @default(cuid())
  name             String
  code             String            @unique
  level            Int               @default(1)
  sort             Int               @default(0)
  remark           String?
  // 树形结构
  parent_id        String?
  parent           department?       @relation("DepartmentHierarchy", fields: [parent_id], references: [id])
  children         department[]      @relation("DepartmentHierarchy")
  // 部门关联
  user_departments user_department[]
  department_menus department_menu[]
}

// 3 菜单表
model menu {
  id            String      @id @default(cuid())
  name          String
  code          String      @unique
  path          String?
  level         Int         @default(1)
  sort          Int         @default(0)
  parent_id     String?
  parent        menu?       @relation("MenuHierarchy", fields: [parent_id], references: [id])
  children      menu[]      @relation("MenuHierarchy")
  // 直接关联部门
  department_menus department_menu[]
}

// 4 用户部门关联表（支持多部门）
model user_department {
  id            String     @id @default(cuid())
  user_id       String
  department_id String
  is_primary    Boolean    @default(false) // 是否为主部门
  // 关联关系
  user          user       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  department    department @relation(fields: [department_id], references: [id], onDelete: Cascade)
  @@unique([user_id, department_id])
}

// 5 部门菜单关联表
model department_menu {
  id            String     @id @default(cuid())
  department_id String
  menu_id       String
  department    department @relation(fields: [department_id], references: [id], onDelete: Cascade)
  menu          menu       @relation(fields: [menu_id], references: [id], onDelete: Cascade)
  @@unique([department_id, menu_id])
}

<!-- 查询用户菜单的简化函数 -->
// 通过用户ID获取菜单树（完全基于部门）
async function get_user_menus(user_id: string) {
  // 查询用户有权限的菜单（通过部门）
  const menus = await db.menu.findMany({
    where: {
      department_menus: {
        some: {
          department: {
            user_departments: {
              some: {
                user_id: user_id
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
  return build_menu_tree(menus)
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

// 获取用户的所有部门
async function get_user_departments(user_id: string) {
  return await db.user_department.findMany({
    where: { user_id },
    include: {
      department: true
    }
  })
}

// 为部门分配菜单权限
async function assign_menu_to_department(department_id: string, menu_id: string) {
  return await db.department_menu.create({
    data: {
      department_id,
      menu_id
    }
  })
}

// 为用户分配部门
async function assign_user_to_department(user_id: string, department_id: string, is_primary: boolean = false) {
  return await db.user_department.create({
    data: {
      user_id,
      department_id,
      is_primary
    }
  })
}



<!-- 这个最简化方案的优势 -->
极简设计：只有4个核心表，关系清晰
完全基于部门：权限完全通过部门控制，无需角色表
支持用户多部门：一个用户可以属于多个部门
查询简单：权限查询路径最短
易于维护：表关系简单，便于理解和维护
权限控制逻辑
部门权限：每个部门分配不同的菜单权限
用户权限：用户通过所属部门获得菜单权限
多部门支持：用户可以从多个部门获得权限的并集
这样您就有了一个完全基于部门的、最简化的权限模型，既支持用户多部门，又大大简化了表关系的复杂度。