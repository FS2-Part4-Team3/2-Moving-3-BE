# version 1
# clear
# docker compose down
# docker container prune -f
# docker image prune -a -f
# docker compose up --build -d

#version 2
# clear

# echo "Checking for processes using port 80..."
# sudo lsof -i :80

# PORT_PIDS=$(sudo lsof -t -i:80)
# if [ ! -z "$PORT_PIDS" ]; then
#     echo "Found processes using port 80: $PORT_PIDS"
#     echo "Killing processes..."
#     for pid in $PORT_PIDS; do
#         echo "Killing process $pid"
#         sudo kill -9 $pid
#     done
#     sleep 2
    
#     REMAINING_PIDS=$(sudo lsof -t -i:80)
#     if [ ! -z "$REMAINING_PIDS" ]; then
#         echo "ERROR: Port 80 is still in use by processes: $REMAINING_PIDS"
#         exit 1
#     fi
# fi


# echo "Stopping running containers..."
# docker compose down

# echo "Removing unused containers..."
# docker container prune -f

# echo "Removing unused images..."
# docker image prune -a -f

# echo "Starting containers..."
# docker compose up --build -d

# echo "Server restart completed!"

# version 3
execute_with_timeout() {
    local cmd="$1"
    local timeout_duration="$2"
    local message="$3"
    
    echo "$message"
    
    timeout "$timeout_duration" bash -c "$cmd"
    local status=$?
    
    if [ $status -eq 124 ]; then
        echo "WARNING: Command timed out after ${timeout_duration} seconds: $cmd"
        return 1
    elif [ $status -ne 0 ]; then
        echo "WARNING: Command failed with status $status: $cmd"
        return 1
    fi
    
    return 0
}

check_and_clean_disk_space() {
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$AVAILABLE_SPACE" -gt 85 ]; then
        echo "Warning: Low disk space detected (${AVAILABLE_SPACE}% used)"
        echo "Performing docker system cleanup..."

        execute_with_timeout "docker stop \$(docker ps -q)" "30" "Stopping all containers..." || {
            echo "Forcing container stops..."
            docker kill $(docker ps -q) 2>/dev/null || true
        }
        
        execute_with_timeout "docker rm \$(docker ps -a -q)" "30" "Removing all containers..." || {
            echo "Forcing container removal..."
            docker rm -f $(docker ps -a -q) 2>/dev/null || true
        }
        
        execute_with_timeout "docker rmi \$(docker images -q)" "60" "Removing all images..." || {
            echo "Forcing image removal..."
            docker rmi -f $(docker images -q) 2>/dev/null || true
        }
        
        execute_with_timeout "docker system prune -a --volumes -f" "120" "Performing deep clean of docker system..." || {
            echo "WARNING: Docker system prune timed out or failed"
            echo "Attempting alternative cleanup..."
            rm -rf /var/lib/docker/containers/* 2>/dev/null || true
            rm -rf /var/lib/docker/overlay2/* 2>/dev/null || true
            systemctl restart docker || true
        }
        
        echo "Waiting for Docker daemon to stabilize..."
        sleep 5
        
        echo "Current disk usage:"
        df -hT
        
        NEW_SPACE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
        if [ "$NEW_SPACE" -gt 85 ]; then
            echo "ERROR: Disk space is still critically low after cleanup (${NEW_SPACE}% used)"
            exit 1
        fi
        
        if ! docker info >/dev/null 2>&1; then
            echo "ERROR: Docker daemon is not responding after cleanup"
            echo "Attempting to restart Docker..."
            systemctl restart docker
            sleep 5
            if ! docker info >/dev/null 2>&1; then
                echo "ERROR: Docker daemon failed to recover"
                exit 1
            fi
        fi
        
        echo "Disk cleanup completed successfully"
    fi
}

clear

echo "Checking disk space..."
check_and_clean_disk_space

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
docker compose down || {
    echo "Warning: docker-compose down failed, attempting force stop..."
    docker-compose kill
}

echo "Removing unused containers..."
execute_with_timeout "docker container prune -f" "30" "Pruning containers..."

echo "Removing unused images..."
execute_with_timeout "docker image prune -a -f" "60" "Pruning images..."

echo "Checking disk space before build..."
check_and_clean_disk_space

echo "Starting containers..."
docker compose up --build -d

echo "Server restart completed!"