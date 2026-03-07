#!/bin/bash
# Memory Archive Script
# 自动归档 7 天前的 memory 日志文件

MEMORY_DIR="/home/admin/.openclaw/workspace/memory"
ARCHIVE_DIR="/home/admin/.openclaw/workspace/memory/archive"
DAYS_OLD=7

# 创建归档目录（如果不存在）
mkdir -p "$ARCHIVE_DIR"

# 查找并移动 7 天前的 .md 文件
find "$MEMORY_DIR" -maxdepth 1 -name "*.md" -type f -mtime +$DAYS_OLD | while read file; do
    filename=$(basename "$file")
    echo "Archiving: $filename"
    mv "$file" "$ARCHIVE_DIR/"
done

# 可选：压缩归档文件
cd "$ARCHIVE_DIR" && tar -czf memory-archive-$(date +%Y%m%d).tar.gz *.md 2>/dev/null && rm -f *.md

echo "Memory archive completed at $(date)"
