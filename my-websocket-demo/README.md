# WebSocket 渐进式学习项目

> **核心理念**：先造轮子，再用轮子——先手写底层机制，再学 Socket.IO 才能"秒懂"。

基于 `ws` 库，从零开始一步步构建一个健壮的 WebSocket 应用。

---

## 📂 项目结构

```
my-websocket-demo/
├── README.md
├── package.json
├── server.js          ← 当前最新版（可直接 npm start 运行）
├── index.html         ← 当前最新版前端
└── steps/
    ├── 01-chat-broadcast/     # 阶段 0：极简聊天室（Hello World）
    │   ├── server.js
    │   └── index.html
    ├── 02-auto-reconnect/     # 阶段 1：计数器 + 指数退避自动重连
    │   ├── server.js
    │   └── index.html
    └── 03-heartbeat/          # 阶段 2：心跳探测 + 僵尸连接清理 + 断线续传
        ├── server.js
        └── index.html
```

---

## 🚀 快速运行

```bash
# 安装依赖
npm install

# 运行最新版（心跳+重连）
npm start

# 或运行指定步骤
npm run step:chat       # Step 0：原始聊天室
npm run step:reconnect   # Step 1：自动重连
npm run step:heartbeat   # Step 2：心跳探测
```

然后浏览器打开对应步骤的 `index.html`。

---

## 📖 学习路线 & 进度

### 🥉 阶段一：工程健壮性（让程序"不出错"）

#### Step 0 — 极简聊天室（已完成 ✅）

[代码目录](steps/01-chat-broadcast/)

| 知识点 | 说明 |
|--------|------|
| `ws` 库基础 | `new WebSocket.Server()` 创建服务端 |
| 事件模型 | `connection` / `message` / `close` |
| 广播模式 | 遍历 `wss.clients` 逐条发送 |
| 连接状态检查 | `client.readyState === WebSocket.OPEN` |

**运行效果**：多人打开同一页面即可互相聊天。

---

#### Step 1 — 计数器 + 自动重连（已完成 ✅）

[代码目录](steps/02-auto-reconnect/)

| 新增知识点 | 说明 |
|------------|------|
| **结构化消息** | `{ type: 'counter', payload: n }` JSON 封装，为后续扩展打基础 |
| **定时推送** | 服务端 `setInterval` 每 2 秒推送全局计数 |
| **状态同步** | 客户端连接时，服务端立即下发最新值（断线续传的雏形） |
| **指数退避重连** | `onclose` → `setTimeout(delay, reconnect)`，delay = min(1s × 2^attempts, 30s) |
| **生命周期管理** | `onbeforeunload` 清理连接和定时器 |

**实验方式**：打开页面后关掉服务器 → 看到前端不断重试 → 重启服务器 → 前端自动连上且数字不间断。

---

#### Step 2 — 心跳探测 + 僵尸清理（已完成 ✅）

[代码目录](steps/03-heartbeat/)

| 新增知识点 | 说明 |
|------------|------|
| **协议层 Ping/Pong** | `ws.ping()` 发送协议帧，浏览器自动回复 Pong，无需前端写代码 |
| **isAlive 标记模式** | 先假定"死了"（`isAlive = false`），收到 pong 再翻盘 |
| **僵尸连接清理** | 每 5 秒扫荡 `isAlive === false` 的连接，`ws.terminate()` 强制断开 |
| **定时器清理** | 服务器 `close` 事件中 `clearInterval`，防止内存泄漏 |

**关键设计思路**：
```
服务器每 5 秒：
  ├── 遍历所有客户端
  │   ├── isAlive === false？→ terminate()（僵尸）
  │   └── isAlive === true ？→ isAlive = false，然后 ping()
  └── 客户端收到 ping → 自动回 pong → 服务器 pong 事件 → isAlive = true
```

**实验方式**：打开页面 → 观察控制台每 5 秒的 pong 日志 → 强制杀进程/断网 → 10 秒后服务端打印"僵尸连接"。

---

### ⏳ 阶段二：架构与扩展（待开始）

- [ ] Redis Pub/Sub 适配器 —— 跨进程广播
- [ ] JWT 认证 —— WebSocket 握手鉴权
- [ ] 消息确认 ACK —— 可靠投递

### ⏳ 阶段三：框架与抽象（待开始）

- [ ] Socket.IO 重构 —— 对比 `ws` 和 Socket.IO 的差异
- [ ] Rooms & Namespaces —— 私聊、房间匹配
- [ ] 接入 React / Vue

### ⏳ 阶段四：底层原理（待开始）

- [ ] WebSocket 协议帧抓包（opcode、FIN、MASK）
- [ ] 性能压测（autobahn / k6）
- [ ] 背压处理（Backpressure）

---

## 🎯 配套实战项目

| 阶段 | 项目 | 目标 | 状态 |
|------|------|------|------|
| Phase 1 | "不掉线"的计数器 | 心跳 + 重连 + 断点续传 | ✅ 已完成 |
| Phase 2 | "跨服"私聊 | 2 进程 + Redis 中转 | ⏳ 待开始 |
| Phase 3 | 简易匹配系统 | Socket.IO rooms | ⏳ 待开始 |

---

## 🛠 技术栈

- **后端**：Node.js + `ws`（v8.x）
- **前端**：原生 HTML/JS（无框架依赖）
- **协议**：RFC 6455 (WebSocket)

---

## 📝 学习笔记

### 为什么 Ping/Pong 不需要前端写代码？

WebSocket 协议规定：浏览器收到 Ping 帧后**必须**自动回复 Pong 帧。所以：

- 服务端 `ws.ping()` → 协议层 Ping 帧 → 浏览器自动回 Pong → 服务端 `pong` 事件触发
- 前端 **不需要**写 `ws.on('ping', ...)` 或任何心跳代码

这和应用层 JSON `{ type: 'ping' }` 不同——应用层心跳才需要前端手动回复。

### 指数退避为什么要有上限？

如果无限翻倍，`2^10 = 1024` 秒（≈17 分钟），用户体验太差。设上限 30 秒保证了最坏情况下也只需等半分钟。

### terminate() vs close()

- `ws.close()` —— 正常关闭，会触发 `close` 事件，双方挥手告别
- `ws.terminate()` —— 强行断开，不触发事件。用于清理僵尸连接时避免触发多余的 close 回调

---

## 🔗 参考资料

- [WebSocket RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)
- [ws 库文档](https://github.com/websockets/ws)
- [WebSocket 协议帧详解](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)
