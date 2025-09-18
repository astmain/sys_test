

// // 使用CTE递归查询组织层级
// async function getOrgHierarchyWithSQL(orgId: string) {
//   const result = await prisma.$queryRaw`
//     WITH RECURSIVE org_hierarchy AS (
//       -- 基础查询：起始组织
//       SELECT id, name, parent_id, 0 as level
//       FROM sys_org 
//       WHERE id = ${orgId}

//       UNION ALL

//       -- 递归查询：父级组织
//       SELECT o.id, o.name, o.parent_id, oh.level + 1
//       FROM sys_org o
//       INNER JOIN org_hierarchy oh ON o.id = oh.parent_id
//     )
//     SELECT * FROM org_hierarchy 
//     ORDER BY level DESC
//   `;

//   return result;
// }



// 类似这个代码
// db.sys_user.create({
//   data: {
//     id: 'user_1',
//     name: '许鹏',
//     phone: '15160315110',
//     password: '123456',
//     remark: '系统管理员',
//   },
// }),
//帮格式化成一行代码
// db.sys_user.create({ data: {id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', remark: '系统管理员',},}),
