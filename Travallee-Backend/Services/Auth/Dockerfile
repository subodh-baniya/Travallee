FROM node:20-alpine

WORKDIR /app

# copy only from current context (Auth folder)
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]