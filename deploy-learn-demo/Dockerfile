# ==================== 前端阶段 ====================
FROM nginx:alpine AS frontend
ARG ENV=dev

# 复制静态文件
COPY src/index.html /usr/share/nginx/html/index.html

# 根据环境复制 nginx 配置
COPY nginx/${ENV}.conf /etc/nginx/nginx.conf

EXPOSE 80
# Nginx 会自动启动，不需要额外 CMD

# ==================== 后端阶段 ====================
FROM node:18-alpine AS backend
WORKDIR /app
COPY src/api/hello.js .
EXPOSE 3000
CMD ["node", "hello.js"]