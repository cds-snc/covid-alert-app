BASE_DIR=`pwd -P`
SCRIPT=$BASE_DIR/scripts/adb-mon.sh
LOGFILE=$BASE_DIR/scripts/adb-mon.log
touch $LOGFILE

CRON="@hourly $SCRIPT >> $LOGFILE 2>&1"

echo $SCRIPT
echo "$CRON"

(crontab -l ; echo $CRON)| crontab -
