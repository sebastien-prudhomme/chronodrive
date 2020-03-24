FROM node:12.10.0

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libasound2 \
        libatk-bridge2.0-0 \
        libgtk-3-0 \
        libnss3 \
        libx11-xcb1 \
        libxss1 \
        libxtst6 && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src/ ./src/

USER node
CMD [ "node", "src/index.js" ]
