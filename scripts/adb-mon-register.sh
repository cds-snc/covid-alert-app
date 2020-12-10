BASE_DIR="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
SCRIPT=$BASE_DIR/adb-mon.sh
LOGFILE=$BASE_DIR/adb-mon.log
touch $LOGFILE

CRON="0 * * * * $SCRIPT >> $LOGFILE 2>&1"

echo $SCRIPT
echo "$CRON"

(crontab -l ; echo "$CRON")| crontab -
