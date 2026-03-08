# CLI 自学技能

> 🎓 **教 AI 如何自学新的 CLI 工具**
> 
> **Peter Steinberger 理念：** "Most MCPs should be CLIs. The agent will try the CLI, get the help menu, and from now on we're good."

---

## 🎯 适用场景

**当遇到新 CLI 工具时：**
- 用户要求使用某个 CLI 工具
- 任务需要但之前未学过
- 发现更好的 CLI 替代方案

**触发条件：**
- 用户明确说"用 X 工具做 Y"
- 任务需要但无现成技能
- 有 CLI 但未封装成技能

---

## 🧠 自学流程

```
1. 检查工具是否安装
   ↓
2. 如果未安装 → 安装工具
   ↓
3. 执行 <command> --help
   ↓
4. 解析帮助文档
   ↓
5. 提取关键用法
   ↓
6. 记录到 TOOLS.md
   ↓
7. 执行用户任务
   ↓
8. 总结学习成果
```

---

## 📋 详细步骤

### 步骤 1：检查工具

```bash
# 检查是否安装
which <command>
# 或
<command> --version
```

**判断：**
- ✅ 已安装 → 跳到步骤 3
- ❌ 未安装 → 步骤 2

---

### 步骤 2：安装工具

**根据工具选择安装方式：**

```bash
# Homebrew (macOS/Linux)
brew install <tool>

# npm
npm install -g <tool>

# pnpm
pnpm add -g <tool>

# pip
pip install <tool>

# 其他
# 参考工具官方文档
```

**验证安装：**
```bash
<command> --version
```

---

### 步骤 3：学习帮助文档

**基础帮助：**
```bash
<command> --help
# 或
<command> -h
```

**子命令帮助：**
```bash
<command> <subcommand> --help
```

**高级帮助：**
```bash
<command> --help-all
man <command>
```

---

### 步骤 4：解析帮助文档

**提取以下信息：**

| 信息 | 说明 | 示例 |
|------|------|------|
| **用途** | 工具是做什么的 | "Summarize URLs or files" |
| **基本用法** | 命令格式 | `summarize [options] <input>` |
| **子命令** | 可用子命令 | `list`, `create`, `delete` |
| **常用参数** | 常用选项 | `--help`, `--version`, `--output` |
| **环境变量** | 配置变量 | `API_KEY`, `CONFIG_PATH` |

---

### 步骤 5：记录到 TOOLS.md

**添加到对应分类：**

```markdown
### [分类]

| 工具 | 用途 | 自学方法 | 状态 |
|------|------|---------|------|
| **name** | 描述 | `name --help` | ✅ 新增 |

**常用命令：**
```bash
name <subcommand> [options]  # 说明
```
```

---

### 步骤 6：执行任务

**使用刚学会的命令完成用户任务：**

```
用户：用 summarize 总结一下这个网页

AI：
1. 检查：which summarize → 未安装
2. 安装：brew install steipete/tap/summarize
3. 学习：summarize --help
4. 记录：添加到 TOOLS.md
5. 执行：summarize "https://example.com"
6. 交付：返回总结结果
```

---

### 步骤 7：总结学习

**向用户汇报：**

```markdown
## ✅ 学会了新工具：summarize

**用途：** 总结 URL、PDF、YouTube 视频

**安装方式：** `brew install steipete/tap/summarize`

**常用命令：**
```bash
summarize "URL"              # 总结网页
summarize "file.pdf"         # 总结 PDF
summarize "youtu.be/xxx"     # 总结 YouTube
```

**已记录到：** TOOLS.md

**总结结果：** [返回任务结果]
```

---

## 🛠️ 工具调用

### 执行 CLI 命令

```javascript
exec:
  command: "<command> --help"
  timeout: 30
```

### 写入文件

```javascript
edit:
  path: "/workspace/TOOLS.md"
  oldText: "[旧内容]"
  newText: "[新内容]"
```

