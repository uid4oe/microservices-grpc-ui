FROM node:10 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run-script build

FROM nginx:alpine
WORKDIR /etc/nginx/conf.d
RUN rm -f default.conf
COPY ./nginx /etc/nginx/conf.d
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]