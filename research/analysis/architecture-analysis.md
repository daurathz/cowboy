# OpenClaw 技术架构分析

**作者：** Dick (迪克) 🤘  
**日期：** 2026-03-08  
**版本：** 1.0  
**任务来源：** OpenClaw 设计思想与最佳实践分析任务 (Agent 3)

---

## 一、架构概览图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         消息渠道层 (Channels)                            │
│  WhatsApp │ Telegram │ Discord │ Slack │ iMessage │ Signal │ DingTalk   │
│  (Baileys)│(grammY) │(discord)│(Bolt) │(BlueBubbles)│(CLI)  │(Webhook)  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ WebSocket / HTTP Webhook
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Gateway (控制平面)                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ • WebSocket 服务器 (默认 ws://127.0.0.1:18789)                   │    │
│  │ • HTTP API 服务器 (OpenAI 兼容 / 工具调用)                        │    │
│  │ • Control UI (Web 管理界面)                                       │    │
│  │ • Canvas Host (A2UI 渲染)                                        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  会话管理    │ │  消息路由    │ │  工具调度    │ │  记忆系统    │   │
│  │  Session     │ │  Router      │ │  Dispatcher  │ │  Memory      │   │
│  │  Manager     │ │              │ │              │ │  Manager     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Cron 调度   │ │  Webhook     │ │  技能加载    │ │  设备配对    │   │
│  │  Scheduler   │ │  Handler     │ │  Skill Loader│ │  Pairing     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Pi Agent     │   │  CLI 工具     │   │  Node 设备    │
│  (RPC 模式)    │   │  (openclaw)   │   │  (macOS/iOS/ │
│  • 模型推理   │   │  • 网关控制   │   │   Android)    │
│  • 工具调用   │   │  • 消息发送   │   │  • Canvas     │
│  • 会话状态   │   │  • 会话管理   │   │  • 相机/屏幕  │
└───────────────┘   └───────────────┘   │  • 通知/定位  │
                                        └───────────────┘
```

### 核心设计原则

1. **单一控制平面 (Single Control Plane)**: 一个 Gateway 实例管理所有消息渠道和工具
2. **本地优先 (Local-First)**: 默认绑定 loopback，通过 Tailscale/SSH 隧道实现远程访问
3. **WebSocket 为中心 (WebSocket-Centric)**: 所有客户端 (CLI、macOS App、WebChat、Nodes) 通过 WS 连接
4. **工具即能力 (Tools as Capabilities)**: 工具是 Agent 能力的核心扩展机制
5. **文件即记忆 (Files as Memory)**: Markdown 文件作为持久化记忆，向量索引加速检索

---

## 二、各组件详细说明

### 2.1 Gateway 架构

#### 核心职责

Gateway 是 OpenClaw 的**控制平面**，负责：

- **消息渠道管理**: 维护与 WhatsApp (Baileys)、Telegram (grammY)、Discord (discord.js)、Slack (Bolt) 等平台的连接
- **WebSocket 服务器**: 提供统一的 WS API 供客户端 (CLI、macOS App、WebChat、Nodes) 连接
- **HTTP API 服务器**: 提供 OpenAI 兼容的 API 端点和工具调用接口
- **会话管理**: 维护会话状态、历史消息、上下文压缩
- **工具调度**: 路由工具调用到正确的执行环境 (本地/沙箱/Node)
- **记忆系统**: 管理 Markdown 记忆文件和向量索引
- **技能加载**: 动态加载和管理 AgentSkills

#### 本地 vs 远程模式

| 模式 | 配置 | 绑定地址 | 认证要求 | 使用场景 |
|------|------|----------|----------|----------|
| **Local** | `gateway.mode: "local"` | `127.0.0.1` (loopback) | 可选 (推荐 token) | 单机使用，CLI/macOS App 本地连接 |
| **LAN** | `gateway.mode: "lan"` | `0.0.0.0` 或局域网 IP | **必须** (token/password) | 局域网内多设备访问 |
| **Remote** | `gateway.mode: "remote"` | 公网 IP / Tailscale | **必须** + TLS | 远程访问，跨网络 |

**端口配置优先级：**
```
--port CLI 参数 → OPENCLAW_GATEWAY_PORT 环境变量 → gateway.port 配置 → 18789 (默认)
```

**绑定配置优先级：**
```
CLI/覆盖 → gateway.bind 配置 → "loopback" (默认)
```

#### 配置示例

```json5
{
  gateway: {
    port: 18789,
    mode: "local",
    bind: "loopback",
    auth: {
      mode: "token",
      token: "5e0022ce69751f2573ed3306daa78643"
    },
    controlUi: {
      basePath: "49fbb991",
      allowedOrigins: ["http://127.0.0.1:18789"],
      allowInsecureAuth: true
    },
    tailscale: {
      mode: "off" // "serve" | "funnel" | "off"
    }
  }
}
```

#### 安全设计

- **设备配对**: 所有 WS 客户端 (包括 Nodes) 需要设备配对和 token 认证
- **签名挑战**: `connect.challenge` 要求客户端签名 nonce 证明身份
- **本地信任**: loopback 连接可自动批准，远程连接需显式配对
- **审计工具**: `openclaw security audit` 检查配置风险

---

### 2.2 Agentic Loop 设计

#### 决策循环机制

```
┌─────────────────────────────────────────────────────────────────┐
│                     Agentic Loop 流程                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 消息接收 → 2. 会话解析 → 3. 上下文组装 → 4. 模型推理        │
│       ↑                                              │          │
│       │                                              ▼          │
│  8. 响应交付 ← 7. 回复整形 ← 6. 工具执行 ← 5. 流式输出          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**详细流程：**

1. **消息接收 (Message Intake)**
   - 渠道消息通过 WebSocket 事件 (`event:chat`) 进入 Gateway
   - 消息验证和去重 (幂等键)
   - 触发会话路由

2. **会话解析 (Session Resolution)**
   - 根据 `sessionKey` 解析会话 (格式：`agent:<id>:<channel>:<peer>`)
   - 加载会话元数据和历史消息
   - 应用会话级配置 (模型、工具策略等)

3. **上下文组装 (Context Assembly)**
   - 加载系统提示 (System Prompt)
   - 注入技能列表 (Skills Snapshot)
   - 加载记忆上下文 (MEMORY.md + 日常笔记)
   - 应用 Bootstrap 文件 (AGENTS.md, SOUL.md, USER.md, TOOLS.md)
   - 计算 token 使用，触发自动压缩 (如果接近限制)

4. **模型推理 (Model Inference)**
   - 解析模型配置 (支持多 provider 和 failover)
   - 构建消息历史 (系统提示 + 用户消息 + 助手回复)
   - 调用模型 API (支持流式响应)
   - 处理思考模式 (reasoning) 和详细模式 (verbose)

5. **流式输出 (Streaming Output)**
   - `stream: "assistant"` - 助手文本增量
   - `stream: "tool"` - 工具调用事件 (开始/更新/结束)
   - `stream: "lifecycle"` - 生命周期事件 (start/end/error)
   - `stream: "compaction"` - 上下文压缩事件

6. **工具执行 (Tool Execution)**
   - 解析工具调用参数
   - 应用工具策略 (allow/deny/profile)
   - 路由到执行环境 (本地/沙箱/Node)
   - 捕获输出和错误

7. **回复整形 (Reply Shaping)**
   - 过滤 `NO_REPLY` 令牌 (静默回复)
   - 去重消息工具调用
   - 组装最终响应 (文本 + 工具摘要)
   - 应用错误回退 (如果工具失败)

8. **响应交付 (Response Delivery)**
   - 通过渠道发送回复
   - 更新会话历史
   - 触发记忆刷新 (如果接近压缩)

#### 消息队列管理

**队列模式 (Queue Modes):**

| 模式 | 行为 | 使用场景 |
|------|------|----------|
| **collect** | 收集多条消息后批量处理 | 群聊，避免频繁中断 |
| **steer** | 每条消息触发新循环 | 一对一对话 |
| **followup** | 等待前一个循环完成 | 需要连续上下文的场景 |

**序列化机制：**
- 每个会话键 (sessionKey) 有独立的队列通道 (session lane)
- 可选全局队列通道 (global lane) 防止工具/会话竞争
- 队列状态持久化到 `~/.openclaw/delivery-queue/`

#### NO_REPLY 令牌实现

**设计目的：** 允许 Agent 在群聊中"保持沉默"，避免不必要的回复打扰用户。

**实现机制：**

```javascript
// 伪代码示例
function shapeReply(payloads, options) {
  // 1. 过滤 NO_REPLY 令牌
  const filteredText = payloads.text.replace(/NO_REPLY/gi, '').trim();
  
  // 2. 检查是否有可渲染内容
  if (!filteredText && !payloads.toolSummaries.length) {
    return { shouldSend: false, reason: "NO_REPLY" };
  }
  
  // 3. 检查消息工具是否已发送回复 (避免重复)
  if (payloads.messagingToolSent && !options.forceReply) {
    return { shouldSend: false, reason: "DUPLICATE_SUPPRESSED" };
  }
  
  return { shouldSend: true, text: filteredText };
}
```

**使用场景：**
- 群聊中仅需记录信息，无需回复
- 工具调用已成功，无需额外确认
- 记忆刷新循环 (静默写入记忆文件)

---

### 2.3 Harness 设计

#### Agent 运行环境

**工作空间结构：**
```
~/.openclaw/workspace/
├── AGENTS.md           # Agent 行为指南
├── SOUL.md             # Agent 人格定义
├── USER.md             # 用户信息
├── TOOLS.md            # 本地工具配置
├── IDENTITY.md         # Agent 身份
├── MEMORY.md           # 长期记忆
├── memory/
│   ├── 2026-03-08.md   # 日常笔记 (按日期)
│   └── ...
├── skills/             # 工作空间技能
│   └── searxng/
│       └── SKILL.md
└── .openclaw/          # 内部状态
```

**多 Agent 隔离：**
- 每个 Agent 有独立的工作空间 (`agents.defaults.workspace`)
- 会话状态隔离 (`~/.openclaw/agents/<agentId>/sessions/`)
- 记忆索引隔离 (`~/.openclaw/memory/<agentId>.sqlite`)
- 技能快照隔离 (每会话缓存)

#### 工具暴露机制

**工具注册流程：**

```
1. 工具定义 (TypeBox Schema)
       ↓
2. 工具描述生成 (人类可读文本)
       ↓
3. 系统提示注入 (XML 格式技能列表)
       ↓
4. 模型 API Schema 发送 (函数定义)
       ↓
5. 工具调用路由 (Gateway Dispatcher)
```

**工具策略配置：**

```json5
{
  tools: {
    // 基础工具配置文件
    profile: "coding", // "minimal" | "coding" | "messaging" | "full"
    
    // 显式允许/拒绝
    allow: ["group:fs", "browser"],
    deny: ["group:runtime", "cron"],
    
    // 按 Provider 限制
    byProvider: {
      "google-antigravity": { profile: "minimal" },
      "openai/gpt-5.2": { allow: ["group:fs", "sessions_list"] }
    },
    
    // 沙箱配置
    sandbox: {
      mode: "non-main", // 非主会话运行在 Docker 沙箱
      docker: {
        network: "bridge",
        setupCommand: "apt-get update && apt-get install -y ..."
      }
    }
  }
}
```

**工具组 (Tool Groups):**
- `group:runtime` - `exec`, `bash`, `process`
- `group:fs` - `read`, `write`, `edit`, `apply_patch`
- `group:sessions` - `sessions_list`, `sessions_history`, `sessions_send`
- `group:memory` - `memory_search`, `memory_get`
- `group:web` - `web_search`, `web_fetch`
- `group:ui` - `browser`, `canvas`
- `group:automation` - `cron`, `gateway`
- `group:messaging` - `message`
- `group:nodes` - `nodes`

#### 沙箱实现

**沙箱模式：**

| 模式 | 描述 | 使用场景 |
|------|------|----------|
| **off** | 无沙箱，所有工具在主机运行 | 可信环境，单机使用 |
| **non-main** | 非主会话 (群聊/渠道) 在沙箱运行 | 共享环境，多用户 |
| **all** | 所有会话在沙箱运行 | 高安全要求 |

**Docker 沙箱配置：**
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        docker: {
          image: "node:22-slim",
          network: "bridge",
          workspaceAccess: "rw",
          setupCommand: "apt-get update && apt-get install -y git curl",
          dangerouslyAllowReservedContainerTargets: false
        }
      }
    }
  }
}
```

**沙箱工具限制：**
- 默认允许：`bash`, `process`, `read`, `write`, `edit`, `sessions_*`
- 默认拒绝：`browser`, `canvas`, `nodes`, `cron`, `discord`, `gateway`

---

### 2.4 工具系统设计

#### 可用工具列表

| 工具 | 描述 | 执行环境 |
|------|------|----------|
| **exec** | 执行 shell 命令 | 主机/沙箱/Node |
| **process** | 管理后台 exec 会话 | 主机/沙箱 |
| **read** | 读取文件内容 | 主机/沙箱 |
| **write** | 写入文件 | 主机/沙箱 |
| **edit** | 精确编辑文件 | 主机/沙箱 |
| **apply_patch** | 应用结构化补丁 | 主机/沙箱 |
| **web_search** | 搜索网页 (Brave/Perplexity) | 主机 |
| **web_fetch** | 提取网页内容 | 主机 |
| **browser** | 控制浏览器 (CDP) | 主机/Node |
| **canvas** | 渲染 Canvas (A2UI) | Node |
| **nodes** | 设备操作 (相机/屏幕/通知) | Node |
| **image** | 分析图片 | 主机 |
| **pdf** | 分析 PDF 文档 | 主机 |
| **message** | 发送消息到渠道 | 主机 |
| **cron** | 管理定时任务 | 主机 |
| **gateway** | 重启/更新 Gateway | 主机 |
| **sessions_*** | 会话管理工具 | 主机 |
| **memory_*** | 记忆检索工具 | 主机 |

#### 工具调用机制

**调用流程：**

```
Agent (模型)
    │
    │ 1. 生成工具调用 (JSON Schema)
    ▼
