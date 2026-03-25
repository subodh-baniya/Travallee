FROM node:20-slim
WORKDIR /app


# first install the packages in the root directory
COPY Travallee-Backend/Packages/package.json Travallee-Backend/Packages/package-lock.json /app/Packages/
WORKDIR /app/Packages
RUN npm install


COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Admin service
WORKDIR /app
COPY Travallee-Backend/Services/admin/package.json Travallee-Backend/Services/admin/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/admin/ /app/


EXPOSE 4001

CMD ["npm", "run", "dev"]