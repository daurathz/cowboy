# 销售助理系统后端 - CLAUDE.md

**项目：** 销售助理系统后端 API  
**技术栈：** NestJS + TypeScript + Prisma + PostgreSQL  
**Agent:** Backend Agent  
**最后更新：** 2026-03-09

---

## 📋 项目概述

这是一个销售管理系统的后端 API，提供：
- 用户认证授权 (JWT)
- 客户管理 CRUD
- 成交订单管理
- 业绩统计报表
- 团队管理
- 学习资料管理

---

## 🏗️ 架构规范

### 目录结构
```
src/
├── main.ts                 # 应用入口
├── app.module.ts           # 根模块
├── common/                 # 公共模块
│   ├── decorators/         # 自定义装饰器
│   ├── filters/            # 异常过滤器
│   ├── guards/             # 认证守卫
│   ├── interceptors/       # 拦截器
│   └── utils/              # 工具函数
├── modules/
│   ├── auth/               # 认证模块
│   ├── users/              # 用户模块
│   ├── customers/          # 客户模块
│   ├── orders/             # 订单模块
│   ├── performance/        # 业绩模块
│   ├── teams/              # 团队模块
│   └── learning/           # 学习模块
└── prisma/                 # Prisma 配置
    └── schema.prisma       # 数据模型
```

### 代码规范

**命名约定：**
- 文件：kebab-case (user.service.ts)
- 类：PascalCase (UserService)
- 函数/变量：camelCase (getUserById)
- 常量：UPPER_SNAKE_CASE (MAX_RETRY_COUNT)
- 接口/类型：PascalCase (UserDTO)

**模块结构：**
每个模块包含：
- `{module}.module.ts` - 模块定义
- `{module}.controller.ts` - 路由控制器
- `{module}.service.ts` - 业务逻辑
- `dto/` - 数据传输对象
- `entities/` - 实体类

---

## 🔐 安全规则 (最高优先级)

### Critical Rules

1. **密码永远不能明文存储** - 必须使用 bcrypt 加密
2. **JWT 密钥不能硬编码** - 必须从环境变量读取
3. **所有 API 必须验证用户身份** - 除非明确标记为 public
4. **SQL 注入防护** - 只使用 Prisma ORM，不写原生 SQL
5. **输入验证** - 所有 DTO 必须使用 class-validator
6. **敏感数据不返回** - 密码、密钥等字段必须从响应中排除
7. **速率限制** - 认证 API 必须有速率限制
8. **CORS 配置** - 只允许信任的域名

### 权限控制

- `@UseGuards(JwtAuthGuard)` - 需要登录
- `@Roles('admin')` - 需要特定角色
- `@CurrentUser()` - 获取当前用户信息

---

## 🧪 验证命令

**必须运行这些命令验证代码：**

```bash
# 构建
npm run build

# 测试
npm test

# 测试覆盖率
npm run test:coverage

# Lint
npm run lint

# 安全扫描
npm run security-scan

# 密钥扫描
npm run secret-scan
```

**验证循环：**
1. 运行 `npm run build` - 确保编译通过
2. 运行 `npm test` - 确保测试通过
3. 运行 `npm run lint` - 确保代码规范
4. 运行 `npm run security-scan` - 确保安全
5. 有错误 → 修复 → 重新验证

---

## 📊 数据库规范

### Prisma 使用规范

1. **模型定义** - 在 `schema.prisma` 中定义
2. **迁移** - 使用 `npx prisma migrate dev`
3. **类型安全** - 使用 Prisma Client 生成的类型
4. **事务** - 复杂操作使用 `$transaction`
5. **软删除** - 使用 `deletedAt` 字段，不物理删除

### 数据模型关系

- 用户 ↔ 客户 (一对多，销售负责客户)
- 用户 ↔ 订单 (一对多，销售创建订单)
- 用户 ↔ 团队 (多对一，用户属于团队)
- 团队 ↔ 用户 (一对多，团队包含成员)

---

## 📝 API 设计规范

### RESTful 规范

**资源命名：**
- ✅ `/api/customers` - 复数名词
- ❌ `/api/customer` - 单数
- ❌ `/api/getCustomers` - 动词

**HTTP 方法：**
- `GET` - 获取资源
- `POST` - 创建资源
- `PUT` - 全量更新
- `PATCH` - 部分更新
- `DELETE` - 删除资源

**响应格式：**
```typescript
// 成功响应
{
  "data": { ... },
  "message": "操作成功",
  "timestamp": "2026-03-09T10:00:00Z"
}

// 错误响应
{
  "error": "错误类型",
  "message": "错误详情",
  "statusCode": 400,
  "timestamp": "2026-03-09T10:00:00Z"
}

// 列表响应
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

**状态码：**
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器错误

---

## 🔄 工作流程

### 新功能开发流程

1. **需求分析** - 理解功能需求
2. **数据模型设计** - 更新 Prisma schema
3. **生成迁移** - `npx prisma migrate dev`
4. **创建模块** - NestJS 模块结构
5. **实现 Service** - 业务逻辑
6. **实现 Controller** - API 路由
7. **编写 DTO** - 输入验证
8. **编写测试** - 单元测试
9. **运行验证** - build + test + lint + security
10. **更新文档** - API 文档

### 代码审查检查点

- [ ] 密码是否加密存储
- [ ] JWT 密钥是否从环境变量读取
- [ ] 所有 API 是否有身份验证
- [ ] 输入是否有验证
- [ ] 敏感数据是否从响应排除
- [ ] 错误处理是否完整
- [ ] 测试是否覆盖关键路径
- [ ] 文档是否更新

---

## 📚 领域知识

### 用户角色

- `sales` - 销售人员
- `manager` - 销售主管
- `admin` - 系统管理员

### 客户状态

- `lead` - 潜在客户
- `contacted` - 已联系
- `negotiating` - 谈判中
- `won` - 成交
- `lost` - 丢失

### 订单状态

- `draft` - 草稿
- `pending` - 待确认
- `confirmed` - 已确认
- `paid` - 已付款
- `completed` - 已完成
- `cancelled` - 已取消

---

## 🛠️ 开发技巧

### 常用命令

```bash
# 开发模式启动
npm run dev

# 生成 Prisma 客户端
npx prisma generate

# 数据库迁移
npx prisma migrate dev --name init

# 查看数据库
npx prisma studio
```

### 常见问题

**Q: 如何处理事务？**
```typescript
await this.prisma.$transaction(async (tx) => {
  await tx.customer.create({...});
  await tx.order.create({...});
});
```

**Q: 如何获取当前用户？**
```typescript
@Get()
@UseGuards(JwtAuthGuard)
findAll(@CurrentUser() user: User) {
  return this.service.findAll(user.id);
}
```

**Q: 如何分页？**
```typescript
async findAll(page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    this.prisma.customer.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    this.prisma.customer.count(),
  ]);
  return { data, total, page, pageSize };
}
```

---

## 📈 质量门

- 构建：必须通过
- 测试：覆盖率 >80%
- Lint: 无错误
- 安全：无高危漏洞
- 密钥：无硬编码

---

**最后提醒：** 每次代码变更后，必须运行验证循环！
