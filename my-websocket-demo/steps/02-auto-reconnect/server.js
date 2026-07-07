/**
 * Step 1 — 计数器 + 状态同步
 *
 * 新增知识点（对比 Step 0）：
 *   - 服务端定时推送（setInterval）
 *   - JSON 结构化消息（type + payload）
 *   - 连接时立即下发最新状态（断线续传的基础）
 *
 * 运行：node server.js
 * 然后用浏览器打开 index.html
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 服务器已启动，监听端口 8080');

// 模拟一个全局递增计数器
let globalCounter = 0;

// 每 2 秒给所有在线客户端推送最新计数
setInterval(() => {
    globalCounter++;
    const message = JSON.stringify({
        type: 'counter',
        payload: globalCounter,
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}, 2000);

wss.on('connection', (ws) => {
    console.log('✅ 新客户端连接');

    // 立即下发当前状态：即使客户端断线重连，也能"追上"最新计数
    ws.send(JSON.stringify({
        type: 'counter',
        payload: globalCounter,
    }));

    ws.on('message', (data) => {
        // 预留：后续步骤会在这里处理心跳回复
    });
});
