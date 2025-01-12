FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:22 AS deploy
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/package*.json /app/
RUN npm install --omit=dev
RUN npx prisma generate
RUN npx prisma migrate deploy
EXPOSE 3000
CMD ["nest", "start"]
# CMD ["node", "dist/main"]
