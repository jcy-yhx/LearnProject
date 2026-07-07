/**
 * Step 2 — 心跳探测 + 自动重连 + 断线续传
 *
 * 新增知识点（对比 Step 1）：
 *   - ws.ping() 发送协议层 Ping 帧（浏览器自动回复 Pong）
 *   - ws.isAlive 标记模式：先假定"死了"，收到 pong 再翻盘
 *   - ws.terminate() 强制踢掉僵尸连接
 *   - 服务器关闭时清理定时器
 *
 * 运行：node server.js
 * 然后用浏览器打开 index.html
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 服务器已启动（带心跳检测）');

// ==================== 配置 ====================
const HEARTBEAT_INTERVAL = 5000;   // 每 5 秒探测一次
const HEARTBEAT_TIMEOUT = 10000;   // 允许客户端 10 秒不回复则判定死亡
let globalCounter = 0;

// ==================== 定时推送计数器 ====================

setInterval(() => {
    globalCounter++;
    const msg = JSON.stringify({ type: 'counter', payload: globalCounter });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}, 2000);

// ==================== 连接处理 ====================

wss.on('connection', (ws) => {
    console.log('✅ 新客户端连接');

    // 1. 初始化心跳标记
    ws.isAlive = true;

    // 2. 监听 Pong 回复（协议层自动回复，不需前端 JS 手动处理）
    ws.on('pong', () => {
        ws.isAlive = true;
        console.log('❤️  收到客户端 pong 回复');
    });

    // 3. 客户端主动断开时清理
    ws.on('close', () => {
        console.log('🔌 客户端主动断开');
    });

    // 4. 连接时立即下发当前状态（断线续传）
    ws.send(JSON.stringify({ type: 'counter', payload: globalCounter }));
});

// ==================== 心跳扫荡 ====================

const heartbeatTimer = setInterval(() => {
    wss.clients.forEach((ws) => {
        // 上一次心跳没回复 → 僵尸连接，强制断开
        if (ws.isAlive === false) {
            console.log('💀 检测到僵尸连接，强制断开');
            return ws.terminate();
        }

        // 先假定它死了，等 pong 来翻盘
        ws.isAlive = false;
        ws.ping();
    });
}, HEARTBEAT_INTERVAL);

// ==================== 清理 ====================

wss.on('close', () => {
    clearInterval(heartbeatTimer);
});
