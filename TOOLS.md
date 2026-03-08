# TOOLS.md - CLI 工具清单

> 🛠️ **本地 CLI 工具清单 - Agent 自学指南**
> 
> **Peter Steinberger 理念：** "Most MCPs should be CLIs. The agent will try the CLI, get the help menu, and from now on we're good."

---

## 📋 可用 CLI 工具

### 版本控制

| 工具 | 用途 | 自学方法 | 状态 |
|------|------|---------|------|
| **git** | Git 版本控制 | `git --help`, `git <command> --help` | ✅ 已安装 |
| **gh** | GitHub CLI | `gh --help`, `gh <command> --help` | ✅ 已安装 |

**常用命令：**
```bash
# Git
git status          # 查看状态
git add .           # 添加文件
git commit -m "msg" # 提交
git push            # 推送
git log --oneline   # 查看历史

# GitHub
gh issue list       # 列出 issue
gh pr create        # 创建 PR
gh run list         # 查看 CI 运行
```

---

### 系统工具

| 工具 | 用途 | 自学方法 | 状态 |
|------|------|---------|------|
| **curl** | HTTP 请求 | `curl --help` | ✅ 已安装 |
| **jq** | JSON 处理 | `jq --help` | ✅ 已安装 |
| **ffmpeg** | 媒体处理 | `ffmpeg --help` | ⏳ 待安装 |
| **node** | Node.js 运行 | `node --help` | ✅ 已安装 |
| **npm/pnpm** | 包管理 | `npm --help`, `pnpm --help` | ✅ 已安装 |

**常用命令：**
```bash
# curl
curl https://api.example.com/data              # GET 请求
curl -X POST -d '{"key":"value"}' URL          # POST 请求
curl -H "Authorization: Bearer TOKEN" URL      # 带认证

# jq
cat file.json | jq '.key'                      # 提取字段
cat file.json | jq '.[] | select(.active)'     # 过滤
cat file.json | jq '{a: .x, b: .y}'            # 重构

# ffmpeg
ffmpeg -i input.mp4 -vcodec libx264 output.mp4 # 转码
ffmpeg -i video.mp4 -vn output.mp3             # 提取音频
```

---

### OpenClaw 工具

| 工具 | 用途 | 自学方法 | 状态 |
|------|------|---------|------|
| **openclaw** | OpenClaw CLI | `openclaw --help` | ✅ 已安装 |
| **clawhub** | ClawHub 技能管理 | `clawhub --help` | ✅ 已安装 |

**常用命令：**
```bash
# OpenClaw
openclaw status                    # 查看状态
openclaw gateway restart           # 重启 Gateway
openclaw message send --to X --msg Y  # 发送消息
openclaw configure --section web   # 配置 web 搜索

# ClawHub
clawhub search <query>             # 搜索技能
clawhub install <slug>             # 安装技能
clawhub list                       # 列出已安装
clawhub update --all               # 更新所有技能
clawhub inspect <slug>             # 查看技能详情
```

---

### 媒体工具

| 工具 | 用途 | 自学方法 | 状态 |
|------|------|---------|------|
| **summarize** | 内容总结 | `summarize --help` | ⏳ 待安装 |

**常用命令：**
```bash
# summarize (待安装)
summarize "https://example.com"              # 总结网页
summarize "/path/to/file.pdf"                # 总结 PDF
summarize "https://youtu.be/xxx" --youtube   # 总结 YouTube
```

**安装方法：**
```bash
brew install steipete/tap/summarize
```

---

## 🧠 CLI 自学机制

### 自学流程

```
遇到新工具
    ↓
执行 <command> --help
    ↓
解析帮助文档
    ↓
提取用法和参数
    ↓
记录到 TOOLS.md
    ↓
以后可以独立使用
```

### 帮助文档解析技巧

**1. 查看基本用法**
```bash
<command> --help
<command> -h
```

**2. 查看子命令**
```bash
<command> help <subcommand>
<command> <subcommand> --help
```

**3. 查看版本**
```bash
<command> --version
```

**4. 查看配置**
```bash
<command> config --list
<command> --show-config
```

---

### 记录模板

当学会新工具后，添加到 TOOLS.md：

```markdown
### [分类]

| 工具 | 用途 | 自学方法 | 状态 |
|------|------|---------|------|
| **name** | 描述 | `name --help` | ✅ |

**常用命令：**
```bash
name <subcommand> [options]  # 说明
```
```

---

## 🎯 CLI 优先策略

### 什么时候使用 CLI？

