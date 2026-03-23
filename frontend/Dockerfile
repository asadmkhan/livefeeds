FROM node:20-alpine AS builder

WORKDIR /livefeeds-ui

COPY package*.json ./

ARG VITE_BACKEND_URL
ARG VITE_WS_URL

RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /livefeeds-ui/dist /usr/share/nginx/html


EXPOSE 80