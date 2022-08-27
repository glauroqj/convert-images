FROM node:18-alpine3.15

WORKDIR /app
ADD ./ /app

RUN npm install --unsafe-perm --force -g yarn && \
  chmod +x /usr/local/bin/yarn

RUN ls -lsa

ENTRYPOINT yarn && \
  yarn dev