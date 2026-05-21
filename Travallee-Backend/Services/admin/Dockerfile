FROM node:20-alpine
WORKDIR /app


# then install the packages in the Admin service
WORKDIR /app
COPY Travallee-Backend/Services/admin/package.json Travallee-Backend/Services/admin/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/admin/ /app/


EXPOSE 4001

CMD ["npm", "run", "dev"]