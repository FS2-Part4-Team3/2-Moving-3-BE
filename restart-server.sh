# clear
# docker compose down
# docker container prune -f
# docker image prune -a -f
# docker compose up --build -d

clear

echo "Checking for processes using port 80..."
if lsof -i :80 > /dev/null; then
    echo "Killing process on port 80..."
    sudo kill -9 $(lsof -t -i:80)
    sleep 2
fi

if lsof -i :80 > /dev/null; then
    echo "Port 80 is still in use. Please check manually with 'sudo lsof -i :80'"
    exit 1
fi


echo "Stopping running containers..."
docker compose down

echo "Removing unused containers..."
docker container prune -f

echo "Removing unused images..."
docker image prune -a -f

echo "Starting containers..."
docker compose up --build -d

echo "Server restart completed!"