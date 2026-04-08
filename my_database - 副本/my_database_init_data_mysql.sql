-- ============================== my_db1 ==============================
CREATE DATABASE IF NOT EXISTS my_db1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ============================== 测试_样板1表 ==============================
USE my_db1;
CREATE TABLE IF NOT EXISTS test_demo1 (
    id INT AUTO_INCREMENT PRIMARY KEY                        COMMENT '自增主键',
    name VARCHAR(100) NOT NULL                               COMMENT '姓名',
    phone VARCHAR(20) NOT NULL UNIQUE                        COMMENT '手机号(不能为空且唯一)',
    age INT                                                  COMMENT '年龄(整数)',
    password VARCHAR(255) NOT NULL                           COMMENT '密码(加密存储)',
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER'   COMMENT '性别(MALE=男性的,FEMALE=女性的,OTHER=其他)'
) engine=innodb COMMENT='测试_样板1表';

-- ============================== 测试_学生表1 ==============================
USE my_db1;
CREATE TABLE IF NOT EXISTS test_student1 (
    name VARCHAR(100) NOT NULL                               COMMENT '姓名',
    age INT                                                  COMMENT '年龄(整数)',
    sex ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER'      COMMENT '性别(MALE=男性的,FEMALE=女性的,OTHER=其他)',
    city VARCHAR(100)                                        COMMENT '城市',
    id INT AUTO_INCREMENT PRIMARY KEY                        COMMENT '自增主键'
) engine=innodb COMMENT='测试_学生1表';

INSERT INTO `my_db1`.`test_student1` (`id`, `name`, `age`, `sex`, `city`) VALUES (1, '赵一', 1, 'MALE', '泉州');
INSERT INTO `my_db1`.`test_student1` (`id`, `name`, `age`, `sex`, `city`) VALUES (2, '钱二', 1, 'OTHER', '厦门');

-- ============================== 测试_职位表1 ==============================
USE my_db1;
CREATE TABLE IF NOT EXISTS test_position1 (
    user_id INT                                              COMMENT '用户id',
    postition_name VARCHAR(100)                              COMMENT '职位名称',
    id INT AUTO_INCREMENT PRIMARY KEY                        COMMENT '自增主键'
) engine=innodb COMMENT='测试_职位1表';
INSERT INTO `my_db1`.`test_position1` (`user_id`, `postition_name`, `id`) VALUES (1, '学习委员', 1);
INSERT INTO `my_db1`.`test_position1` (`user_id`, `postition_name`, `id`) VALUES (2, '体育委员', 2);


-- ============================== 测试_上传文件1 ==============================
USE my_db1;
CREATE TABLE IF NOT EXISTS test_upload_file (
    file_name VARCHAR(100)                                    COMMENT '文件名',
    file_path VARCHAR(100)                                    COMMENT '文件路径',
    student_id INT                                            COMMENT '学生id',
    id INT AUTO_INCREMENT PRIMARY KEY                         COMMENT '自增主键'
) engine=innodb COMMENT='测试_学生1表';



-- ============================== my_db2 ==============================
CREATE DATABASE IF NOT EXISTS my_db2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ============================== 测试_样板1表 ==============================
USE my_db2;
CREATE TABLE IF NOT EXISTS test_demo1 (
    id INT AUTO_INCREMENT PRIMARY KEY                        COMMENT '自增主键',
    name VARCHAR(100) NOT NULL                               COMMENT '姓名',
    phone VARCHAR(20) NOT NULL UNIQUE                        COMMENT '手机号(不能为空且唯一)',
    age INT                                                  COMMENT '年龄(整数)',
    password VARCHAR(255) NOT NULL                           COMMENT '密码(加密存储)',
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER'   COMMENT '性别(MALE=男性的,FEMALE=女性的,OTHER=其他)'
) engine=innodb COMMENT='测试_样板1表';



-- ============================== my_db3 ==============================
CREATE DATABASE IF NOT EXISTS my_db3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;



-- ============================== 测试_样板1表 ==============================
USE my_db3;
drop table if exists test_user;
CREATE TABLE IF NOT EXISTS test_user (
    id INT AUTO_INCREMENT PRIMARY KEY                        COMMENT '自增主键',

    phone VARCHAR(20) NOT NULL UNIQUE                        COMMENT '手机号(不能为空且唯一)',
	    name VARCHAR(100) NOT NULL                               COMMENT '姓名',
    age INT                                                  COMMENT '年龄(整数)',
    password VARCHAR(255) NOT NULL                           COMMENT '密码(加密存储)',
    avatar VARCHAR(255)                                      COMMENT '头像',
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER'   COMMENT '性别(MALE=男性的,FEMALE=女性的,OTHER=其他)'
) engine=innodb COMMENT='测试_样板1表';



INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (1, '1','姓名1',  0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (2, '2', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (3, '3', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (4, '4','姓名1',  0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (5, '5', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (6, '6', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (7, '7','姓名1',  0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (8, '8', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (9, '9', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (10, '10','姓名1',  0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (11, '11', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (12, '12', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (13, '13','姓名1',  0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (14, '14', '姓名', 0, '111', '111', 'MALE');
INSERT INTO `my_db3`.`test_user` (`id`, `phone`, `name`, `age`, `password`, `avatar`, `gender`) VALUES (15, '15', '姓名', 0, '111', '111', 'MALE');