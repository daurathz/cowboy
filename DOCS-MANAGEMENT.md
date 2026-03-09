# 文档管理规范

**版本：** 1.0  
**生效日期：** 2026-03-09  
**维护人：** Dick (迪克) 🤘  
**Git Repo:** https://github.com/daurathz/cowboy

---

## 📁 文档分类规则

### 核心原则
**相关性文档放在一起，用合适的文件夹名称命名**

### 文档分类体系

```
/home/admin/.openclaw/workspace/
├── 📋 根目录配置文件 (Workspace Root)
│   ├── SOUL.md                    # 身份定义
│   ├── USER.md                    # 用户信息
│   ├── IDENTITY.md                # 身份标识
│   ├── AGENTS.md                  # 工作区指南
│   ├── TOOLS.md                   # 工具配置
│   ├── HEARTBEAT.md               # 主动工作清单
│   ├── MEMORY.md                  # 长期记忆
│   └── DOCS-MANAGEMENT.md         # 本文档管理规范
│
├── 📚 docs/ (文档库)
│   ├── 📖 最佳实践 (best-practices/)
│   │   ├── DingTalk-Notify-Guide.md
│   │   ├── OpenClaw-DingTalk-Best-Practices.md
│   │   └── agentic-engineering-proposal.md
│   │
│   ├── 🔧 技术文档 (technical/)
│   │   ├── api-specs/             # API 规范
│   │   ├── architecture/          # 架构设计
│   │   └── guides/                # 技术指南
│   │
│   ├── 📊 项目文档 (projects/)
│   │   ├── sales-assistant-system/  # 销售助理系统
│   │   │   ├── PROJECT-PLAN.md
│   │   │   ├── requirements/
│   │   │   ├── design/
│   │   │   ├── api/
│   │   │   └── progress/
│   │   └── [其他项目]/
│   │
│   └── 🌐 生态文档 (ecosystem/)
│       └── xxxclaw-ecosystem.md
│
├── 📝 memory/ (记忆库)
│   ├── YYYY-MM-DD-[主题].md       # 每日对话和事件日志
│   ├── heartbeat-state.json       # 心跳状态
│   └── [其他记忆文件]
│
├── 📈 reports/ (报告库)
│   ├── YYYY-MM-DD-[报告主题].md   # 调研/分析报告
│   └── [其他报告]
│
├── 🤖 AGENTS-TEAM.md              # Agent 团队定义
│
├── 🚀 projects/ (项目工作区)
│   ├── [项目名称]/
│   │   ├── PROJECT-PLAN.md        # 项目计划
│   │   ├── PROGRESS-LOG.md        # 进度日志
│   │   ├── backend/               # 后端代码
│   │   ├── frontend/              # 前端代码
│   │   └── docs/                  # 项目文档
│   └── [其他项目]/
│
└── 📦 skills/ (技能库)
    ├── [技能名称]/
    │   ├── SKILL.md
    │   ├── scripts/
    │   └── assets/
    └── [其他技能]/
```

---

## 📝 命名规范

### 文件夹命名
- **小写字母** + **连字符** (kebab-case)
- **英文命名** (便于跨平台兼容)
- **语义清晰** (见名知意)

**示例：**
```
✅ best-practices/
✅ agentic-engineering/
✅ sales-assistant-system/
❌ BestPractices/
❌ agentic_engineering/
❌ 最佳实践/
```

### 文件命名
- **小写字母** + **连字符** (kebab-case)
- **大写字母** 用于缩写和专有名词
- **类型后缀** 标明文件类型

**示例：**
```
✅ agentic-engineering-proposal.md
✅ PROJECT-PLAN.md
✅ api-spec.md
✅ CLAUDE.md
❌ AgenticEngineeringProposal.md
❌ agentic_engineering_proposal.md
❌ 提案.md
```

### 文件类型后缀
| 类型 | 后缀 | 用途 |
|------|------|------|
| 配置文件 | `.md` | 根目录配置 |
| 文档 | `.md` | docs/ 下文档 |
| 记忆 | `.md` | memory/ 下日志 |
| 报告 | `.md` | reports/ 下报告 |
| 计划 | `-PLAN.md` | 项目计划 |
| 进度 | `-LOG.md` | 进度日志 |
| 规范 | `-SPEC.md` | 技术规格 |
| 指南 | `-Guide.md` | 使用指南 |

---

## 🔄 Git 同步管理

