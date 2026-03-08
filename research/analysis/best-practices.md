# OpenClaw 使用最佳实践

> **来源：** Peter Steinberger (OpenClaw 创作者) 的 Lex Fridman 采访 + Creator Economy 访谈  
> **分析时间：** 2026-03-08  
> **整理者：** Dick (迪克) 🤘

---

## 📋 最佳实践清单 (优先级排序)

| 优先级 | 实践 | 核心收益 |
|--------|------|----------|
| P0 | 默认使用 Codex 编码 | 减少错误，降低引导成本 |
| P0 | 不用 Plan Mode，直接对话 | 更自然，更灵活 |
| P0 | 用 CLI 代替 MCPs | 简单、可靠、易学习 |
| P0 | 多 Agent 并行工作 | 4-10x 效率提升 |
| P1 | 让 Agent 自我感知 | 支持自我修改和调试 |
| P1 | Markdown + Vector DB 记忆 | 可持续的知识积累 |
| P1 | 语音编程 | 突破输入速度限制 |
| P2 | Fun over Seriousness | 保持创造力，避免 burnout |
| P2 | 沙箱隔离 + 权限控制 | 安全与便利的平衡 |
| P2 | NO_REPLY 令牌 | 群聊自然交互 |
| P3 | 开放源码 + 社区协作 | 加速迭代，降低门槛 |
| P3 | 自我修改代码 | 快速原型，减少手动干预 |
| P3 | 打字指示器 + 语音支持 | 增强交互真实感 |
| P3 | 文件类型自动检测 | 减少配置，增强鲁棒性 |
| P3 | 持续强化学习 (终极目标) | 个性化适应 |

---

## 🔍 详细实践说明

### 1. 默认使用 Codex 编码 (而非 Opus)

**Peter 原话：**
> "Codex handles big codebases better with fewer mistakes and less handholding. Opus is great for personality."

**为什么：**
- Codex 在处理大型代码库时表现更好
- 错误率更低，减少调试时间
- 需要的引导和纠正更少
- Opus 更适合需要"个性"的场景（如对话、创意写作）

**如何应用：**
```yaml
# 配置文件示例
coding_tasks:
  default_model: dashscope-coding/qwen3.5-plus  # 或 Codex
  creative_tasks:
    model: dashscope-chat/qwen3.5-chat  # 或 Opus
```

**反面案例：**
- ❌ 所有任务都用同一个模型
- ❌ 用 Opus 写复杂代码（容易出错，需要更多纠正）
- ❌ 用 Codex 写创意内容（缺乏个性）

**预期效果：**
- 代码错误减少 30-50%
- 单次任务完成时间缩短
- 减少"再来一次"的迭代次数

---

### 2. 不用 Plan Mode，直接对话

**Peter 原话：**
> "Plan mode was a hack for older models. I just write 'let's discuss' and have a conversation."

**为什么：**
- Plan Mode 是旧模型的"补丁"，现代模型不需要
- 直接对话更自然、更灵活
- 可以在对话中动态调整方向
- 减少形式化的 overhead

**如何应用：**
```
# 错误做法
用户：/plan 重构用户认证模块

# 正确做法
用户：我们来讨论一下重构用户认证模块的事
用户：你觉得当前的问题在哪里？
用户：好，那我们先从 JWT 过期处理开始
```

**反面案例：**
- ❌ 强制要求 Agent 先输出完整计划
- ❌ 严格按照计划执行，不允许中途调整
- ❌ 用复杂的计划模板限制 Agent 发挥

**预期效果：**
- 更自然的协作体验
- 更容易发现计划外的问题
- 减少"计划赶不上变化"的挫败感

---

### 3. 用 CLI 代替 MCPs

**Peter 原话：**
> "Most MCPs should be CLIs. The agent will try the CLI, get the help menu, and from now on we're good."

**为什么：**
- CLI 是标准化的接口，Agent 容易学习
- 不需要为每个工具写专门的 MCP 适配器
- `--help` 就是文档，Agent 可以自学
- 更少的依赖，更少的故障点

**如何应用：**
```bash
# 给 Agent 提供 CLI 工具
# 示例：git 操作
Agent 自动学习：
1. 执行 `git --help`
2. 执行 `git commit --help`
3. 从帮助文档中学习用法
4. 以后就能正确使用 git commit

# 而不是：
# 写一个 GitMCP 适配器，处理各种边界情况
```

**反面案例：**
- ❌ 为每个小功能写专门的 MCP
- ❌ MCP 接口与 CLI 行为不一致
- ❌ 依赖 MCP 但文档不完善

