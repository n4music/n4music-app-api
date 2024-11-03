# BASE IMAGE
FROM node:18.20.4-alpine3.20 as base

# MAINTAINER INFORMATION
LABEL maintainer_name="ybin.nguyen"
LABEL maintainer_email="nguyenybin2015@gmail.com"

# INSTALL GIT
RUN apk update && apk add git

# WORKING DIRECTORY
WORKDIR /app

# COPY PROJECT FILES
COPY . .

# RUN git init

# PULL GIT SUBMODULES
RUN git submodule update --init --recursive

# INSTALL DEPENDENCIES
RUN npm install --legacy-peer-deps

# EXPOSE PORT
EXPOSE 3000

# RUN APPLICATION
CMD ["/bin/sh", "run-container-dev.sh"]
