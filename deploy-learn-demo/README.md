# Docker + Nginx 部署学习项目

一个用于学习 Docker、Nginx 和现代部署流程的极简项目。

## 项目介绍

这是一个**极简的前后端分离项目**，用于帮助我系统学习容器化和部署相关知识。

| 层级       | 技术                        |
| ---------- | --------------------------- |
| 前端       | 静态 HTML + JavaScript      |
| 后端       | Node.js 简单 API            |
| 容器化     | Docker + Docker Compose     |
| 反向代理   | Nginx                       |
| 多环境支持 | 开发环境 / 生产环境         |

---

## 项目结构

```
my-deploy-demo/
├── src/                    # 源代码
│   ├── index.html
│   └── api/
│       └── hello.js
├── nginx/
│   ├── dev.conf            # 开发环境 Nginx 配置
│   └── prod.conf           # 生产环境 Nginx 配置
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env
└── README.md
```

---

## 本地运行

```bash
# 1. 克隆项目
git clone <你的仓库地址>

# 2. 进入目录
cd my-deploy-demo

# 3. 开发环境启动
docker compose up --build
# 访问：http://localhost:8080

# 4. 生产环境启动
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

---

## 我学到的内容

### 基础部分

- Docker 基础概念（镜像、容器、Dockerfile）
- Docker Compose 多容器编排
- Nginx 基础配置（静态文件服务、反向代理）
- 端口映射与容器间通信
- 多阶段构建（Multi-stage Build）

### 进阶部分

- 多环境配置（Development / Production）
- 使用环境变量管理配置
- Dockerfile 优化与 ARG 参数传递
- Nginx 配置拆分与优化（gzip、proxy headers）

---

## 学习路线图

### 已完成

- [x] Docker + Nginx 基础部署
- [x] 多环境配置

### 接下来计划学习

- [ ] 部署到云平台（Railway / Render）
- [ ] HTTPS 配置（Let's Encrypt + Certbot）
- [ ] 绑定自定义域名
- [ ] CI/CD（GitHub Actions 自动构建部署）
- [ ] 日志管理与监控
- [ ] 数据库集成（PostgreSQL / MySQL）
- [ ] 使用 Caddy 替代 Nginx（自动 HTTPS）
- [ ] 容器编排进阶（Kubernetes 基础概念）
- [ ] 性能优化、安全加固

---

## 技术栈

- **Docker / Docker Compose** — 容器化与编排
- **Nginx** — 反向代理与静态文件服务
- **Node.js** — 后端 API
- **现代部署理念** — 多环境、CI/CD、HTTPS
