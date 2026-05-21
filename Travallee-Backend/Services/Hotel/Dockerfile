FROM node:20-alpine
WORKDIR /app



# then install the packages in the Hotel service
WORKDIR /app
COPY Travallee-Backend/Services/Hotel/package.json Travallee-Backend/Services/Hotel/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/Hotel/ /app/


EXPOSE 3001
CMD ["npm", "run", "dev"]