#!/bin/sh
docker exec server sqlite3 src/db/database.db .dump | gzip -c > database.dump.gz
mv database.dump.gz ../../backups
cd ../../backups
mv database.dump.gz "$(date +%s)"_headcount_database.dump.gz

# TO UNZIP: zcat my_database.dump.gz
