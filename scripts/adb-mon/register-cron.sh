#if [ $# -le 1 ]
#  then
#    echo "Not enough arguments. Please provide [APP_UUID] and [DEVICE_SERIAL]"
#    exit -1
#fi
BASE_DIR="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

SCRIPT=$BASE_DIR/adb-mon.sh
LOGFILE=$BASE_DIR/adb-mon.log
touch $LOGFILE

echo
echo "Below is your current crontab. If you have run this command multiple times,"
echo "you will have multiple entries registered. This script does not handle cleanup"
echo "of old entries. To clean up your crontab, run 'crontab -e'"
echo
echo "======= CURRENT CRONTAB ======="
echo "$(crontab -l)"
echo "======= CURRENT CRONTAB ======="
echo

declare -a deviceArray=(`adb devices -l | grep -v emulator | grep -v vbox | grep " device " | awk '{print $1}'`)

echo "found ${#deviceArray[@]} device(s)"

for index in ${!deviceArray[*]}; do
  DEVICE_ID=${deviceArray[index]}
  read -p "Enter device APP_UUID for device $DEVICE_ID: " APP_UUID
  CRON="0 * * * * $SCRIPT $APP_UUID $DEVICE_ID >> $LOGFILE 2>&1"
  echo
  echo "Registering cron: $CRON"
  echo
  (crontab -l ; echo "$CRON")| crontab -
done

echo "======= NEW CRONTAB ======="
echo "$(crontab -l)"
echo "======= NEW CRONTAB ======="
