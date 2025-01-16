# clear
# docker compose down
# docker container prune -f
# docker image prune -a -f
# docker compose up --build -d

clear

echo "Checking for processes using port 80..."
sudo lsof -i :80

PORT_PIDS=$(sudo lsof -t -i:80)
if [ ! -z "$PORT_PIDS" ]; then
    echo "Found processes using port 80: $PORT_PIDS"
    echo "Killing processes..."
    for pid in $PORT_PIDS; do
        echo "Killing process $pid"
        sudo kill -9 $pid
    done
    sleep 2
    
    REMAINING_PIDS=$(sudo lsof -t -i:80)
    if [ ! -z "$REMAINING_PIDS" ]; then
        echo "ERROR: Port 80 is still in use by processes: $REMAINING_PIDS"
        exit 1
    fi
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