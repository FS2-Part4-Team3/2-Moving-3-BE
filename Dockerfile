FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN ls
RUN cat prisma/schema.prisma
RUN npx prisma generate
RUN npx prisma migrate production
COPY . .
RUN npm run build

FROM node:22
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/main"]
