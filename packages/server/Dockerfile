FROM node:14
WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

RUN npm i

COPY . .

RUN npm run build
COPY .env ./dist/
WORKDIR /usr/app/dist/

EXPOSE 4001
CMD [ "npm", "start" ]