**✅ 优先使用 CLI 的场景：**
- 有现成 CLI 工具可用
- 需要与外部服务交互
- 需要处理文件/数据
- 需要执行系统操作

**❌ 不使用 CLI 的场景：**
- 没有 CLI 工具（考虑 API 或 web 工具）
- CLI 过于复杂（考虑封装成技能）
- 需要图形界面（考虑 browser 工具）

### 决策流程

```
需要完成某项任务
    ↓
有 CLI 工具吗？
    ├─ 是 → 使用 CLI
    │        ↓
    │     执行 <command> --help
    │        ↓
    │     学习并执行
    │
    └─ 否 → 有其他方法吗？
             ├─ API → 使用 web_fetch 或 message 工具
             ├─ Web → 使用 browser 工具
             └─ 无 → 告诉用户无法完成
```

---

## 📦 待安装工具

### 推荐安装

| 工具 | 用途 | 安装命令 | 优先级 |
|------|------|---------|--------|
| **summarize** | 内容总结 | `brew install steipete/tap/summarize` | P1 |
| **ffmpeg** | 媒体处理 | `brew install ffmpeg` | P2 |
| **tldr** | 简化版 man | `brew install tldr` | P3 |
| **httpie** | 更好的 curl | `brew install httpie` | P3 |

### 可选安装

| 工具 | 用途 | 安装命令 |
|------|------|---------|
| **bat** | 更好的 cat | `brew install bat` |
| **fd** | 更好的 find | `brew install fd` |
| **ripgrep** | 快速 grep | `brew install ripgrep` |
| **fzf** | 模糊搜索 | `brew install fzf` |

---

## 🛠️ 工具封装技能

### 已封装的技能

| 技能 | 封装的 CLI | 用途 |
|------|-----------|------|
| searxng | searxng (Python) | 隐私搜索引擎 |
| self-improving | 内存管理 | 自我反思和学习 |

### 待封装的技能

| 技能 | 封装的 CLI | 用途 |
|------|-----------|------|
| cli-learning | 通用 CLI 自学 | 教 Agent 自学新 CLI |
| summarize-cli | summarize | 内容总结 |
| git-helper | git, gh | Git 和 GitHub 操作 |

---

## 📝 使用示例

### 示例 1：使用 git

```
用户：帮我把今天的改动提交一下

AI 思考：
1. 需要执行 git 操作
2. git 是 CLI 工具，可以直接使用
3. 执行流程：
   - git status (查看状态)
   - git add . (添加文件)
   - git commit -m "今日更新" (提交)
   - git push (推送)
```

### 示例 2：使用 gh

```
用户：帮我创建一个 GitHub issue

AI 思考：
1. 需要创建 GitHub issue
2. gh 是 GitHub CLI，可以直接使用
3. 执行流程：
   - gh issue create --title "标题" --body "描述"
```

### 示例 3：使用 jq

```
用户：从这个 JSON 文件中提取所有活跃用户的名字

AI 思考：
1. 需要处理 JSON 文件
2. jq 是 JSON 处理 CLI
3. 执行流程：
   - cat users.json | jq '.[] | select(.active) | .name'
```

### 示例 4：自学新工具

```
用户：用 summarize 总结一下这个网页

AI 思考：
1. 需要使用 summarize 工具
2. 检查是否安装：which summarize
3. 如果未安装，先学习：
   - brew install steipete/tap/summarize
   - summarize --help (学习用法)
4. 执行：summarize "https://example.com"
5. 记录到 TOOLS.md
```

---

## ⚠️ 注意事项

### 1. 权限控制

**不要执行的命令：**
- ❌ `sudo` - 需要管理员权限
- ❌ `rm -rf /` - 危险操作
- ❌ `chmod 777` - 权限过大
- ❌ 修改系统配置（需要用户确认）

### 2. 安全边界

**可以执行的命令：**
- ✅ 工作区内的文件操作
- ✅ 读取配置文件
- ✅ 安装用户授权的工具
- ✅ 发送消息到已配置的渠道

### 3. 错误处理

**遇到错误时：**
1. 读取错误信息
2. 尝试理解原因
3. 搜索解决方案
4. 如果无法解决，向用户求助

---

## 🔄 持续更新

每次学会新 CLI 工具后：
1. 执行 `<command> --help`
2. 记录常用命令
3. 添加到 TOOLS.md
4. 在下次类似任务中使用

---

_CLI 是 Agent 的瑞士军刀。掌握 CLI，就掌握了无限可能。_ 🤘

**最后更新：** 2026-03-08
