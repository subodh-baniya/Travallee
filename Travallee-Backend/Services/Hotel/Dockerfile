FROM node:20-slim
WORKDIR /app


# first install the packages in the root directory
COPY Travallee-Backend/Packages/package.json Travallee-Backend/Packages/package-lock.json /app/Packages/
WORKDIR /app/Packages
RUN npm install


COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Hotel service
WORKDIR /app
COPY Travallee-Backend/Services/Hotel/package.json Travallee-Backend/Services/Hotel/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/Hotel/ /app/


EXPOSE 3001
CMD ["npm", "run", "dev"]