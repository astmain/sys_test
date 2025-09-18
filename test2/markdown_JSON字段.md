<!-- 支持按钮权限的权限模型 -->
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
  // 菜单权限（JSON存储，包含按钮权限）
  menu_permissions String? // JSON存储：{"menu1": ["view", "add", "edit"], "menu2": ["view", "delete"]}
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
  // 按钮配置（JSON存储）
  button_config String? // JSON存储：["view", "add", "edit", "delete", "export", "import"]
}

<!-- 权限控制函数 -->
// 按钮权限类型定义
type ButtonPermission = 'view' | 'add' | 'edit' | 'delete' | 'export' | 'import' | 'search'

// 菜单权限类型
type MenuPermissions = {
  [menuId: string]: ButtonPermission[]
}

// 通过用户ID获取菜单树（包含按钮权限）
async function get_user_menus_with_buttons(user_id: string) {
  const user = await db.user.findUnique({
    where: { id: user_id },
    select: { menu_permissions: true }
  })

  if (!user?.menu_permissions) return []

  const menu_permissions: MenuPermissions = JSON.parse(user.menu_permissions)
  const menu_ids = Object.keys(menu_permissions)
  
  const menus = await db.menu.findMany({
    where: {
      id: { in: menu_ids }
    },
    orderBy: [
      { level: 'asc' },
      { sort: 'asc' }
    ]
  })

  // 为每个菜单添加按钮权限
  const menus_with_buttons = menus.map(menu => ({
    ...menu,
    button_permissions: menu_permissions[menu.id] || [],
    // 解析按钮配置
    available_buttons: menu.button_config ? JSON.parse(menu.button_config) : []
  }))

  return build_menu_tree(menus_with_buttons)
}

// 检查用户对特定菜单的按钮权限
async function check_button_permission(user_id: string, menu_id: string, button: ButtonPermission): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: user_id },
    select: { menu_permissions: true }
  })

  if (!user?.menu_permissions) return false

  const menu_permissions: MenuPermissions = JSON.parse(user.menu_permissions)
  const user_buttons = menu_permissions[menu_id] || []
  
  return user_buttons.includes(button)
}

// 检查用户对特定菜单的多个按钮权限
async function check_multiple_button_permissions(user_id: string, menu_id: string, buttons: ButtonPermission[]): Promise<{ [key: string]: boolean }> {
  const user = await db.user.findUnique({
    where: { id: user_id },
    select: { menu_permissions: true }
  })

  if (!user?.menu_permissions) {
    return buttons.reduce((acc, btn) => ({ ...acc, [btn]: false }), {})
  }

  const menu_permissions: MenuPermissions = JSON.parse(user.menu_permissions)
  const user_buttons = menu_permissions[menu_id] || []
  
  return buttons.reduce((acc, btn) => ({
    ...acc,
    [btn]: user_buttons.includes(btn)
  }), {})
}

// 为用户分配菜单按钮权限
async function assign_menu_button_permissions(user_id: string, menu_id: string, buttons: ButtonPermission[]) {
  const user = await db.user.findUnique({
    where: { id: user_id },
    select: { menu_permissions: true }
  })

  const current_permissions: MenuPermissions = user?.menu_permissions ? JSON.parse(user.menu_permissions) : {}
  current_permissions[menu_id] = buttons

  return await db.user.update({
    where: { id: user_id },
    data: {
      menu_permissions: JSON.stringify(current_permissions)
    }
  })
}

// 构建菜单树（包含按钮权限）
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


<!-- 前端使用示例 -->
// 前端权限控制组件
interface ButtonPermissionProps {
  menuId: string
  button: ButtonPermission
  children: React.ReactNode
}

function ButtonPermission({ menuId, button, children }: ButtonPermissionProps) {
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    check_button_permission(userId, menuId, button).then(setHasPermission)
  }, [menuId, button])

  if (!hasPermission) return null
  return <>{children}</>
}

// 使用示例
function UserManagementPage() {
  return (
    <div>
      <h1>用户管理</h1>
      
      {/* 搜索按钮 */}
      <ButtonPermission menuId="user_management" button="search">
        <Button>搜索</Button>
      </ButtonPermission>

      {/* 新增按钮 */}
      <ButtonPermission menuId="user_management" button="add">
        <Button>新增用户</Button>
      </ButtonPermission>

      {/* 编辑按钮 */}
      <ButtonPermission menuId="user_management" button="edit">
        <Button>编辑</Button>
      </ButtonPermission>

      {/* 删除按钮 */}
      <ButtonPermission menuId="user_management" button="delete">
        <Button>删除</Button>
      </ButtonPermission>

      {/* 导出按钮 */}
      <ButtonPermission menuId="user_management" button="export">
        <Button>导出</Button>
      </ButtonPermission>
    </div>
  )
}

<!-- 权限数据示例 -->
// 用户权限数据示例
{
  "menu_permissions": {
    "user_management": ["view", "add", "edit", "search"],
    "order_management": ["view", "search", "export"],
    "product_management": ["view", "add", "edit", "delete", "import"]
  }
}

// 菜单按钮配置示例
{
  "button_config": ["view", "add", "edit", "delete", "search", "export", "import"]
}


<!-- 这个方案的优势 -->
细粒度控制：精确控制每个菜单的按钮权限
简单高效：只有3个表，查询性能极佳
灵活配置：支持动态配置菜单按钮
易于维护：权限数据集中存储，便于管理
前端友好：提供完整的权限检查函数
这样您就可以精确控制用户在每个菜单页面能看到哪些按钮了！


<!-- 这个方案的缺点 -->
1. JSON存储的缺点
数据一致性问题
JSON字段无法使用数据库约束，容易出现数据不一致
无法保证JSON格式的正确性，可能导致解析错误
权限数据分散在JSON中，难以进行数据验证
查询性能问题
无法对JSON字段建立索引，查询性能差
每次权限检查都需要解析JSON，增加CPU开销
无法使用SQL的JOIN操作进行复杂查询
数据维护困难
权限变更时需要重新序列化整个JSON
无法进行部分更新，必须全量替换
数据备份和恢复复杂
2. 权限管理复杂
权限分配繁琐
需要为每个用户单独分配菜单按钮权限
无法批量管理权限，操作效率低
权限继承机制缺失，无法从部门继承权限
权限审计困难
无法追踪权限变更历史
难以统计权限使用情况
权限冲突检测困难
3. 扩展性限制
按钮类型固化
按钮权限类型硬编码，难以扩展
无法支持动态按钮权限
无法支持条件权限（如：只能编辑自己的数据）
多租户支持差
无法支持不同租户的权限隔离
权限数据混合存储，安全性差
4. 开发维护问题
代码复杂度高
权限检查逻辑分散，难以维护
前端组件需要频繁调用权限检查
错误处理复杂，调试困难
测试困难
权限逻辑难以单元测试
权限边界条件测试复杂
权限回归测试困难
5. 安全性问题
权限绕过风险
前端权限控制可以被绕过
缺乏服务端权限验证
权限数据可能被篡改
数据泄露风险
JSON字段可能包含敏感信息
权限数据在传输过程中可能泄露