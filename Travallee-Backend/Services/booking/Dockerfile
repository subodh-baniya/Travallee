FROM node:20-slim
WORKDIR /app


# first install the packages in the root directory
COPY Travallee-Backend/Packages/package.json Travallee-Backend/Packages/package-lock.json /app/Packages/
WORKDIR /app/Packages
RUN npm install


COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Booking service
WORKDIR /app
COPY Travallee-Backend/Services/booking/package.json Travallee-Backend/Services/booking/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/booking/ /app/


EXPOSE 5002
CMD ["npm", "run", "dev"]