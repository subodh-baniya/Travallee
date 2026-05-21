FROM node:20-slim
WORKDIR /app


COPY Travallee-Backend/Packages/ /app/Packages/


# then install the packages in the Chat service
WORKDIR /app
COPY Travallee-Backend/Services/chat/package.json Travallee-Backend/Services/chat/package-lock.json /app/
RUN npm install


COPY Travallee-Backend/Services/chat/ /app/

EXPOSE 6001

CMD ["npm", "run", "dev"]