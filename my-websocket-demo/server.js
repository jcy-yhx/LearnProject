/**
 * 最新版 —— 心跳探测 + 自动重连 + 断线续传
 *
 * 对应 steps/03-heartbeat/，是当前项目的最新进度。
 *
 * 运行：node server.js
 * 然后用浏览器打开 index.html
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 服务器已启动（带心跳检测），地址: ws://localhost:8080');

const HEARTBEAT_INTERVAL = 5000;
let globalCounter = 0;

// 每 2 秒推送计数器
setInterval(() => {
    globalCounter++;
    const msg = JSON.stringify({ type: 'counter', payload: globalCounter });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}, 2000);

// 连接处理
wss.on('connection', (ws) => {
    console.log('✅ 新客户端连接');

    // 心跳标记
    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
        console.log('❤️  收到 pong');
    });

    ws.on('close', () => {
        console.log('🔌 客户端断开');
    });

    // 断线续传：立即下发当前状态
    ws.send(JSON.stringify({ type: 'counter', payload: globalCounter }));
});

// 心跳扫荡
const heartbeatTimer = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            console.log('💀 僵尸连接，强制断开');
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => clearInterval(heartbeatTimer));
