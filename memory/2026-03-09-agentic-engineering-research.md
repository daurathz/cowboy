# Agentic Engineering 研究笔记

**日期：** 2026-03-09  
**研究员：** Dick (迪克) 🤘  
**任务：** 为 AI Coding 落地进行深度调研和方案设计

---

## 📚 核心资料来源

### 1. John Kim (Meta Staff Engineer) - Push To Prod Substack
- **《What is Agentic Engineering》** (2026-02-17, 3 周前)
- **《50 Claude Code Tips To Get You Started》** (1 个月前)
- 核心观点：Claude Code 本质是上下文工程工具，不是代码生成器

### 2. Meta Engineering Blog
- **《The Death of Traditional Testing: Agentic Development Broke a 50-Year-Old Field》** (2026-02-11)
- JiTTesting (Just-in-Time Tests) - 为 Agentic 开发设计的新型测试范式

### 3. 行业报告与案例
- **NxCode: 《Agentic Engineering: The Complete Guide》** (2026-03)
- **IBM: 《Agentic Engineering》** (2026-03)
- **Glide: 《What is agentic engineering?》** (2026-02-06)

---

## 🏗️ Agentic Engineering 五大支柱 (John Kim)

### 1. Context Engineering (上下文工程)
**核心原则：**
- 上下文是稀缺资源，不是无限垃圾桶
- 保持新鲜和精简 (Fresh and Condensed)
- 懒加载而非预加载 (Lazy load)
- 使用 CLAUDE.md 分层管理 (全局/项目/子目录)

**实践要点：**
- `/clear` 重置上下文
- `/context` 审计 token 使用
- CLAUDE.md 保持约 300 行
- 结构：What → Domain → Validation

### 2. Agentic Validation (Agentic 验证)
**核心原则：**
- **最重要的单一技巧**：给 AI 验证自己工作的能力
- 验证循环 > 一次性正确
- 包含构建命令、测试命令、lint 命令

**实践要点：**
- 在 CLAUDE.md 中定义验证命令
- 让 AI 运行构建→看错误→修复的循环
- Web 应用：用 Puppeteer 或/chrome 检查 UI
- 移动应用：安装并读取调试日志
- 性能：接入 Perfetto 读取 traces

### 3. Agentic Tooling (Agentic 工具化)
**核心原则：**
- 四个基本原语：Skills, Commands, MCPs, Subagents
- Skills = 重复工作流 (保存为 MD 文件)
- MCPs = 外部服务连接
- Subagents = 隔离上下文 (用于副作用)

**实践要点：**
- 不要手动创建 commands，让 AI 创建
- 让 AI 帮你安装 MCPs
- Hooks 拦截动作 (PreToolUse/PostToolUse)
- 自动格式化用 PostToolUse hooks
- 用 PreToolUse hooks 阻止危险命令

### 4. Agentic Codebase (Agentic 代码库)
**核心原则：**
- 代码是写给 AI 看的，不是只写给人看的
- 为 AI 可读可改而优化
- 无情简化 (Ruthless simplification)
- 标准化减少认知负载

**实践要点：**
- 从根目录运行
- 使用 Git worktrees 跨实例隔离文件
- 提交 CLAUDE.md 到 git (复合式工程)
- 索引在根目录，详细文档在子目录

### 5. Compound Engineering (复合式工程)
**核心原则：**
- 系统从自身错误中学习
- 新功能随着时间变得更易构建
- 多终端实例并行工作
- Git 是安全网 (大改动前提交)

**实践要点：**
- 运行多个 iTerm 实例
- 启用完成通知
- 在会话结束前持久化学习 (第二大脑)
- 使用 Plan Mode 开始新功能

---

## 🔄 核心工作流：PEV 循环

```
Plan (计划) → Execute (执行) → Verify (验证)
```

### Plan (计划)
- 定义目标：什么是"完成"？验收标准是什么？
- 任务分解：将复杂目标拆分为 agent 大小的工作单元
- 设置约束：架构边界、技术栈规则、风格指南
- 指定质量门：什么测试必须通过？什么审查是必需的？
- 分配 agent 角色：哪个 agent 负责实现？测试？安全审查？

### Execute (执行)
- 实现 agent 编写代码 (遵循架构规则)
- 测试 agent 生成并运行测试套件
- 审查 agent 检查风格、安全、架构合规
- 文档 agent 更新文档以匹配代码变更
- Agents 迭代直到通过质量门