Gateway (Dispatcher)
    │
    │ 2. 验证工具策略 (allow/deny)
    │ 3. 解析执行环境 (host 参数)
    ▼
执行环境
    │
    ├─ 主机 (host: "gateway")
    │   └─ 直接执行工具函数
    │
    ├─ 沙箱 (host: "sandbox")
    │   └─ Docker 容器内执行
    │
    └─ Node (host: "node")
        └─ WebSocket RPC → Node 设备
    │
    ▼
4. 捕获输出/错误
    │
    ▼
5. 返回结果给模型
```

**工具调用示例：**
```json
{
  "name": "exec",
  "arguments": {
    "command": "git status",
    "yieldMs": 5000,
    "timeout": 60,
    "host": "gateway",
    "security": "allowlist"
  }
}
```

#### 工具权限控制

**三层权限模型：**

1. **全局策略** (`tools.*`)
   - 定义默认工具配置文件
   - 全局允许/拒绝列表

2. **Agent 级策略** (`agents.list[].tools.*`)
   - 覆盖全局配置
   - 支持按 Agent 定制

3. **会话级策略** (动态)
   - 沙箱模式自动限制
   - 群聊激活策略

**权限检查顺序：**
```
deny 列表 (最高优先级)
    ↓
byProvider 限制
    ↓
