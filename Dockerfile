# CÀI ĐẶT PACKAGE
FROM node:18.20.4-alpine3.20 as nodemodule
WORKDIR /app

# Install git
RUN apk update && apk add git

# Copy package files
COPY package.json package-lock.json ./

# GIT INIT
RUN git init

# PULL GIT SUBMODULES, LƯU Ý CÁI NÀY QUAN TRỌNG
RUN git submodule update --init --recursive

WORKDIR /app
RUN npm install --legacy-peer-deps

# BUILD CODE
FROM node:18.20.4-alpine3.20 as builder
WORKDIR /app
# Copy all project files from the current directory
COPY . .
COPY --from=nodemodule /app/node_modules ./node_modules
# Build the code
RUN npm run build

# RUNNER STAGE
FROM node:18.20.4-alpine3.20 as runner
WORKDIR /app

# THÔNG TIN NGƯỜI VIẾT
LABEL maintainer_name="ybin.nguyen"
LABEL maintainer_email="nguyenybin2015@gmail.com"

# CÀI ĐẶT MÚI GIỜ
ARG DEBIAN_FRONTEND=noninteractive
RUN apk update && apk add tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/ecdsa.key ./keys/ecdsa.key
COPY --from=builder /app/ecdsa.pub ./keys/ecdsa.pub
COPY --from=builder /app/.env ./.env 
COPY --from=builder /app/run-container.sh ./run-container.sh
RUN  chmod +x ./run-container.sh 
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=nodemodule /app/node_modules ./node_modules

EXPOSE 3000

CMD ["/bin/sh", "run-container.sh"]
