const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('你好！我是后端 API 返回的数据 🎉');
});
server.listen(3000, () => console.log('API running on 3000'));