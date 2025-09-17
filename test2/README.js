
/*

我想通过用户的id得到菜单        应该怎么写prisma的查询语句
我想通过用户的id得到菜单树      应该怎么写prisma的查询语句



帮我阅读test2的代码,将 部门表 的id 设置 "depart_"开头   例如 "depart_1"
帮我阅读test2的代码,将 菜单表 的id 设置 "menu_"开头     例如 "menu_1"
帮我阅读test2的代码,将 权限表 的id 设置 "permiss_"开头     例如 "permiss_1"
帮我阅读test2的代码,将 角色表 的id 设置 "role_"开头     例如 "role_1"
帮我阅读test2的代码,将 用户表 的id 设置 "user_"开头     例如 "user_1"


我的用户是下面的数据
let user_list = [
    { id: 'user_1', name: '许鹏', phone: '15160315110' },
    { id: 'user_2', name: '二狗', phone: '15160315002' },
    { id: 'user_3', name: '张三', phone: '15160315003' },
    { id: 'user_4', name: '李四', phone: '15160315004' },
    { id: 'user_5', name: '王五', phone: '15160315005' }
]


我的部门是下面的数据
let depart_list = [
    { id: 'depart_1', name: '用户部',},
    { id: 'depart_2', name: '技术部', },
    { id: 'depart_3', name: '客服部', },
    { id: 'depart_4', name: '财务部',  },    
    { id: 'depart_1001', name: '用户部一普通', parent_id: 'depart_1' },
    { id: 'depart_1002', name: '用户部一贵宾', parent_id: 'depart_1' },
    { id: 'depart_2001', name: '技术部一职员', parent_id: 'depart_2' },
    { id: 'depart_2002', name: '技术部一主管', parent_id: 'depart_2' },
    { id: 'depart_3001', name: '客服部一职员', parent_id: 'depart_3' },
    { id: 'depart_3002', name: '客服部一主管', parent_id: 'depart_3' },
    { id: 'depart_4001', name: '财务部一职员', parent_id: 'depart_4' },
    { id: 'depart_4002', name: '财务部一主管', parent_id: 'depart_4' }
]

我的权限是下面的数据
let permission_list = [
    { id: 'permiss_1', name: '首页访问', code: 'home:view', type: 'menu', level: 1, sort: 1 },
    { id: 'permiss_2', name: '系统管理', code: 'sys:view', type: 'menu', level: 1, sort: 2 },
    { id: 'permiss_3', name: '用户管理', code: 'user:manage', type: 'menu', level: 2, sort: 1, parent_id: 'permiss_2' },
    { id: 'permiss_4', name: '菜单管理', code: 'menu:manage', type: 'menu', level: 2, sort: 2, parent_id: 'permiss_2' },
    { id: 'permiss_5', name: '部门管理', code: 'depart:manage', type: 'menu', level: 2, sort: 3, parent_id: 'permiss_2' },
    { id: 'permiss_6', name: '商城管理', code: 'mall:view', type: 'menu', level: 1, sort: 3 },
    { id: 'permiss_7', name: '订单管理', code: 'order:manage', type: 'menu', level: 2, sort: 1, parent_id: 'permiss_6' },
    { id: 'permiss_8', name: '商品管理', code: 'product:manage', type: 'menu', level: 2, sort: 2, parent_id: 'permiss_6' },
    { id: 'permiss_9', name: '财务管理', code: 'finance:manage', type: 'menu', level: 2, sort: 3, parent_id: 'permiss_6' }
]

我的菜单是下面的数据
let menu_list = [
    { id: 'menu_1', name: '首页', path: '/home', permission_id: 'permiss_1' },
    { id: 'menu_2', name: '系统管理', path: '/sys', permission_id: 'permiss_2' },        // 系统管理
    { id: 'menu_3', name: '系统管理一用户管理', path: '/user', parent_id: 'menu_2', permission_id: 'permiss_3' },
    { id: 'menu_4', name: '系统管理一菜单管理', path: '/menu',  parent_id: 'menu_2', permission_id: 'permiss_4' },
    { id: 'menu_5', name: '系统管理一部门管理', path: '/depart', parent_id: 'menu_2', permission_id: 'permiss_5' },
    { id: 'menu_6', name: '商城管理', path: '/mall', permission_id: 'permiss_6'},      // 商城管理
    { id: 'menu_7', name: '商城管理一订单管理', path: '/mall/order', parent_id: 'menu_6', permission_id: 'permiss_7'},
    { id: 'menu_8', name: '商城管理一商品管理', path: '/mall/product', parent_id: 'menu_6', permission_id: 'permiss_8' },
    { id: 'menu_9', name: '商城管理一财务管理', path: '/mall/finance', parent_id: 'menu_6', permission_id: 'permiss_9' }   
]


// 部门对应的菜单
用户部一普通  可以看到菜单   首页
用户部一贵宾  可以看到菜单   首页
技术部一职员  可以看到菜单   系统管理一用户管理  系统管理一菜单管理                       商城管理一订单管理  商城管理一商品管理  
技术部一主管  可以看到菜单   系统管理一用户管理  系统管理一菜单管理  系统管理一部门管理     商城管理一订单管理  商城管理一商品管理   商城管理一财务管理
客服部一职员  可以看到菜单                                                             商城管理一订单管理                   
客服部一主管  可以看到菜单   系统管理一用户管理                                         商城管理一订单管理  商城管理一商品管理  
财务部一职员  可以看到菜单                                                             商城管理一订单管理  商城管理一商品管理  商城管理一财务管理
财务部一主管  可以看到菜单   系统管理一用户管理                                          商城管理一订单管理  商城管理一商品管理  商城管理一财务管理


// 用户对于的部门
用户:  许鹏 是:用户部一贵宾  技术部一主管  客服部一主管  财务部一主管
用户:  二狗 是:用户部一贵宾  客服部一职员 
用户:  张三 是:用户部一贵宾  客服部一主管
用户:  李四 是:用户部一贵宾  财务部一职员
用户:  王五 是:用户部一贵宾  财务部一主管




帮我生成prisma的初始化数据
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()



*/