profile 基础配置
    ↓
allow 列表
    ↓
默认允许 (如果未配置)
```

---

### 2.5 频道/消息系统

#### 支持的平台

| 平台 | 集成方式 | 插件 | 群聊支持 | DM 策略 |
|------|----------|------|----------|---------|
| **WhatsApp** | Baileys (WebSocket) | 内置 | ✅ | pairing/allowlist |
| **Telegram** | grammY (Bot API) | 内置 | ✅ | pairing/allowlist |
| **Discord** | discord.js | 内置 | ✅ | pairing/allowlist |
| **Slack** | Bolt SDK | 内置 | ✅ | pairing/allowlist |
| **Google Chat** | Chat API (Webhook) | 内置 | ✅ | pairing/allowlist |
| **Signal** | signal-cli (CLI) | 内置 | ❌ | pairing/allowlist |
| **iMessage** | BlueBubbles (REST) | 内置 | ✅ | pairing/allowlist |
| **DingTalk** | Webhook | 内置 | ✅ | open/pairing |
| **IRC** | IRC 协议 | 内置 | ✅ | pairing/allowlist |
| **Microsoft Teams** | Bot Framework | 插件 | ✅ | pairing/allowlist |
| **Matrix** | Matrix API | 插件 | ✅ | pairing/allowlist |
| **Mattermost** | Bot API | 插件 | ✅ | pairing/allowlist |
| **Feishu** | WebSocket | 插件 | ✅ | pairing/allowlist |
| **LINE** | Messaging API | 插件 | ✅ | pairing/allowlist |
| **WebChat** | Gateway WebSocket | 内置 | ❌ | pairing |

#### 消息路由

**路由键格式：**
```
sessionKey = "agent:<agentId>:<channel>:<channelId>:<peerId>"
```

**示例：**
- 主会话 DM: `agent:main:slack:direct:U05AN0GGM3M`
- 群聊：`agent:main:slack:channel:C05B123456`
- Discord DM: `agent:main:discord:dm:123456789`

**路由决策流程：**

```
1. 接收消息 (渠道 → Gateway)
       ↓
