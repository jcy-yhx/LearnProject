/**
 * Step 0 — 极简聊天室（广播）
 *
 * 知识点：
 *   - ws 库创建 WebSocket 服务器
 *   - connection / message 事件
 *   - 遍历 wss.clients 实现广播
 *   - 检查 readyState 避免给断开的连接发消息
 *
 * 运行：node server.js
 * 然后用浏览器打开 index.html（可直接双击打开文件）
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 WebSocket 服务器已启动，地址: ws://localhost:8080');

wss.on('connection', function connection(ws) {
    console.log('✅ 一个新客户端连接了');

    // 欢迎消息
    ws.send('👋 欢迎来到聊天室！');

    // 收到消息 → 广播给所有其他客户端
    ws.on('message', function incoming(message) {
        const msgStr = message.toString();
        console.log('收到消息:', msgStr);

        wss.clients.forEach(function each(client) {
            // 不发给发送者自己，且只发给依然保持连接的客户端
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send('💬 ' + msgStr);
            }
        });
    });
});
