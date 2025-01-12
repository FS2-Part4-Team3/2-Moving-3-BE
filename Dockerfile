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
EXPOSE 3000
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh
CMD ["/app/docker-entrypoint.sh"]