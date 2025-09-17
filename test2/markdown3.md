<!-- 方案一：JSON存储权限（最简化） -->

// 用户表
model user {
  id               String            @id @default(cuid())
  phone            String            @unique
  name             String
  password         String            @default("123456")
  // 支持多部门关联
  user_departments user_department[]
}

// 部门表
model department {
  id               String            @id @default(cuid())
  name             String
  code             String            @unique
  level            Int               @default(1)
  sort             Int               @default(0)
  remark           String?
  // 权限配置（JSON格式存储菜单ID数组）
  menu_ids         String? // 存储菜单ID数组，如：["menu1", "menu2", "menu3"]
  // 树形结构
  parent_id        String?
  parent           department?       @relation("DepartmentHierarchy", fields: [parent_id], references: [id])
  children         department[]      @relation("DepartmentHierarchy")
  // 部门关联
  user_departments user_department[]
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
}

// 用户部门关联表（支持多部门）
model user_department {
  id            String     @id @default(cuid())
  user_id       String
  department_id String
  is_primary    Boolean    @default(false)
  // 关联关系
  user          user       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  department    department @relation(fields: [department_id], references: [id], onDelete: Cascade)
  @@unique([user_id, department_id])
}

<!-- 方案二：用户直接存储权限（超简化 -->

// 用户表
model user {
  id               String            @id @default(cuid())
  phone            String            @unique
  name             String
  password         String            @default("123456")
  // 直接存储部门ID和菜单权限
  department_ids   String? // JSON数组：["dept1", "dept2"]
  menu_ids         String? // JSON数组：["menu1", "menu2", "menu3"]
}

// 部门表（仅用于显示）
model department {
  id               String            @id @default(cuid())
  name             String
  code             String            @unique
  level            Int               @default(1)
  sort             Int               @default(0)
  remark           String?
  parent_id        String?
  parent           department?       @relation("DepartmentHierarchy", fields: [parent_id], references: [id])
  children         department[]      @relation("DepartmentHierarchy")
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
}


<!-- 方案三：混合方案（推荐） -->

// 用户表
model user {
  id               String            @id @default(cuid())
  phone            String            @unique
  name             String
  password         String            @default("123456")
  // 主部门ID
  primary_department_id String?
  primary_department    department?  @relation("PrimaryDepartment", fields: [primary_department_id], references: [id])
  // 其他部门权限（JSON存储）
  extra_department_ids  String? // JSON数组：["dept2", "dept3"]
  // 菜单权限（JSON存储）
  menu_ids         String? // JSON数组：["menu1", "menu2", "menu3"]
}

// 部门表
model department {
  id               String            @id @default(cuid())
  name             String
  code             String            @unique
  level            Int               @default(1)
  sort             Int               @default(0)
  remark           String?
  parent_id        String?
  parent           department?       @relation("DepartmentHierarchy", fields: [parent_id], references: [id])
  children         department[]      @relation("DepartmentHierarchy")
  // 主部门用户
  primary_users    user[]            @relation("PrimaryDepartment")
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
}


查询函数（方案三）
// 通过用户ID获取菜单树
async function get_user_menus(user_id: string) {
  const user = await db.user.findUnique({
    where: { id: user_id },
    select: { menu_ids: true }
  })

  if (!user?.menu_ids) return []

  const menu_ids = JSON.parse(user.menu_ids)
  
  const menus = await db.menu.findMany({
    where: {
      id: { in: menu_ids }
    },
    orderBy: [
      { level: 'asc' },
      { sort: 'asc' }
    ]
  })

  return build_menu_tree(menus)
}

// 构建菜单树
function build_menu_tree(menus: any[]) {
  const menu_map = new Map()
  const root_menus = []

  menus.forEach(menu => {
    menu_map.set(menu.id, { ...menu, children: [] })
  })

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



<!-- 各方案对比 -->
方案	表数量	关系复杂度	查询性能	维护难度	灵活性
原方案	6个表	高	中等	高	高
部门关联方案	4个表	中等	好	中等	中等
JSON存储方案	3个表	低	最好	低	中等
用户直接存储	2个表	最低	最好	最低	低
<!-- 推荐方案三，因为： -->
最简化：只有3个表
性能最好：查询路径最短
支持多部门：主部门+额外部门
易于维护：关系简单清晰
灵活性适中：满足大部分业务需求
您觉得哪个方案最适合您的需求？