#!/bin/bash
cd /home/d10917/nobilita.adaptsmedia.info || { echo "STEP:cd FAILED"; exit 1; }

export PATH=/home/d10917/nodevenv/nobilita.adaptsmedia.info/24/bin:/usr/local/bin:/usr/bin:$PATH
export NODE_ENV=production
export PORT=3001

echo "[$(date)] === deploy start ==="

echo "STEP:git-fetch"
git fetch origin main
echo "STEP:git-fetch exit=$?"

echo "STEP:git-reset"
git reset --hard origin/main
echo "STEP:git-reset exit=$?"

echo "STEP:npm-install"
npm install --include=dev --ignore-scripts
echo "STEP:npm-install exit=$?"

echo "STEP:npm-build"
npm run build
echo "STEP:npm-build exit=$?"

echo "STEP:restart"
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
