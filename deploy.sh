# Pull latest changes
echo Pulling latests changes...
git pull

# Pull latest docker images
echo Pulling latest images...
docker compose pull

# Rebuild and deploy new containers
docker compose up -d --build

# Cleanup
echo Cleaning up unused containers...
docker image prune -f
docker container prune -f

# Complete
echo Deployment completed sucessfully