2. 提取会话键 (channel + peer)
       ↓
3. 查找/创建会话
       ↓
4. 应用路由规则
   ├─ DM 策略 (pairing/allowlist/open)
   ├─ 群聊策略 (mention 要求)
   └─ Agent 路由 (per-agent 配置)
       ↓
5. 入队处理 (queue mode)
       ↓
6. 触发 Agentic Loop
```

#### 群组 vs 私聊处理

**私聊 (DM):**
- 默认需要配对 (`dmPolicy: "pairing"`)
- 配对码验证后加入 allowlist
- 会话键：`per-channel-peer` (每个联系人独立会话)

**群聊:**
- 默认需要提及 (`requireMention: true`)
- 提及模式：`@bot`, `/command`, `bot:`
- 会话键：`per-channel` (整个群一个会话) 或 `per-peer` (每人独立)

**配置示例：**
```json5
{
  channels: {
    slack: {
      dmPolicy: "pairing",
      groupPolicy: "allowlist",
      groups: {
        "*": { requireMention: true }
      },
      allowFrom: ["U05AN0GGM3M"] // 允许的 DM 用户
    },
    discord: {
      dmPolicy: "pairing",
      groups: {
        "123456789": { // 特定群 ID
          requireMention: true,
          activation: "mention" // 仅被提及时响应
        }
      }
    }
  }
}
```

---

### 2.6 记忆系统实现

#### Markdown 文件存储

**文件结构：**
```
~/.openclaw/workspace/
├── MEMORY.md              # 长期记忆 (精选)
└── memory/
    ├── 2026-03-07.md      # 日常笔记 (按日期)
    ├── 2026-03-08.md
    └── projects.md        # 主题笔记 (可选)
