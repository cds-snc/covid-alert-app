if [ $# -le 1 ]
  then
    echo "Not enough arguments. Please provide [APP_UUID] and [DEVICE_SERIAL]"
    exit -1
fi

echo "UUID: $1"
echo "SERIAL: $2"

BASE_DIR="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

SCRIPT=$BASE_DIR/adb-mon.sh
LOGFILE=$BASE_DIR/adb-mon.log
touch $LOGFILE

echo
echo "======= CURRENT CRONTAB ======="
echo "$(crontab -l)"
echo "======= CURRENT CRONTAB ======="
echo

CRON="0 * * * * $SCRIPT $@ >> $LOGFILE 2>&1"

echo
echo "Registering cron: $CRON"
echo

(crontab -l ; echo "$CRON")| crontab -
