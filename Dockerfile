FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
# RUN npx prisma generate
RUN npm run build

FROM node:22 AS deploy
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/package*.json /app/
RUN npm install --omit=dev
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/main"]
