# 夜安 (yean) - AI远程陪护Agent系统 Demo

这是一个面向异地子女的温暖AI陪护演示项目。使用4个专业Agent实时分析老人行为数据，提供异常检测、周报生成、紧急事件决策和自然语言对话功能。


## 快速启动

```bash
npm install
cp .env.local.example .env.local
# 在 .env.local 中填入你的 DASHSCOPE_API_KEY (从阿里云百炼平台获取)
npm run dev
```

## 获取 DashScope API Key

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 创建或使用已有工作空间
3. 在API-Keys管理页面创建新Key
4. 将Key填入 `.env.local` 中的 `VITE_DASHSCOPE_API_KEY`


## 4个AI Agent职责

1. **行为异常检测Agent** (`/api/agent/anomaly`)
   - 对比30天基线与今日数据
   - 输出结构化异常分析 + 温暖总结

2. **周报生成Agent** (`/api/agent/report`)
   - 将7天数据转化为有温度的周报
   - 包含评分、发现、建议和温暖结语

3. **紧急事件分级决策Agent** (`/api/agent/emergency`)
   - 使用Chain-of-Thought流式推理
   - 4级响应机制 (观察/预警/确认/紧急)

4. **自然语言陪护管家Agent** (`/api/agent/chat`)
   - 微信风格对话
   - 基于真实数据提供温暖回答 + 建议

## 项目结构

- `src/app/` - 主要页面 (Dashboard, Chat, Report, Emergency, Admin)
- `src/lib/` - 类型、Prompts、DashScope封装、Mock数据
- `src/components/` - 可复用UI组件 (BehaviorChart, AgentThinking等)
- API路由模拟了Next.js App Router结构 (使用Vite代理)

## 演示流程建议 (答辩用)

1. **首页** - 介绍产品愿景和架构
2. **Dashboard** - 切换正常/异常数据，触发异常分析Agent
3. **Chat页面** - 使用快捷问题，体验流式对话
4. **Report** - 生成周报，展示温暖输出
5. **Emergency** - 演示3个紧急场景，重点展示流式思考链 (Chain-of-Thought)
6. **Admin** - 查看模拟传感器数据和日志


本项目为演示Demo。

---

*Made with ❤️ for caring families. 夜安 - 让爱不孤单。*