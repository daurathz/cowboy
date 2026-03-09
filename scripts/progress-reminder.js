#!/usr/bin/env node

/**
 * 进度同步提醒器
 * 每 10 分钟发送一次进度同步提醒到 Slack
 */

const { execSync } = require('child_process');
const path = require('path');

const INTERVAL_MS = 10 * 60 * 1000; // 10 分钟
const MAX_ITERATIONS = 12; // 2 小时

console.log(`🚀 进度提醒器启动 - 每 10 分钟同步一次`);
console.log(`📍 工作目录：${process.cwd()}`);

let iteration = 0;

function sendReminder() {
  iteration++;
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  console.log(`\n⏰ [${now}] 第 ${iteration} 次同步时间到`);
  
  // 写入一个标记文件，让主 session 可以读取
  const fs = require('fs');
  const reminderPath = path.join(__dirname, '../.progress-reminder-flag');
  fs.writeFileSync(reminderPath, JSON.stringify({
    type: 'progress-sync',
    time: now,
    iteration: iteration,
    message: '⏰ 10 分钟进度同步时间到 - 销售助理系统'
  }));
  
  console.log(`✅ 提醒标记已写入：${reminderPath}`);
  
  if (iteration >= MAX_ITERATIONS) {
    console.log('\n✅ 达到最大迭代次数，提醒器退出');
    process.exit(0);
  }
}

// 立即执行一次
sendReminder();

// 然后每 10 分钟执行
const timer = setInterval(sendReminder, INTERVAL_MS);

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n👋 提醒器被中断');
  clearInterval(timer);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 提醒器被终止');
  clearInterval(timer);
  process.exit(0);
});
