// 方案一优化版：支持用户多部门的简化权限模型
// 用户表 - 保持独立，不直接关联部门
model user {
  id               String            @id @default(cuid())
  phone            String            @unique
  name             String
  password         String            @default("123456")
  // 支持多部门关联
  user_departments user_department[]
  // 保留角色关联
  user_roles       user_role[]
}

// 部门表
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

// 菜单表
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

// 用户部门关联表（支持多部门）
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

// 部门菜单关联表
model department_menu {
  id            String     @id @default(cuid())
  department_id String
  menu_id       String
  department    department @relation(fields: [department_id], references: [id], onDelete: Cascade)
  menu          menu       @relation(fields: [menu_id], references: [id], onDelete: Cascade)
  @@unique([department_id, menu_id])
}

// 角色表（用于特殊权限控制）
model role {
  id               String            @id @default(cuid())
  name             String            @unique
  code             String            @unique
  remark           String?
  sort             Int               @default(0)
  user_roles       user_role[]
}

// 用户角色关联表
model user_role {
  id      String @id @default(cuid())
  user_id String
  role_id String
  user    user   @relation(fields: [user_id], references: [id], onDelete: Cascade)
  role    role   @relation(fields: [role_id], references: [id], onDelete: Cascade)
  @@unique([user_id, role_id])
}



// 查询用户菜单的优化函数
// 通过用户ID获取菜单树（支持多部门）
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



这个方案的优势
支持用户多部门：通过 user_department 表实现
简化权限控制：主要通过部门来分配菜单权限
减少关系复杂度：去掉了复杂的权限表，直接通过部门控制菜单
保持灵活性：仍然保留角色表，用于特殊权限控制
查询性能更好：查询路径更短，减少了JOIN层级
权限分配逻辑
部门权限：每个部门可以分配不同的菜单权限
用户权限：用户通过所属部门获得菜单权限
角色权限：用于特殊场景的额外权限控制
这样既支持了用户多部门的需求，又大大简化了表关系的复杂度。您觉得这个优化方案如何？