```

**记忆层级：**

| 文件 | 用途 | 加载策略 |
|------|------|----------|
| `MEMORY.md` | 长期记忆，精选内容 | 仅主会话加载 |
| `memory/YYYY-MM-DD.md` | 日常笔记，原始日志 | 加载今天 + 昨天 |
| `memory/*.md` | 主题笔记 | 向量索引，按需检索 |

**写入策略：**
- 对话日志 → `memory/YYYY-MM-DD.md` (追加模式)
- 重要决策 → `MEMORY.md` (手动/自动)
- 记忆刷新 → 压缩前自动触发 (`memoryFlush`)

#### 向量数据库集成

**架构：**
```
Markdown 文件
    │
    │ 1. 分块 (chunking, ~400 tokens)
    ▼
嵌入模型 (Embedding Model)
    │
    │ 2. 生成向量 (768/1536 维)
    ▼
SQLite + sqlite-vec
    │
    │ 3. 存储向量 + 元数据
    ▼
混合检索 (Hybrid Search)
    ├─ 向量相似度 (cosine)
    └─ BM25 关键词匹配
    │
    ▼
4. 结果融合 + 重排序
    ├─ 时间衰减 (temporal decay)
    └─ MMR 多样性 (maximal marginal relevance)
```

**嵌入提供者：**

| Provider | 模型 | 模式 |
|----------|------|------|
| **local** | embeddinggemma-300m (GGUF) | 本地，node-llama-cpp |
| **openai** | text-embedding-3-small | 远程 API |
| **gemini** | gemini-embedding-001 | 远程 API |
| **voyage** | voyage-3 | 远程 API |
| **mistral** | mistral-embed | 远程 API |
| **ollama** | 自定义 | 自托管 |

**配置示例：**
```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "local", // 或 "openai", "gemini"
        local: {
          modelPath: "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/..."
        },
        query: {
          hybrid: {
            enabled: true,
            vectorWeight: 0.7,
            textWeight: 0.3,
            mmr: {
              enabled: true,
              lambda: 0.7
            },
            temporalDecay: {
              enabled: true,
              halfLifeDays: 30
            }
          }
        }
      }
    }
  }
}
```

#### 记忆检索机制

**工具：**

1. **memory_search** - 语义检索
   ```json
   {
     "query": "用户的工作安排",
     "limit": 5
   }
   ```
   返回：片段文本 + 文件路径 + 行号 + 分数

2. **memory_get** - 精确读取
   ```json
   {
     "path": "memory/2026-03-08.md",
     "offset": 1,
     "limit": 50
   }
   ```
   返回：完整文件内容

**检索流程：**
```
1. 接收查询 (memory_search)
       ↓
2. 生成查询嵌入
       ↓
3. 向量检索 (top-K by cosine similarity)
       ↓
4. BM25 检索 (top-K by keyword match)
       ↓
5. 结果融合 (weighted score)
       ↓
6. 时间衰减 (dated files only)
       ↓
7. MMR 重排序 (去重)
       ↓
8. 返回片段 (含引用信息)
```

**混合检索公式：**
```
finalScore = vectorWeight × vectorScore + textWeight × textScore
textScore = 1 / (1 + bm25Rank)
```

**时间衰减公式：**
```
decayedScore = score × e^(-λ × ageInDays)
λ = ln(2) / halfLifeDays
```

---

### 2.7 自我意识实现

#### Agent 如何知道自己的源代码

**机制：** 通过注入 Bootstrap 文件到系统提示

**系统提示结构：**
```
<system_prompt>
  <base_prompt>
    <!-- OpenClaw 基础提示：角色定义、工具使用指南 -->
  </base_prompt>
  
  <bootstrap>
    <!-- 工作空间文件内容 -->
    <file name="AGENTS.md">
      ... 内容 ...
    </file>
    <file name="SOUL.md">
      ... 内容 ...
    </file>
    <file name="TOOLS.md">
      ... 内容 ...
    </file>
    <file name="IDENTITY.md">
      ... 内容 ...
    </file>
  </bootstrap>
  
  <skills>
    <!-- 可用技能列表 (XML 格式) -->
    <skill name="searxng" location="/workspace/skills/searxng">
      Privacy-respecting metasearch...
    </skill>
    ...
  </skills>
  
  <tools>
    <!-- 工具定义 (JSON Schema) -->
    ...
  </tools>
  
  <session_context>
    <!-- 当前会话状态 -->
    model: dashscope-coding/qwen3.5-plus
    workspace: /home/admin/.openclaw/workspace
    thinking: off
    ...
  </session_context>
</system_prompt>
```

**自修改能力：**
- Agent 可以 `read` 自己的配置文件 (`openclaw.json`)
- 可以 `edit` 技能和 Bootstrap 文件
- 可以 `exec` 命令重启 Gateway (`openclaw gateway restart`)
- 通过 `gateway` 工具应用配置变更

#### 如何访问文档

**文档访问方式：**

1. **本地文档** (工作空间内)
   ```
   /workspace/docs/           # 本地文档
   /workspace/skills/*/SKILL.md  # 技能文档
   ```

2. **远程文档** (通过工具)
   ```javascript
   // 使用 web_fetch 工具
   web_fetch({
     url: "https://docs.openclaw.ai/concepts/architecture",
     extractMode: "markdown"
   })
   ```

3. **系统提示注入**
   - 技能描述自动注入
   - 工具定义自动注入
   - 配置摘要自动注入

#### 如何 Introspect 自己的配置

**配置 introspection 工具：**

1. **gateway.config.get** - 读取配置
   ```json
   {
     "action": "config.get",
     "path": "gateway.port"
   }
   ```

2. **gateway.config.schema.lookup** - 查询配置 Schema
   ```json
   {
     "action": "config.schema.lookup",
     "path": "gateway.auth"
   }
   ```

3. **session_status** - 查询会话状态
   ```json
   {
     "sessionKey": "agent:main:slack:direct:U05AN0GGM3M"
   }
   ```
   返回：模型、token 使用、工具策略、激活模式等

**自描述能力：**
```markdown
# Agent 知道的关于自己的信息

