FROM node:20-slim
WORKDIR /app


# first install the packages in the root directory
COPY Travallee-Backend/Packages/package.json Travallee-Backend/Packages/package-lock.json /app/Packages/
COPY Travallee-Backend/Packages/.env /app/.env
WORKDIR /app/Packages
RUN npm install


COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Auth service
WORKDIR /app
COPY Travallee-Backend/Services/Auth/package.json Travallee-Backend/Services/Auth/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/Auth/ /app/


EXPOSE 3000
CMD ["npm", "run", "dev"]