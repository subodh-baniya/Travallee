FROM node:20-slim
WORKDIR /app

COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Hotel service
WORKDIR /app
COPY Travallee-Backend/Services/Hotel/package.json Travallee-Backend/Services/Hotel/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/Hotel/ /app/


EXPOSE 3001
CMD ["npm", "run", "dev"]