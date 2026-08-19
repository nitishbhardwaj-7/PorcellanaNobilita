#!/bin/bash
set -e
cd /home/d10917/nobilita.adaptsmedia.info

export PATH=/home/d10917/nodevenv/nobilita.adaptsmedia.info/24/bin:/usr/local/bin:/usr/bin:$PATH
export NODE_ENV=production
export PORT=3001

echo "[$(date)] === deploy start ==="

git fetch origin main
git reset --hard origin/main

npm install --include=dev
npm run build

OLDPID=$(ps aux | grep '[n]ode server.js' | awk '{print $2}')
if [ -n "$OLDPID" ]; then
  echo "[$(date)] stopping old process: $OLDPID"
  kill -9 $OLDPID
  sleep 1
fi

mkdir -p logs
nohup node server.js >> logs/app.log 2>&1 < /dev/null &
disown

sleep 2
echo "[$(date)] === deploy done, new pid: $(ps aux | grep '[n]ode server.js' | awk '{print $2}') ==="
