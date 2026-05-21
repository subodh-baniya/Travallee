FROM node:20-alpine
WORKDIR /app




# then install the packages in the Auth service
WORKDIR /app
COPY Travallee-Backend/Services/Auth/package.json Travallee-Backend/Services/Auth/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/Auth/ /app/


EXPOSE 3000
CMD ["npm", "run", "dev"]