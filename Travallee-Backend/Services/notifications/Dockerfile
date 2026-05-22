FROM node:20-alpine
WORKDIR /app





# then install the packages in the notifications service
WORKDIR /app
COPY Travallee-Backend/Services/notifications/package.json Travallee-Backend/Services/notifications/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/notifications/ /app/


EXPOSE 6000

CMD ["npm", "run", "dev"]