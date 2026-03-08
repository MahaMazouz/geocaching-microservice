# docker-compose check
command -v docker-compose >/dev/null && echo "[req]: docker-compose is installed" || echo "[req]: docker-compose is required, but not found"; exit 1

# ---- cleaning up ----
echo "[clean-up]: removing exited containers"
docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm

# ---- setting mount directories ----
[ ! -d  ./data/master ] && mkdir -vp ./data/master && echo "[data]: master data directory created" || echo "[data]: master data directory exists" 
[ ! -d  ./data/slave ] && mkdir -vp ./data/slave && echo "[data]: slave data directory created" || echo "[data]: slave data directory exists"
chown -R nobody:nogroup ./data &&  echo "[data]: public ownorship of data directories set" || echo "[data]: public ownorship of data directories failed"; exit 2
chmod -R 777 ./data &&  echo "[data]: public access of data directories set" || echo "[data]: public access of data directories failed"; exit 3

echo "[itninja-hue]: to cleanup data directories run sh cleanup.sh -h"
echo "[itninja-hue]: run docker-compose up to provision redis replication cluster, Happy coding!"
