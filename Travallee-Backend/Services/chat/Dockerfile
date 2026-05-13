FROM node:20-alpine

WORKDIR /app

COPY Services/chat/package.json .
COPY Packages ./Packages

RUN npm install

COPY Services/chat/src ./src
COPY Services/chat/tsconfig.json .

RUN npm run build

EXPOSE 6001

CMD ["npm", "start"]
