# build stage -> npm install and npm run dev

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# run stage -> npm start and next start
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]