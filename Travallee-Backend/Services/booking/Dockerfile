FROM node:20-alpine
WORKDIR /app





# then install the packages in the Booking service
WORKDIR /app
COPY Travallee-Backend/Services/booking/package.json Travallee-Backend/Services/booking/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/booking/ /app/


EXPOSE 5002
CMD ["npm", "run", "dev"]