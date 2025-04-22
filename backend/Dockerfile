FROM node:lts-alpine3.17

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run db:deploy && npm run dev:nodemon"]