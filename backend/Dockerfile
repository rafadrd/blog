FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
