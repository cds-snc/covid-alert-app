#!/bin/bash

## Filename : adb-mon
## Authors: Andréas Kaytar-LeFrançois, 
## Compatibility: MacOSX 10.15.7+, adb 30+
## Description: script to log Power Monitor service info on Android device
## Inteded audience: devs testing on android


# POLL DEVICE
ADBStandByBuckets=$( adb shell am get-standby-bucket 2>&1);

if `grep -q 'error' <<< "$ADBStandByBuckets"`; then 
	echo "Could not connect to adb, exiting..."
	exit -1;
else
  echo "adb connection established..."
  ADBStandByBuckets=$( echo "$ADBStandByBuckets" | grep covid );
fi


####
# Now read and export the vars from .env into the shell:
## LOAD Loggly URL from global .env
export $(egrep -v '^#' "$(dirname "$0")/../../.env" | xargs) # v is invert match mode, add s to silence
LOGGLY_URL="$LOGGLY_URL";

#### ASSOCIATE LOGS WITH DEVICE UUID
read -p "Enter device  UUID (found in the debug menu of the app): " DEVICE_UUID

if [ -z "$DEVICE_UUID" ] ; then
  echo "No UUID, exiting."
  exit -1;
else 
  DEVICE_UUID=`echo "$DEVICE_UUID" | awk '{print toupper($0)}'` # format UUID to all caps
fi

####
# CONNECT TO ADB OVER WIFI?
# echo "Sending logs..."
#DEVICE_IP=0.0.0.0; #can be set manually

# Dump all scheduled jobs, then filter 
JobSchedulerLogs=`adb shell dumpsys jobscheduler | grep -A 20 "JOB" | grep -A 20 ca.gc.hcsc.canada.covidalert`;

JSONlogData=$( jq -n \
  --arg u "$USER" \
  --arg uuid "$DEVICE_UUID" \
  --arg stbyBkt "$ADBStandByBuckets" \
  --arg schdJbs "$JobSchedulerLogs" \
  '{user: $u, UUID: $uuid, standbyBucket: $stbyBkt, scheduledJobs: $schdJbs}' );


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
# else
    # echo "Sent to server! Answer: $http_response";  
fi
}

exit;