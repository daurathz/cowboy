# 通知技能 (Notify Skill)

> 📬 通过钉钉发送通知给同事

## 能力

- 发送文本消息给指定 userId
- 发送文件、图片
- 群发消息给多人
- 支持 Markdown 格式

## 使用方法

```
通知 102 明天开会
给 102 发消息：请把文件发我
提醒 102,195 下午 3 点会议室 A 集合
```

## 配置

用户映射表：`/home/admin/.openclaw/workspace/dingtalk-contacts.json`

## 权限

- 需要知道目标 userId
- 只能发送给已验证的用户
- 重要通知需要确认

## 状态

✅ 已上线 (2026-03-07)
