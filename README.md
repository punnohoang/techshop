# Techshop

Project đã được tách rõ thành 2 phần:

- frontend: giao diện tĩnh
- backend: NestJS API

## Cấu trúc

- [frontend/public](frontend/public)
- [backend/src](backend/src)
- [backend/test](backend/test)

## Chạy backend

Vào thư mục backend rồi cài/chạy:

- npm install
- npm run start:dev

## Docker

`docker-compose.yml` để ở root là chuẩn vì nó điều phối nhiều service cùng lúc.

Hiện tại có 2 container:

- backend: NestJS API (port 3000)
- frontend: Nginx phục vụ static + proxy `/api/*` sang backend (port 8080)

Chạy:

- docker compose up --build

Mở ứng dụng tại:

- http://localhost:8080
# TechShop on GCP
