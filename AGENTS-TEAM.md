# Agent 团队定义 - 销售助理系统项目

**项目：** 销售助理系统 (Sales Assistant System)  
**日期：** 2026-03-09  
**状态：** 已激活

---

## 🤖 Agent 团队结构

```
┌─────────────────────────────────────────────────────────┐
│              人类：daur (岳老三/鄂力炜)                  │
│                   - 战略决策                            │
│                   - 最终审批                            │
│                   - 10 分钟进度同步接收                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│          Dick (迪克) 🤘 - 主协调器/架构师                │
│                   - 系统设计                            │
│                   - 任务分解                            │
│                   - 进度汇报                            │
│                   - 风险管理                            │
└─────────────────────────────────────────────────────────┘
                          ↓
    ┌───────────┬───────────┬───────────┬───────────┬───────────┐
    ↓           ↓           ↓           ↓           ↓           ↓
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Backend│ │Frontend│ │  Test  │ │Security│ │  Docs  │ │  Data  │
│ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 👥 Agent 角色定义

### 1. Dick (迪克) 🤘 - 主协调器/架构师
**职责：**
- 系统架构设计
- 任务分解和分配
- 进度跟踪和汇报 (每 10 分钟同步)
- 风险识别和升级
- 跨 agent 协调

**能力：**
- 全栈技术决策
- 需求分析
- 项目规划
- 团队沟通

**工作模式：**
- 主 session 运行
- 与其他 agents 通过 sessions_send 通信
- 直接向 daur 汇报

---

### 2. Backend Agent - 后端开发
**职责：**
- API 设计和实现
- 数据库设计
- 业务逻辑开发
- 认证授权系统
- 性能优化

**技术栈：**
- Node.js / Express 或 NestJS
- PostgreSQL / MySQL
- JWT 认证
- RESTful API

**验证命令：**
```bash
npm run build
npm test
npm run lint
npm run security-scan
```

**输出质量门：**
- API 测试覆盖率 >80%
- 无安全漏洞 (SAST 扫描)
- 符合 RESTful 规范
- 错误处理完整

---

### 3. Frontend Agent - 前端开发
**职责：**
- Web 界面开发 (销售端 + 管理端)
- 组件设计和实现
- 状态管理
- API 集成
- 响应式设计

**技术栈：**
- React / Vue 3
- TypeScript
- TailwindCSS / Ant Design
- React Query / Vuex

**验证命令：**
```bash
npm run build
npm run test:unit
npm run test:e2e
npm run lint
```

**输出质量门：**
- 组件测试覆盖率 >70%
- E2E 测试通过
- 无障碍访问 (a11y) 合规
- 移动端适配

---

### 4. Test Agent - 测试专家
**职责：**
- 单元测试编写
- 集成测试编写
- E2E 测试编写
- 测试数据生成
- 质量报告

**工具：**
- Jest / Vitest
- Playwright / Cypress
- Testing Library
- Mock Service Worker

**验证命令：**
```bash
npm test --coverage
npm run test:e2e
npm run test:visual
```

**输出质量门：**
- 总体测试覆盖率 >75%
- 关键路径 100% 覆盖
- 无 flaky 测试
- 测试执行时间 <5 分钟

---

### 5. Security Agent - 安全专家
**职责：**
- 代码安全扫描
- 依赖漏洞检查
- 认证授权审查
- 数据加密审查
- OWASP 合规检查

**工具：**
- Snyk / Dependabot
- ESLint security plugins
- OWASP ZAP
- Secret detection

**验证命令：**
```bash
npm audit
npm run security-scan
npm run secret-scan
```

**输出质量门：**
- 无高危漏洞
- 无硬编码密钥
- 密码加密存储
- HTTPS 强制

---

### 6. Docs Agent - 文档专家
**职责：**
- API 文档编写
- 用户手册编写
- 代码注释审查
- 知识库维护
- 变更日志更新

**工具：**
- Markdown
- Swagger/OpenAPI
- Docusaurus / VitePress
- Git

**输出质量门：**
- API 文档与代码同步
- 用户手册完整
- 代码注释清晰
- 变更日志及时更新

---

### 7. Data Agent - 数据专家
**职责：**
- 数据库设计
- 数据迁移脚本
- 数据分析报表
- 数据质量监控
- 备份策略

**工具：**
- SQL / Prisma / TypeORM
- Data visualization
- Backup scripts
- Monitoring

**输出质量门：**
- 数据库范式合规
- 迁移脚本可回滚
- 报表准确
- 备份可恢复

---

## 🔄 协作协议

### 任务流转

```
Dick (分解任务)
  ↓
Backend/Frontend Agent (实现)
  ↓
Test Agent (编写测试)
  ↓
Security Agent (安全审查)
  ↓
Docs Agent (文档更新)
  ↓
Dick (整合审查)
  ↓
daur (最终审批)
```

### 通信机制

| 场景 | 通信方式 | 频率 |
|------|----------|------|
| 任务分配 | sessions_send | 按需 |
| 进度更新 | sessions_send | 每 10 分钟 |
| 问题升级 | sessions_send | 立即 |
| 代码审查 | PR comments | 按需 |
| 文档同步 | Git commits | 每次变更 |

### 冲突解决

1. **技术分歧**: Dick 仲裁，必要时升级 daur
2. **优先级冲突**: 按项目计划优先级
3. **资源竞争**: 按任务紧急程度分配
4. **质量问题**: Security/Test Agent 有一票否决权

---

## 📊 进度同步机制

### 10 分钟同步内容

**格式：**
```
【进度同步】YYYY-MM-DD HH:mm

✅ 本周期完成：
- [任务 1]
- [任务 2]

🔄 进行中：
- [任务 3] - 预计完成时间
- [任务 4] - 预计完成时间

⚠️ 风险/问题：
- [风险 1] - 缓解措施
- [问题 1] - 需要决策

📋 下周期计划：
- [任务 5]
- [任务 6]

需要确认：
[ ] 决策点 1
[ ] 决策点 2
```

### 同步渠道
- **主渠道：** Slack (当前会话)
- **备选：** 钉钉 (如配置)

---

## 🎯 当前项目：销售助理系统

### 系统概述

**目标用户：**
- 销售人员 (Web 端)
- 销售管理人员 (Web 端)

**核心功能：**
1. 登录认证
2. 客户登记与管理
3. 成交录入与管理
4. 业绩查看
5. 团队管理
6. 学习空间

### 技术选型建议

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端 | React + TypeScript + Ant Design | 企业级 UI，类型安全 |
| 后端 | NestJS + TypeScript | 结构化，易测试 |
| 数据库 | PostgreSQL | 关系型，成熟稳定 |
| ORM | Prisma | 类型安全，易维护 |
| 认证 | JWT + Refresh Token | 无状态，安全 |
| 部署 | Docker + K8s | 可扩展，易运维 |

---

## 📋 激活确认

**激活时间：** 2026-03-09 09:30 GMT+8  
**激活人：** Dick (迪克) 🤘  
**状态：** ✅ 已激活

**下一步：**
1. 拆解销售助理系统任务
2. 分配任务到各 agent
3. 开始第一个开发周期
4. 10 分钟后同步进度

---

> 🤘 **Dick 备注：** 这个团队配置是精简且实用的。每个 agent 都有明确的职责和质量门。我会确保协作流畅，按时向 daur 汇报进度。
