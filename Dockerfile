FROM node:16
WORKDIR /app
COPY ./ .
RUN npm install
RUN npm run build
EXPOSE 3000
WORKDIR /app/.output
CMD node ./server/index.mjs