### 发送消息

```javascript
message:
  to: "<userId>"
  message: "学会了新工具：..."
```

---

## 📝 使用示例

### 示例 1：学习 summarize

```
用户：用 summarize 总结一下这个网页 https://example.com

AI 执行：
1. exec: "which summarize"
   结果：未找到

2. exec: "brew install steipete/tap/summarize"
   结果：安装成功

3. exec: "summarize --help"
   结果：
   Usage: summarize [options] <input>
   Options:
     --length <short|medium|long>
     --model <model-name>
     --json

4. 记录到 TOOLS.md

5. exec: "summarize https://example.com --model google/gemini-3-flash-preview"
   结果：[总结内容]

6. 回复用户：
   ✅ 学会了 summarize 工具
   
   总结结果：
   [总结内容]
```

---

### 示例 2：学习 jq

```
用户：从这个 JSON 文件中提取所有活跃用户的名字

AI 执行：
1. exec: "which jq"
   结果：/usr/bin/jq (已安装)

2. exec: "jq --help"
   结果：
   Usage: jq [options] <filter> [file...]
   Options:
     -r, --raw-output
     -c, --compact-output
     -s, --slurp

3. 学习用法：
   - 提取字段：.key
   - 过滤：select(.active)
   - 组合：.[] | select(.active) | .name

4. exec: "cat users.json | jq '.[] | select(.active) | .name'"
   结果：["Alice", "Bob", "Charlie"]

5. 回复用户：
   活跃用户：Alice, Bob, Charlie
```

---

### 示例 3：学习 ffmpeg

```
用户：把这个视频转成 MP3

AI 执行：
1. exec: "which ffmpeg"
   结果：未找到

2. exec: "brew install ffmpeg"
   结果：安装成功

3. exec: "ffmpeg --help"
   结果：[大量输出]
   
   提取关键信息：
   - 输入：-i <file>
   - 禁用视频：-vn
   - 音频编解码器：-acodec

4. 学习提取音频：
   ffmpeg -i video.mp4 -vn -acodec libmp3lame output.mp3

5. exec: "ffmpeg -i video.mp4 -vn output.mp3"
   结果：转换成功

6. 回复用户：
   ✅ 已转换成 MP3：output.mp3
```

---

## ⚠️ 注意事项

### 1. 安全第一

**不要执行的命令：**
- ❌ `sudo` - 需要管理员权限
- ❌ `rm -rf /` - 危险操作
- ❌ 修改系统配置（需要用户确认）

### 2. 验证安装

**安装后必须验证：**
```bash
<command> --version
```

如果失败：
- 检查 PATH
- 检查依赖
- 询问用户

### 3. 记录学习

**每次学习后必须：**
1. 记录到 TOOLS.md
2. 告诉用户学会了什么
3. 说明常用命令

### 4. 成本考虑

**如果工具：**
- 需要付费 API → 告知用户
- 安装复杂 → 确认是否值得
- 使用频率低 → 建议替代方案

---

## 🎯 最佳实践

### 1. 先学后用

**错误：** 直接用，出错再查
**正确：** 先 `--help`，理解后再用

### 2. 记录常用命令

**错误：** 只记录基本用法
**正确：** 记录 3-5 个常用命令示例

### 3. 分类整理

**错误：** 所有工具混在一起
**正确：** 按功能分类（版本控制、系统工具、媒体工具等）

### 4. 定期复习

**错误：** 学过就忘
**正确：** 定期回顾 TOOLS.md，加深记忆

---

## 🔗 相关技能

- **searxng** - 隐私搜索引擎（CLI 封装示例）
- **self-improving** - 从 CLI 学习中提取经验

---

_CLI 自学是 Agent 成长的核心能力。每学会一个 CLI，就多一种解决问题的能力。_ 🤘

**创建日期：** 2026-03-08  
**版本：** 1.0.0
