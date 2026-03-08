command -v docker-compose >/dev/null && echo "[req]: docker-compose is installed" || echo "[req]: docker-compose is required, but not found"; exit 1
docker image prune -f && echo "[docker]: dangling images deleted" || echo "[docker]: dangling images error"
docker-compose down && echo "[docker-compose]: cleanup complete" || echo "[docker-compose]: cleanup error"; exit 1

# ---- purge persistent data ----
echo "[data]: deleting data directory"
while [ "$1" != "" ] 
do
    case $1 in
        -h | --hard)
            rm -rf ./data && echo "[data]: data directory deleted" || echo "[data]: data directory error"; exit 2
            exit
        ;;
        *)
            echo "[Error]: Invalid argument"
            exit
        ;;
    esac
done