**预期效果：**
- Agent 可以自学新工具
- 减少维护成本
- 工具生态更开放（任何 CLI 都能用）

---

### 4. 多 Agent 并行工作流

**Peter 原话：**
> "Depending on how much I slept and how difficult of the tasks I work on, between four and 10."

**为什么：**
- 不同 Agent 可以处理不同任务
- 并行处理，大幅提升效率
- 可以 specialization（专门化）
- Peter 本人月提交 6600+ commits，靠的就是这个

**如何应用：**
```yaml
# 同时运行的 Agents
- Agent 1: 代码审查 + 测试
- Agent 2: 文档更新
- Agent 3: 用户反馈处理
- Agent 4: 性能监控
- Agent 5: 新功能开发
- Agent 6-10: 临时任务/探索性工作

# 任务分配策略
复杂任务 → 拆分成子任务 → 分配给不同 Agents
紧急任务 → 高优先级 Agent
例行任务 → 低优先级 Agent
```

**管理技巧：**
- 给不同 Agent 不同的"角色"和权限
- 用不同的 channel 或 thread 区分
- 定期同步各 Agent 的进展
- 避免 Agent 之间的冲突（如同时修改同一文件）

**反面案例：**
- ❌ 所有任务都交给一个 Agent（串行，慢）
- ❌ 多个 Agent 同时修改同一文件（冲突）
- ❌ 没有任务分配策略（混乱）

**预期效果：**
- 4-10x 效率提升
- 可以同时处理多个项目
- 减少等待时间

---

### 5. Agent 自我感知 (Self-Awareness)

**Peter 原话：**
> "I made the agent very aware. Like, it knows what its source code is. It understands how it sits and runs in its own harness. It knows where documentation is. It knows which model it runs."

**为什么：**
- Agent 可以自我调试
- 支持自我修改
- 更容易理解自身限制
- 减少人工干预

**如何实现：**
```markdown
# 在 Agent 的系统提示中加入
- 你的源代码位置：/path/to/agent/code
- 你的运行方式：作为 gateway 的子进程
- 文档位置：/path/to/docs
- 当前模型：qwen3.5-plus
- 可用功能：voice=true, reasoning=false
- 工具列表：exec, browser, message, etc.
```

**应用场景：**
```
用户：你好像出错了
Agent：让我检查一下我的源代码...
       我发现在第 42 行有个边界条件没处理
       我来修复它
```

**反面案例：**
- ❌ Agent 不知道自己的代码在哪里
- ❌ 出错时只能等人工修复
- ❌ Agent 不知道自己能用什么工具

**预期效果：**
- Agent 可以自我修复简单问题
- 减少人工调试时间
- 更接近"自主"系统

---

### 6. 记忆系统：Markdown + Vector DB

**Peter 原话：**
> "The ultimate boss is continuous reinforcement learning, but I'm at level two or three with Markdown files and the vector database."

**为什么：**
- Markdown 文件：人类可读，易编辑
- Vector DB：语义搜索，快速检索
- 组合使用：兼顾灵活性和效率
- 是通往"持续强化学习"的中间阶段

**如何实现：**
```
memory/
├── MEMORY.md              # 长期记忆（ curated）
├── memory/
│   ├── 2026-03-07.md      # 每日日志
│   ├── 2026-03-08.md
│   └── ...
└── vector_db/             # 向量索引
    └── embeddings.bin
```

**使用策略：**
- 每日对话 → `memory/YYYY-MM-DD.md`
- 重要决策 → 提炼到 `MEMORY.md`
- 定期回顾 → 更新 MEMORY.md，删除过时信息
- Vector DB → 快速语义搜索

**反面案例：**
- ❌ 只靠模型上下文（有 token 限制）
- ❌ 只存不整理（信息过载）
- ❌ 完全依赖 Vector DB（丢失人类可读性）

**预期效果：**
- 跨会话记忆
- 快速找到相关信息
- 逐步接近"持续学习"

---

### 7. 语音编程

**Peter 实践：**
- 用语音输入代替键盘
- 突破输入速度限制
- 配合多 Agent 并行

**为什么：**
- 说话比打字快 3-5x
- 减少手部疲劳
- 可以边思考边说

**如何应用：**
```
# 配置语音输入
- 系统级语音识别（如 macOS Dictation）
- 或专用工具（如 Talon Voice）

# 工作流
1. 语音描述任务
2. Agent 执行
3. 语音反馈/调整
```

**反面案例：**
- ❌ 只用键盘输入（速度慢）
- ❌ 语音识别不准确就放弃
- ❌ 不优化语音命令格式