- **源代码位置**: `/home/admin/.openclaw/workspace/`
- **运行环境**: Node.js v24.14.0 on Linux
- **Gateway 端口**: 10259 (ws://127.0.0.1:10259)
- **当前模型**: dashscope-coding/qwen3.5-plus
- **工作空间**: /home/admin/.openclaw/workspace
- **可用工具**: exec, process, read, write, edit, browser, canvas, nodes...
- **技能数量**: 7 (searxng, meeting, notify, report...)
- **记忆系统**: SQLite + 向量索引 (local embedding)
- **渠道连接**: Slack, DingTalk
```

---

## 三、组件间交互流程

### 3.1 典型消息处理流程

```
用户 (Slack)
    │
    │ "帮我查一下 OpenClaw 的架构文档"
    ▼
┌─────────────────────────────────────────┐
│ 1. Slack 渠道接收消息                    │
│    - Bolt SDK 监听 event:message        │
│    - 验证签名和 token                    │
└─────────────────────────────────────────┘
    │
    │ WebSocket 事件 (event:chat)
    ▼
┌─────────────────────────────────────────┐
│ 2. Gateway 消息路由                      │
│    - 解析 sessionKey                     │
│    - 检查 DM 策略 (pairing/allowlist)    │
│    - 查找/创建会话                       │
└─────────────────────────────────────────┘
    │
    │ 触发 Agentic Loop
    ▼
┌─────────────────────────────────────────┐
│ 3. 上下文组装                            │
│    - 加载系统提示                        │
│    - 注入技能列表                        │
│    - 检索记忆上下文                      │
│    - 附加历史消息 (最近 N 条)             │
└─────────────────────────────────────────┘
    │
    │ 调用模型 API
    ▼
┌─────────────────────────────────────────┐
│ 4. 模型推理                              │
│    - 流式响应                            │
│    - 生成工具调用 (web_fetch)            │
└─────────────────────────────────────────┘
    │
    │ 工具调用事件
    ▼
┌─────────────────────────────────────────┐
│ 5. 工具执行                              │
│    - web_fetch 提取文档内容              │
│    - 返回 Markdown                       │
└─────────────────────────────────────────┘
    │
    │ 继续推理
    ▼
┌─────────────────────────────────────────┐
│ 6. 生成回复                              │
│    - 总结文档内容                        │
│    - 格式化响应 (Markdown)               │
└─────────────────────────────────────────┘
    │
    │ message.send 工具调用
    ▼
┌─────────────────────────────────────────┐
│ 7. 消息交付                              │
│    - Slack API 发送消息                  │
│    - 支持线程回复                        │
└─────────────────────────────────────────┘
    │
    ▼
用户收到回复
```

### 3.2 多 Agent 协作流程

```
主 Agent (会话：agent:main:slack:direct:U05AN0GGM3M)
    │
    │ 任务：分析 OpenClaw 架构
    │
    │ sessions_spawn 工具调用
    ▼
┌─────────────────────────────────────────┐
│ Gateway 创建子 Agent                      │
│    - 分配独立会话键                      │
│    - 继承工作空间                        │
│    - 应用子 Agent 配置                    │
└─────────────────────────────────────────┘
    │
    │ 子 Agent 运行 (并行)
    ├─ Agent 1: 设计思想分析
    ├─ Agent 2: 最佳实践分析
    ├─ Agent 3: 技术架构分析 ← 当前
    └─ Agent 4: 对比与改进方案
    │
    │ 子 Agent 完成 → sessions_send
    ▼
┌─────────────────────────────────────────┐
│ 结果汇总                                 │
│    - 收集各子 Agent 输出                  │
│    - 合并到最终报告                      │
│    - 通知主协调 Agent                     │
└─────────────────────────────────────────┘
```

---

## 四、关键设计决策

### 4.1 为什么选择 WebSocket 为中心？

**决策背景：**
- 需要支持实时双向通信
- 多客户端并发连接 (CLI、macOS App、WebChat、Nodes)
- 低延迟要求 (打字指示、流式响应)

**替代方案对比：**

| 方案 | 优点 | 缺点 | OpenClaw 选择 |
|------|------|------|---------------|
| **REST API** | 简单、成熟 | 轮询延迟高、双向通信困难 | ❌ |
| **gRPC** | 高性能、强类型 | 浏览器支持差、复杂度高 | ❌ |
| **WebSocket** | 实时双向、低延迟、广泛支持 | 需要管理连接状态 | ✅ |
| **MQTT** | 轻量、IoT 友好 | 消息队列语义过强 | ❌ |

**实现细节：**
- 单一端口 multiplexing (WS + HTTP)
- 首帧必须是 `connect` (握手验证)
- 事件驱动架构 (`event:agent`, `event:chat`, `event:presence`)
- 序列号追踪 (检测消息丢失)

### 4.2 为什么使用 Markdown 作为记忆存储？

**决策背景：**
- 需要持久化、可检索的记忆
- Agent 需要能读写自己的记忆
- 人类需要能理解和编辑记忆

**替代方案对比：**

| 方案 | 优点 | 缺点 | OpenClaw 选择 |
|------|------|------|---------------|
| **数据库 (SQL/NoSQL)** | 高效查询、结构化 | Agent 难直接操作、人类难阅读 | ❌ |
| **纯向量数据库** | 语义检索强大 | 丢失原始上下文、难编辑 | ❌ |
| **Markdown 文件** | 人类可读、Agent 可编辑、易版本控制 | 检索需要额外索引 | ✅ |
| **JSON 日志** | 结构化、易解析 | 人类阅读困难 | ❌ |

**增强机制：**
- SQLite + sqlite-vec 加速向量检索
- 混合检索 (向量 + BM25)
- 时间衰减和 MMR 重排序
- 自动记忆刷新 (压缩前触发)

### 4.3 为什么支持自我修改？

**决策背景：**
- Peter 的愿景：Agent 应该能改进自己
- 减少人工干预，提高自主性
- 符合"Agentic Engineering"理念

**安全考虑：**
- 工作空间隔离 (sandbox 模式)
- 工具策略限制 (deny exec/browser in groups)
- 配置变更需要 Gateway 重启 (防止热注入攻击)
- 审计日志记录所有修改

**实现示例：**
```javascript
// Agent 可以执行这样的操作：
edit({
  path: "/workspace/skills/searxng/SKILL.md",
  oldText: "version: 1.0.1",
  newText: "version: 1.0.2"
});

exec({
  command: "openclaw gateway restart",
  timeout: 30
});
```

### 4.4 为什么不用 MCPs (Model Context Protocols)?

**Peter 的观点：**
> "Most MCPs should be CLIs. The agent will try the CLI, get the help menu, and from now on we're good."

**设计理由：**
1. **简单性**: CLI 是通用接口，无需额外协议层
2. **自发现**: Agent 可以通过 `--help` 学习 CLI 用法
3. **灵活性**: CLI 可以组合、管道、脚本化
4. **低耦合**: 不依赖特定 SDK 或协议版本

**OpenClaw 实现：**
- 工具直接暴露为函数调用 (TypeBox Schema)
- 技能提供使用指南 (SKILL.md)
- exec 工具可以调用任何 CLI

---

## 五、可扩展性分析

### 5.1 水平扩展能力

**多 Gateway 部署：**
```
                    ┌─────────────┐
                    │  Load       │
                    │  Balancer   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │ Gateway 1 │   │ Gateway 2 │   │ Gateway 3 │
    │ Port 18789│   │ Port 18790│   │ Port 18791│
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │                │                │
    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
    │ Agent A   │   │ Agent B   │   │ Agent C   │
    │ Workspace │   │ Workspace │   │ Workspace │
    └───────────┘   └───────────┘   └───────────┘
```

**配置隔离：**
- 每个 Gateway 独立端口 (`gateway.port`)
- 独立配置路径 (`OPENCLAW_CONFIG_PATH`)
- 独立状态目录 (`OPENCLAW_STATE_DIR`)
- 独立工作空间 (`agents.defaults.workspace`)

**限制：**
- WhatsApp 会话不能共享 (每个 Gateway 独立 Baileys 会话)
- 渠道连接不能跨 Gateway 共享
- 需要外部负载均衡 (无内置集群)

### 5.2 垂直扩展能力

**单 Gateway 多 Agent：**
```
Gateway (单实例)
    │
    ├─ Agent: main (主会话)
    │   └─ 会话：slack:direct:U05AN0GGM3M
    │
    ├─ Agent: support (客服 Agent)
    │   ├─ 会话：slack:channel:C05B123456
    │   └─ 工具策略：messaging only
    │
    ├─ Agent: dev (开发 Agent)
    │   ├─ 会话：discord:channel:789
    │   └─ 工具策略：coding (fs + runtime)
    │
    └─ Agent: cron (定时任务 Agent)
        └─ 触发：cron jobs
```

**资源隔离：**
- 每 Agent 独立会话状态
- 每 Agent 独立记忆索引
- 每 Agent 独立工具策略
- 共享 Gateway 资源 (渠道连接、WebSocket 服务器)

### 5.3 插件扩展性

**技能插件：**
```
~/.openclaw/extensions/
└── qqbot/
    └── skills/
        ├── qqbot-cron/
        │   └── SKILL.md  # 定时提醒技能
        └── qqbot-media/
            └── SKILL.md  # 媒体发送技能
```

**工具插件：**
```javascript
// 插件注册新工具
export function registerTools(registry) {
  registry.addTool({
    name: "qq_send",
    description: "Send message via QQ bot",
    schema: { /* TypeBox schema */ },
    handler: async (params) => { /* ... */ }
  });
}
```

**渠道插件：**
```javascript
// 插件注册新渠道
export function registerChannels(registry) {
  registry.addChannel({
    name: "qq",
    adapter: QQAdapter,
    config: { /* schema */ }
  });
}
```

### 5.4 与其他 AI 框架对比

| 特性 | OpenClaw | LangChain | AutoGen | CrewAI |
|------|----------|-----------|---------|--------|
| **部署模式** | 自托管 Gateway | 库/框架 | 库/框架 | 库/框架 |
| **消息渠道** | 20+ 内置 | 需自建 | 需自建 | 需自建 |
| **记忆系统** | Markdown + 向量 | 可插拔 | 可插拔 | 可插拔 |
| **自我意识** | ✅ (Bootstrap 注入) | ❌ | ❌ | ❌ |
| **自我修改** | ✅ (文件编辑 + 重启) | ❌ | ❌ | ❌ |
| **多 Agent** | ✅ (sessions_spawn) | ✅ (需要编排) | ✅ | ✅ |
| **沙箱支持** | ✅ (Docker) | ❌ | ❌ | ❌ |
| **Web UI** | ✅ (Control UI) | ❌ | ❌ | ❌ |
| **移动 App** | ✅ (macOS/iOS/Android) | ❌ | ❌ | ❌ |
| **开源协议** | MIT | MIT | MIT | MIT |

**OpenClaw 优势：**
1. **完整产品**: 不仅是框架，而是端到端解决方案
2. **渠道集成**: 开箱即用的多平台消息支持
3. **自我意识**: Agent 知道自己的配置和代码
4. **安全设计**: 内置沙箱、工具策略、审计
5. **用户体验**: Web UI、移动 App、打字指示

**OpenClaw 劣势：**
1. **复杂度**: 完整系统 vs 轻量库
2. **资源占用**: Gateway 常驻进程
3. **学习曲线**: 需要理解 Gateway/Agent/Node 概念

---

## 六、总结与展望

### 6.1 架构亮点

1. **统一的控制平面**: Gateway 作为单一事实来源，简化了多渠道管理
2. **文件即记忆**: Markdown 设计使记忆既机器可检索又人类可编辑
3. **自我意识**: Bootstrap 注入让 Agent 了解自己的配置和能力
4. **安全优先**: 沙箱、工具策略、设备配对多层防护
5. **扩展性强**: 支持多 Agent、插件、多渠道

### 6.2 待改进领域

1. **集群支持**: 目前无内置高可用/故障转移
2. **性能优化**: 大工作空间下的记忆检索延迟
3. **渠道覆盖**: 部分渠道仍需插件 (微信、Line 等)
4. **文档完善**: 部分高级功能文档不足

### 6.3 未来方向

根据 Peter 的采访和 VISION.md：

1. **连续强化学习**: 从当前 Level 2-3 (Markdown + 向量) 进化到连续学习
2. **更好的多 Agent 协作**: 改进子 Agent 编排和结果合并
3. **增强的自我修改**: 更安全的代码修改和部署流程
4. **边缘设备支持**: 更好的 iOS/Android Node 功能

---

## 附录 A：配置示例

### 完整配置示例

```json5
{
  // Gateway 配置
  gateway: {
    port: 18789,
    mode: "local",
    bind: "loopback",
    auth: {
      mode: "token",
      token: "${OPENCLAW_GATEWAY_TOKEN}"
    },
    tailscale: {
      mode: "off"
    }
  },
  
  // Agent 默认配置
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6"
      },
      imageModel: {
        primary: "openai/gpt-4o"
      },
      workspace: "~/.openclaw/workspace",
      compaction: {
        mode: "safeguard",
        reserveTokensFloor: 20000
      },
      memorySearch: {
        provider: "local",
        query: {
          hybrid: {
            enabled: true,
            vectorWeight: 0.7,
            textWeight: 0.3
          }
        }
      },
      sandbox: {
        mode: "non-main",
        docker: {
          image: "node:22-slim",
          network: "bridge"
        }
      }
    }
  },
  
  // 工具配置
  tools: {
    profile: "coding",
    deny: ["group:automation"],
    web: {
      search: { enabled: true },
      fetch: { enabled: true }
    },
    browser: {
      enabled: true,
      defaultProfile: "openclaw"
    }
  },
  
  // 渠道配置
  channels: {
    slack: {
      mode: "socket",
      botToken: "${SLACK_BOT_TOKEN}",
      appToken: "${SLACK_APP_TOKEN}",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    },
    telegram: {
      botToken: "${TELEGRAM_BOT_TOKEN}",
      dmPolicy: "pairing"
    },
    discord: {
      token: "${DISCORD_BOT_TOKEN}",
      dmPolicy: "pairing"
    }
  },
  
  // 技能配置
  skills: {
    entries: {
      "searxng": {
        enabled: true,
        env: {
          SEARXNG_URL: "http://localhost:8080"
        }
      }
    },
    load: {
      watch: true,
      watchDebounceMs: 250
    }
  },
  
  // Cron 配置
  cron: {
    enabled: true
  },
  
  // Hook 配置
  hooks: {
    internal: {
      enabled: true,
      entries: {
        "boot-md": { enabled: true },
        "session-memory": { enabled: true }
      }
    }
  }
}
```

---

## 附录 B：术语表

| 术语 | 定义 |
|------|------|
| **Gateway** | OpenClaw 控制平面，管理渠道、工具、会话 |
| **Agentic Loop** | Agent 决策循环：接收→推理→工具→回复 |
| **Harness** | Agent 运行环境，包括工作空间和工具暴露 |
| **Session** | 会话，由 sessionKey 唯一标识的对话上下文 |
| **Node** | 配对设备 (macOS/iOS/Android)，提供设备能力 |
| **Skill** | AgentSkills 兼容的技能包，教导 Agent 使用工具 |
| **Bootstrap** | 注入系统提示的工作空间文件 (AGENTS.md 等) |
| **NO_REPLY** | 静默令牌，Agent 回复时不发送给用户 |
| **Pairing** | 设备/用户配对流程，建立信任关系 |
| **Sandbox** | Docker 容器隔离，限制工具执行环境 |

---

*报告完成。已通知主协调 Agent。* 🦞
