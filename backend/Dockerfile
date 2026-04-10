# 1. Base image là gì?
FROM node:20-alpine

# 2. Thư mục làm việc
WORKDIR /app

# 3. Copy file gì trước?
COPY package*.json ./

# 4. Cài dependencies
RUN npm install

# 5. Copy toàn bộ code
COPY . .

# 6. Build app
RUN npm run build

# 7. Mở port
EXPOSE 3000

# 8. Chạy app
CMD ["node", "dist/main"]