**预期效果：**
- 输入速度提升 3-5x
- 更自然的交互
- 减少疲劳

---

### 8. Fun over Seriousness

**Peter 原话：**
> "Because they all take themselves too serious. It's hard to compete against someone who's just there to have fun."

**为什么：**
- 保持创造力
- 避免 burnout
- 更容易坚持
- 吸引社区参与

**如何应用：**
- 给 Agent 起有趣的名字
- 允许"奇怪"的功能
- 享受开发过程
- 不追求完美，追求有趣

**反面案例：**
- ❌ 过度工程化
- ❌ 追求"企业级"但失去乐趣
- ❌ 因为"不严肃"而放弃好想法

**预期效果：**
- 更高的工作满意度
- 更强的创造力
- 更好的社区吸引力

---

### 9. 沙箱与权限控制

**Peter 早期做法：**
> "No security because I didn't have sandboxing in yet. I just prompted it to only listen to me."

**演进：**
1. 早期：只监听特定用户（软安全）
2. 中期：加入沙箱
3. 长期：细粒度权限控制

**最佳实践：**
```yaml
# 权限分级
- 读权限：所有文件
- 写权限：workspace 内
- 执行权限：白名单命令
- 网络权限：特定域名
- 外部操作：需要确认

# 沙箱策略
- 文件系统：chroot 或容器
- 网络：代理 + 过滤
- 进程：资源限制
```

**反面案例：**
- ❌ 完全无限制（高风险）
- ❌ 过度限制（无法工作）
- ❌ 权限模型不清晰

**预期效果：**
- 安全与便利的平衡
- 减少误操作风险
- 增强信任

---

### 10. NO_REPLY 令牌（群聊自然交互）

**Peter 设计：**
> "I gave him this no-reply token. So I gave him an option to shut up. So it feels more natural in a group chat."

**为什么：**
- 避免 Agent 在群聊中过度发言
- 更像人类的社交行为
- 减少信息噪音

**如何实现：**
```
# 系统提示
- 在群聊中，如果消息不是@你或直接问题
- 使用 <NO_REPLY> 标签表示不需要回复
- 只在能真正贡献价值时发言

# 判断逻辑
- 被@ → 回复
- 直接问题 → 回复
- 能添加价值 → 回复
- 否则 → NO_REPLY
```

**反面案例：**
- ❌ 每条消息都回复（烦人）
- ❌ 从不回复（没用）
- ❌ 回复无关内容（噪音）

**预期效果：**
- 更自然的群聊体验
- 减少信息过载
- 提高回复质量

---

### 11. 自我修改代码

**Peter 原话：**
> "People talk about self-modifying software, I just built it."

**为什么：**
- 快速原型
- 减少手动干预
- Agent 可以自我改进

**如何实现：**
```
# 前提条件
1. Agent 知道自己的代码位置
2. Agent 有写权限
3. 有测试/验证机制

# 工作流
用户：这个功能不好用
Agent：让我看看代码... 这里可以优化
       我来修改并测试
       好了，现在应该可以了
```

**反面案例：**
- ❌ 完全禁止自我修改（失去灵活性）
- ❌ 无限制的自我修改（风险高）
- ❌ 没有回滚机制

**预期效果：**
- 快速迭代
- 减少人工编码
- 更接近"自主"系统

---

### 12. 打字指示器 + 语音支持

**Peter 的惊喜时刻：**
> "You know the moment where it blew my mind was when I used it a lot and then at some point I just sent it a message and then a typing indicator appeared. And I'm like, wait, I didn't build that, it only had image support, so what is it even doing?"

**为什么：**
- 增强交互真实感
- 用户知道 Agent 在"思考"
- 支持多种输入格式（语音、图片、文本）

**如何实现：**
```
# 打字指示器
- 在 Agent 开始处理时发送
- 长时间任务：定期更新状态

# 语音支持
- 自动检测语音消息
- 调用转录服务
- 回复可以是语音或文本

# 文件类型检测
- 检查文件头（而非扩展名）
- 自动转换格式
- 选择最优处理方式
```

**反面案例：**
- ❌ 没有反馈（用户不知道在不在处理）
- ❌ 只支持文本（限制使用场景）
- ❌ 依赖文件扩展名（不可靠）

**预期效果：**
- 更真实的交互体验
- 支持更多使用场景
- 增强用户信任

---

### 13. 开放源码 + 社区协作

**Peter 理念：**
> "Every time someone made the first pull request is a win for our society, you know? Like, it doesn't matter how shitty it is, you gotta start somewhere."

