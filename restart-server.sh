docker compose down
docker container prune -f
docker image prune -a -f
docker compose up --build -d