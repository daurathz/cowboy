#!/bin/bash
# Memory Check Script
# 每个工作日早晨检查 memory 使用情况，需要时发送提醒

MEMORY_DIR="/home/admin/.openclaw/workspace/memory"
ARCHIVE_DIR="/home/admin/.openclaw/workspace/memory/archive"
DAYS_OLD=7

# 计算 7 天前的文件数量
OLD_FILES=$(find "$MEMORY_DIR" -maxdepth 1 -name "*.md" -type f -mtime +$DAYS_OLD 2>/dev/null | wc -l)

# 计算 memory 目录总大小
MEMORY_SIZE=$(du -sh "$MEMORY_DIR" 2>/dev/null | cut -f1)

# 计算归档目录大小
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_DIR" 2>/dev/null | cut -f1 || echo "0")

# 如果需要整理（有 7 天前的文件）
if [ "$OLD_FILES" -gt 0 ]; then
    echo "发现 $OLD_FILES 个文件需要归档"
    echo "Memory 目录大小：$MEMORY_SIZE"
    echo "归档目录大小：$ARCHIVE_SIZE"
    
    # 发送提醒到 Slack
    # 使用 openclaw message 命令
    /home/admin/.local/share/pnpm/global/5/.pnpm/openclaw@2026.3.2_@napi-rs+canvas@0.1.95_@types+express@5.0.6_hono@4.12.4_node-llama-cpp@3.16.2/node_modules/openclaw/bin/openclaw.js message send \
        --target "U05AN0GGM3M" \
        --message "🤘 Memory 整理提醒：
        
发现 $OLD_FILES 个日志文件超过 7 天，建议整理：
- Memory 目录：$MEMORY_SIZE
- 归档目录：$ARCHIVE_SIZE

运行 \`./scripts/archive-memory.sh\` 自动归档，或让我帮你整理～"
    
    exit 1
else
    echo "Memory 状态良好，无需整理"
    echo "Memory 目录大小：$MEMORY_SIZE"
    echo "归档目录大小：$ARCHIVE_SIZE"
    exit 0
fi
