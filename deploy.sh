#!/bin/sh
# Get lastest changes
git pull

# Make shell scripts executable
chmod +x jobs/*.sh

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