### Verify (验证)
- 是否满足验收标准？
- 是否引入安全漏洞？
- 架构是否与现有代码库一致？
- 测试是否有意义还是只检查快乐路径？
- 人类工程师会批准这个 PR 吗？

---

## 🏢 实际落地案例

### TELUS Digital
- **成果：** 13,000+ AI 解决方案，节省 500,000+ 小时
- 工程代码交付速度提升 30%
- 扩展到非工程团队

### Zapier
- **成果：** 89% 组织范围 AI 采用率
- 800+ agents 内部部署
- 非工程师使用 agents 处理工作流、数据分析、内容

### Stripe (Minions 系统)
- **成果：** 1,000+ PRs/周 由 agents 合并
- 流程：Slack 发布任务 → Minion 写代码 → 通过 CI → 开 PR → 人类审查合并
- **零交互** 从任务分配到 PR 审查

### OpenAI Codex 团队
- **成果：** 100 万 + 行代码，零人工编写
- 约 1/10 传统开发时间
- 内部日常用户和外部 alpha 测试者
- 产品发布、部署、修复全部由 agents 完成

### Rakuten
- **成果：** 1250 万行代码库，7 小时完成复杂 vLLM 实现
- 99.9% 数值精度

---

## 🧪 测试范式转变：JiTTesting

**传统测试的问题：**
- 手动编写，持续执行，需要定期更新和维护
- 工程师需要检查当前代码和所有可能的未来变更
- 不确定性导致测试抓不到东西或误报
- Agentic 开发大幅增加代码变更速度

**JiTTests (Just-in-Time Tests)：**
- 为每个代码变更定制生成
- 不在代码库中驻留，消除维护成本
- LLM 自动生成，提交 PR 时即刻创建
- 推断代码变更的合理意图
- 模拟可能的故障
- 只在捕获 bug 时需要人工审查

**关键步骤：**
1. 新代码进入代码库
2. 系统推断变更意图
3. 创建 mutants (故意插入故障的代码版本)
4. 生成并运行测试捕获这些故障
5. 基于规则和 LLM 的评估器聚焦真正失败的信号
6. 工程师收到清晰、相关的报告

---

## 🛡️ 安全维度

**风险：**
- Agents 可以大规模引入漏洞 (1000 PRs/周 × 1% 漏洞率 = 每周 10 个新漏洞)
- 攻击面扩大 (Agents 访问 APIs、数据库、外部服务)
- 手动安全审查跟不上 agent 生成代码的速度

**对策：**
- 自动化防御是必需的
- 质量门必须包含安全 (每个 PEV 循环包括自动安全扫描)
- 从第一天就嵌入安全，不是事后添加

---

## 📊 技能栈转变

| 传统技能 | Agentic Engineering 等价物 |
|----------|---------------------------|
| 编写代码 | 精确指定意图 |
| 调试代码 | 调试 agent 行为 |
| 代码审查 | Agent 输出验证 |
| 测试 | 测试策略设计 |
| 架构 | 约束系统设计 |
| 文档 | 机器可读知识工程 |
| 项目管理 | 多 agent 编排 |

**不变的：**
- 领域专业知识
- 系统思维
- 安全意识
- 代码阅读能力

**新增的：**
- Agent 提示词设计 (操作规范，不是聊天提示)
- Harness 设计 (约束、linters、反馈循环)
- 上下文工程
- Agent 评估

---

## 💡 关键洞察

1. **上下文是王道** - 200k token 窗口听起来很大，但 MCPs、旧探索、死胡同对话、冗长规则文件都在竞争空间

2. **验证循环最重要** - "AI coding 对我没用"的人，9/10 没有验证循环

3. **把工作内容带到上下文，不是分散上下文** - Subagent 只返回输出，不返回完整推理

4. **AI 生成代码不是瓶颈** - 瓶颈是人类头脑中的上下文切换量

5. **Agentic Engineering 不是取代开发者** - 是将每个开发者的能力放大 5-10 倍

---

## ⚠️ 当前局限

- 完全自主的多日项目仍需每几小时人工检查点
- 跨系统重构 agents 处理单服务重构好，但跨微服务协调变更困难
- 新架构决策没有代码库先例时，agents 默认通用模式不适合具体上下文

---

**下一步：** 基于这些研究，形成观点和落地方案，组织 agents 团队，开始销售助理系统试点项目。
