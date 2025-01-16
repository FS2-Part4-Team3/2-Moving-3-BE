# clear
# docker compose down
# docker container prune -f
# docker image prune -a -f
# docker compose up --build -d

clear

echo "Checking for processes using port 80..."
lsof -i :80
PORT_PROCESS=$(lsof -t -i:80)

if [ ! -z "$PORT_PROCESS" ]; then
    echo "Found processes using port 80: $PORT_PROCESS"
    echo "Attempting to kill processes..."
    for pid in $PORT_PROCESS; do
        echo "Killing process $pid"
        sudo kill -9 $pid
    done
    sleep 2
    
    REMAINING_PROCESS=$(lsof -t -i:80)
    if [ ! -z "$REMAINING_PROCESS" ]; then
        echo "Warning: Port 80 is still in use by processes: $REMAINING_PROCESS"
        echo "Please check manually with: sudo lsof -i :80"
        exit 1
    fi
else
    echo "No processes found using port 80"
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