**为什么：**
- 加速迭代
- 降低参与门槛
- 建立社区
- "Prompt requests" 从非程序员

**如何应用：**
- 欢迎第一个 PR（即使不完美）
- 提供清晰的贡献指南
- 接受"prompt 贡献"（非代码）
- 保持开放和友好

**反面案例：**
- ❌ 过高的贡献门槛
- ❌ 对新手 PR 过于苛刻
- ❌ 闭源开发（失去社区）

**预期效果：**
- 更快的迭代速度
- 更多的贡献者
- 更强的社区凝聚力

---

### 14. 文件类型自动检测

**Peter 案例：**
> "I sent an audio message... The agent detected it was a file with no file extension, checked the file header and found it was Opus format, used ffmpeg to convert it..."

**为什么：**
- 不依赖文件扩展名（不可靠）
- 自动选择最优处理方式
- 增强鲁棒性

**如何实现：**
```python
# 伪代码
def detect_file_type(file_path):
    # 读取文件头
    header = read_bytes(file_path, 16)
    
    # 根据文件头判断类型
    if header.startswith(b'Opus'):
        return 'audio/opus'
    elif header.startswith(b'\x89PNG'):
        return 'image/png'
    # ...
    
    # 自动选择处理工具
    if file_type == 'audio/opus':
        return transcribe_with_whisper(file_path)
```

**反面案例：**
- ❌ 只依赖文件扩展名
- ❌ 遇到未知类型就报错
- ❌ 硬编码处理方式

**预期效果：**
- 更强的鲁棒性
- 更好的用户体验
- 减少配置需求

---

### 15. 持续强化学习（终极目标）

**Peter 愿景：**
> "The ultimate boss is continuous reinforcement learning."

**当前阶段：** Level 2-3（Markdown + Vector DB）

**终极目标：**
- Agent 从每次交互中学习
- 个性化适应用户习惯
- 自动优化行为策略

**演进路径：**
```
Level 1: 无记忆（每次会话独立）
Level 2: Markdown 文件（手动整理）
Level 3: + Vector DB（语义搜索）
Level 4: 自动提炼（AI 整理记忆）
Level 5: 强化学习（从反馈中学习）
Level 6: 持续适应（个性化）
```

**如何开始：**
1. 先实现 Markdown + Vector DB
2. 添加自动提炼功能
3. 收集用户反馈
4. 用反馈训练策略

**预期效果：**
- 越来越懂用户
- 减少重复指导
- 真正的"个人"助理

---

## 🎯 立即行动清单

### 今天就能做的：
- [ ] 配置 Codex 作为默认编码模型
- [ ] 停用 Plan Mode，改用对话式协作
- [ ] 检查现有工具，优先使用 CLI 版本
- [ ] 启动第二个 Agent 处理并行任务

### 本周可以做的：
- [ ] 建立记忆系统（Markdown + Vector DB）
- [ ] 配置语音输入
- [ ] 添加自我感知信息到系统提示
- [ ] 实现 NO_REPLY 机制

### 本月可以做的：
- [ ] 建立沙箱环境
- [ ] 实现自我修改能力
- [ ] 优化多 Agent 协作流程
- [ ] 开始社区建设

---

## 📊 预期收益总结

| 实践 | 效率提升 | 难度 | 优先级 |
|------|----------|------|--------|
| Codex 默认编码 | 30-50% | 低 | P0 |
| 不用 Plan Mode | 20-30% | 低 | P0 |
| CLI over MCPs | 40-60% | 中 | P0 |
| 多 Agent 并行 | 400-1000% | 中 | P0 |
| 自我感知 | 20-30% | 低 | P1 |
| 记忆系统 | 50-70% | 中 | P1 |
| 语音编程 | 200-400% | 中 | P1 |
| Fun over Serious | 难以量化 | 低 | P2 |

---

## 🤘 结语

> "It felt like Factorio times infinite. I feel like I built my little playground. I never had so much fun than building this project."
> — Peter Steinberger

OpenClaw 的成功不是偶然，而是源于一套清晰的设计哲学和使用实践。这些最佳实践的核心是：

1. **实用主义** - 用 CLI 而不是复杂的 MCP
2. **自然交互** - 对话而不是计划
3. **并行思维** - 多 Agent 而不是单线程
4. **持续学习** - 记忆系统而不是遗忘
5. **保持乐趣** - Fun over Seriousness

**记住：** 这些不是规则，而是起点。像 Peter 一样，享受构建的过程，保持好奇心和探索精神。

---

*🦞 Rock 'n' Roll! 🤘*