### 仓库信息
- **Repo:** https://github.com/daurathz/cowboy
- **分支策略:** main (生产) + feature/[名称] (开发)
- **同步频率:** 每次重要变更后

### 同步规则

#### 必须提交的文件
- ✅ 所有 `.md` 文档
- ✅ 项目配置文件
- ✅ 代码文件
- ✅ CLAUDE.md 等上下文文件

#### 不提交的文件 (.gitignore)
```
# 依赖
node_modules/
pnpm-lock.yaml

# 构建产物
dist/
build/
*.log

# 环境配置
.env
.env.local

# 临时文件
*.tmp
*.bak
.DS_Store

# 敏感信息
*.key
*.pem
secrets/
```

### 提交规范

**Commit Message 格式:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型:**
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档变更
- `style`: 格式调整
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例:**
```bash
# 文档更新
git commit -m "docs(agentic-engineering): 添加落地方案和团队定义"

# 新功能
git commit -m "feat(backend): 初始化 NestJS 项目结构"

# 修复
git commit -m "fix(auth): 修复 JWT token 验证逻辑"
```

### 同步流程

```bash
# 1. 检查工作区状态
git status

# 2. 添加变更
git add <文件路径>
# 或全部添加
git add .

# 3. 提交变更
git commit -m "<type>(<scope>): <message>"

# 4. 推送远程
git push origin main

# 5. 验证同步
git log --oneline -5
```

### 自动化同步 (推荐)

**Git Hook - 提交前检查:**
```bash
#!/bin/bash
# .git/hooks/pre-commit

# 检查文档格式
echo "检查文档格式..."

# 检查敏感信息
if grep -r "password\|secret\|key" --include="*.md" . | grep -v node_modules; then
  echo "⚠️ 发现可能的敏感信息，请检查"
  exit 1
fi

echo "✅ 检查通过"
```

---

## 📊 文档版本管理

### 版本标记
在文档开头添加版本信息：
```markdown
# 文档标题

**版本：** 1.0
**日期：** 2026-03-09
**作者：** Dick (迪克) 🤘
**状态：** 草稿/审核中/已发布/已废弃
```

### 变更日志
在文档末尾添加变更记录：
```markdown
## 📝 变更日志

| 日期 | 版本 | 变更内容 | 变更人 |
|------|------|----------|--------|
| 2026-03-09 | 1.0 | 初始版本 | Dick 🤘 |
```

---

## 🔍 文档检索

### 索引文件
创建 `docs/README.md` 作为文档索引：
```markdown
# 文档索引

## 📖 最佳实践
- [钉钉通知指南](./best-practices/DingTalk-Notify-Guide.md)
- [OpenClaw + 钉钉最佳实践](./best-practices/OpenClaw-DingTalk-Best-Practices.md)
- [Agentic Engineering 落地方案](./best-practices/agentic-engineering-proposal.md)

## 📊 项目文档
- [销售助理系统](./projects/sales-assistant-system/PROJECT-PLAN.md)

## 📈 报告库
- [AI Engineering 转型报告](../reports/ai-engineering-transformation-2026.md)
```

### 标签系统
在文档开头添加标签：
```markdown
---
tags: [agentic-engineering, ai-coding, best-practices]
category: best-practices
project: sales-assistant-system
---
```

---

## 🛡️ 安全与权限

### 敏感信息处理
- ❌ 不在文档中存储密码、密钥、token
- ❌ 不提交 `.env` 文件
- ✅ 使用环境变量或密钥管理服务
- ✅ 敏感配置使用示例文件 (`.env.example`)

### 权限控制
- 内部文档：团队可访问
- 项目文档：项目成员可访问
- 敏感文档：仅负责人可访问

---

## 📋 检查清单

### 文档创建时
- [ ] 选择正确的分类目录
- [ ] 使用规范的命名
- [ ] 添加版本信息
- [ ] 添加标签和分类

### 文档更新后
- [ ] 更新版本号
- [ ] 更新变更日志
- [ ] Git 提交并推送
- [ ] 更新索引文件 (如需要)

### 定期维护 (每月)
- [ ] 检查文档结构是否合理
- [ ] 清理过时文档
- [ ] 更新索引和标签
- [ ] 验证 Git 同步状态

---

## 📞 问题与反馈

发现文档管理问题或需要改进，请联系：
- **负责人:** Dick (迪克) 🤘
- **反馈渠道:** 直接消息或 GitHub Issues

---

**最后更新：** 2026-03-09  
**下次审查：** 2026-04-09
