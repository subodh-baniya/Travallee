FROM node:20-alpine
WORKDIR /app



# then install the packages in the Hotel service
WORKDIR /app
COPY Travallee-Backend/Services/payments/package.json Travallee-Backend/Services/payments/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/payments/ /app/


EXPOSE 8002
CMD ["npm", "run", "dev"]