# build stage -> npm install and npm run dev

FROM node:20-alpine AS builder

WORKDIR /app
# 🔑 Build-time env (THIS IS THE KEY FIX)
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

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