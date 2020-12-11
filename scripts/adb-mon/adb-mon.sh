#!/bin/bash
export PATH=$PATH:/usr/local/bin/:/$HOME/Library/Android/sdk/platform-tools

## Filename : adb-mon
## Authors: Andréas Kaytar-LeFrançois,
## Collaborators: Dave Samojlenko, James Eberhardt
## Compatibility: MacOSX 10.15.7+, adb 30+
## Description: script to log Power Monitor service info on Android device
## Intended audience: devs testing on android
## Usage: to be called by a scheduler every hour
## Parameters: ['APP_UUID'] ['DEVICE_SERIAL']

LOCAL_TIME=$(date +"%_d %b %Y %R %Z")
printf "\nStart of adb-mon at $LOCAL_TIME...\n"

# POLL DEVICES
# possible bucket values are:
# 5: exempt
# 10: active
# 20: working-set
# 30: frequent
# 40: rare
ADBStandByBuckets=$( adb shell am get-standby-bucket 2>&1 );
DEVICES=$( adb devices 2>&1 );

## ERROR CHECKING
if `grep -q 'command not found' <<< "$DEVICES"`; then
  echo "Could not find adb executable, exiting..."
  exit -1;
elif `grep -q 'no devices' <<< "$ADBStandByBuckets"`; then
  echo "Could not find devices, exiting..."
  exit -1;
fi
#elif `grep -q 'more than one' <<< "$ADBStandByBuckets"`; then
  ## MULTIPLE DEVICES VALIDATION
#  if [ $# -eq 0 ]; then
#    echo "Missing parameters to differentiate multiple devices, exiting..."
#    exit -1;
#  elif [ $# -lt 2 ]; then
#    echo "Please use format './adb-mon [APP_UUID] [DEVICE_SERIAL]', exiting..."
#    exit -1;
#  elif [[ "$2" =~ [^a-zA-Z0-9] ]]; then
#    echo "Format of provided serial is not alphanumeric as expected, exiting..."
#    exit -1;
#  elif `! grep -q "$2" <<< "$DEVICES"`; then
#    echo "Could not match provided serial to local device, exiting..."
#    exit -1;
#  else
    DEVICE_SERIAL="$2"
    SERIAL_STR="-s $DEVICE_SERIAL"
 # fi

#if `grep -q 'error' <<< "$ADBStandByBuckets"` || `grep -q 'error' <<< "$DEVICES"` ; then
#  echo "Could not connect to adb, exiting..."
#  exit -1;
#fi

#### ASSOCIATE LOGS WITH APP-generated UUID
#if [ $# -eq 0 ]; then
#  read -p "Enter device APP_UUID (found in the debug menu of the app): " APP_UUID
#else
  APP_UUID=$1
#fi

#if (( "${#APP_UUID}" != 8 )); then
#    echo "Provided APP_UUID is not 8 alphanumeric characters long, exiting..."
#    exit -1;
#fi

## POLL DEVICES
echo "adb connection established..."

####
# CONNECT TO ADB OVER WIFI?
# echo "Sending logs..."
#DEVICE_IP=0.0.0.0; #can be set manually

ADBStandByBuckets=`adb $SERIAL_STR shell am get-standby-bucket 2>&1 | grep covid`;

# Dump all scheduled jobs, then filter
JobSchedulerLogs=`adb $SERIAL_STR shell dumpsys jobscheduler | grep -A 20 "JOB" | grep -A 23 ca.gc.hcsc.canada.covidalert`;

# Empty string checking
if [ -z "$JobSchedulerLogs" ]; then
  echo "COVID Alert uninstalled from device, exiting."
  exit -1;
fi

####
# Now read and export the vars from .env into the shell:
## LOAD Loggly URL from global .env
BASE_DIR="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export $(egrep -v '^#' "$BASE_DIR/../../.env" | xargs) # v is invert match mode, add s to silence
LOGGLY_URL="$LOGGLY_URL";

# Empty string checking
if [ -z "$APP_UUID" ]; then
  echo "No APP_UUID, exiting."
  exit -1;
else
  APP_UUID=`echo "$APP_UUID" | awk '{print toupper($0)}'` # format APP_UUID to all caps
fi

JSONlogData=$( jq -n \
  --arg u "$USER" \
  --arg t "$LOCAL_TIME" \
  --arg uuid "$APP_UUID" \
  --arg serial "$DEVICE_SERIAL" \
  --arg stbyBkt "$ADBStandByBuckets" \
  --arg schdJbs "$JobSchedulerLogs" \
  '{user: $u, localTime: $t, uuid: $uuid, serial: $serial, standbyBucket: $stbyBkt, scheduledJobs: $schdJbs}' );


# POST THE LOGS
# curl options are VERY important here
curl -s -w "\n%{http_code}" -H "content-type:application/json" -d "$JSONlogData" $LOGGLY_URL | {
    read response
    read http_status
    http_response=`echo $response | jq '.response'`;

  # PARSE the RESPONSE
  if [ $http_status != "200" ]; then
    echo "Connection ERROR: $http_status";
    echo "Server Failure! Answer: $http_response";
    exit -1;
  else
      echo "adb-mon logs sent to server! Answer: $http_response";
fi
}

exit;
