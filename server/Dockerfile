# 노드기반
FROM node:14.15.3

WORKDIR /app

COPY package.json .

RUN npm install

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npm", "start" ]

COPY . .