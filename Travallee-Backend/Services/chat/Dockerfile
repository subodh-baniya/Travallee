FROM node:20-slim
WORKDIR /app


# first install the packages in the root directory
COPY Travallee-Backend/Packages/package.json Travallee-Backend/Packages/package-lock.json /app/Packages/
COPY Travallee-Backend/Packages/.env /app/.env
WORKDIR /app/Packages
RUN npm install


COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Chat service
WORKDIR /app
COPY Travallee-Backend/Services/chat/package.json Travallee-Backend/Services/chat/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/chat/ /app/

EXPOSE 6001
CMD ["npm", "run", "dev"]