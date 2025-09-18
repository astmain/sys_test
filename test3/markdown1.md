// 基于用户、部门和菜单的ABAC权限模型（支持多部门）
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 操作类型 - 针对菜单的可能操作
enum Action {
  VIEW       // 查看菜单
  ACCESS     // 访问菜单对应的功能
  CONFIGURE  // 配置菜单（如排序、隐藏等）
  MANAGE     // 管理菜单（如增删改）
}

// 用户状态
enum UserStatus {
  ACTIVE
  INACTIVE
  LOCKED
  SUSPENDED
}

// 部门
model Department {
  id          String    @id @default(uuid())
  name        String    @unique // 部门名称
  parentId    String?   // 上级部门ID
  level       Int       // 部门级别（如1=公司, 2=部门, 3=小组）
  description String?   // 部门描述
  // 支持多部门关联
  userDepartments UserDepartment[] // 用户部门关联
  parent      Department? @relation("DepartmentHierarchy", fields: [parentId], references: [id])
  children    Department[] @relation("DepartmentHierarchy")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// 用户（主体）
model User {
  id            String    @id @default(uuid())
  username      String    @unique // 用户名
  name          String    // 姓名
  email         String    @unique // 邮箱
  status        UserStatus @default(ACTIVE)
  attributes    UserAttribute[] // 用户属性
  // 支持多部门关联
  userDepartments UserDepartment[] // 用户部门关联
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// 用户部门关联表（支持多部门）
model UserDepartment {
  id            String     @id @default(uuid())
  userId        String
  departmentId  String
  isPrimary     Boolean    @default(false) // 是否为主部门
  joinDate      DateTime   @default(now()) // 加入部门时间
  status        String     @default("active") // 状态：active, inactive
  // 关联关系
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  department    Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@unique([userId, departmentId])
}

// 用户属性
model UserAttribute {
  id          String    @id @default(uuid())
  userId      String
  key         String    // 属性键（如"role", "grade", "isManager"）
  value       String    // 属性值（如"admin", "P3", "true"）
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, key])
}

// 菜单（客体）
model Menu {
  id          String    @id @default(uuid())
  name        String    // 菜单名称
  code        String    @unique // 菜单编码
  path        String    // 菜单路径
  parentId    String?   // 父菜单ID
  icon        String?   // 菜单图标
  sortOrder   Int       // 排序序号
  isEnabled   Boolean   @default(true) // 是否启用
  attributes  MenuAttribute[] // 菜单属性
  parent      Menu?     @relation("MenuHierarchy", fields: [parentId], references: [id])
  children    Menu[]    @relation("MenuHierarchy")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// 菜单属性
model MenuAttribute {
  id          String    @id @default(uuid())
  menuId      String
  key         String    // 属性键（如"sensitivity", "businessDomain", "requiresApproval"）
  value       String    // 属性值（如"high", "finance", "true"）
  menu        Menu      @relation(fields: [menuId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([menuId, key])
}

// 访问控制策略
model Policy {
  id                  String    @id @default(uuid())
  name                String    @unique // 策略名称
  description         String?   // 策略描述
  effect              Boolean   // 策略效果：true=允许，false=拒绝
  actions             Action[]  // 适用的操作列表
  userRules           String?   // 用户规则表达式（如"role = 'admin' OR grade >= 'P5'"）
  departmentRules     String?   // 部门规则表达式（如"name = '财务部' AND level <= 2"）
  menuRules           String?   // 菜单规则表达式（如"sensitivity = 'low' OR businessDomain = 'common'"）
  priority            Int       // 策略优先级（数字越大优先级越高）
  isEnabled           Boolean   @default(true) // 策略是否启用
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

// 访问日志
model AccessLog {
  id                  String    @id @default(uuid())
  userId              String
  menuId              String
  action              Action    // 尝试执行的操作
  decision            Boolean?  // 决策结果：true=允许，false=拒绝
  policyId            String?   // 匹配的策略ID
  timestamp           DateTime  @default(now())
  user                User      @relation(fields: [userId], references: [id])
  menu                Menu      @relation(fields: [menuId], references: [id])
  policy              Policy?   @relation(fields: [policyId], references: [id])
}