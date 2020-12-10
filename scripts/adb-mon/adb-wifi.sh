#!/bin/bash

######
# Android wireless debugging via wifi
# Usage: 1. Connect your device via USB
#        2. run this script
#        3. there you go
######

#You usually wouldn't have to modify this
PORT_BASE=5555

function is_ip()
{
    if [[ "$1" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}$ ]]; then
        return 0
    else
        return 1
    fi
}

function timeout() { perl -e 'alarm shift; exec @ARGV' "$@"; }

function debug_via_wifi() {
    #List the devices on the screen for your viewing pleasure
    adb devices
    echo

    #Find USB devices only (no emulators, genymotion or connected devices
    declare -a deviceArray=(`adb devices -l | grep -v emulator | grep -v vbox | grep " device " | awk '{print $1}'`)

    echo "found ${#deviceArray[@]} device(s)"
    echo

    for index in ${!deviceArray[*]}
    do
        is_ip ${deviceArray[index]}
        if [[ $? -eq 0 ]]; then
            echo "device ${deviceArray[index]} is already connected via wifi, skipped"
            continue
        fi
        echo "finding IP address for device ${deviceArray[index]}"
        IP_ADDRESS=$(adb -s ${deviceArray[index]} shell ip route | awk '{print $9}')

        echo "IP address found : $IP_ADDRESS "

        echo "Connecting..."
        timeout 5 adb -s ${deviceArray[index]} tcpip $(($PORT_BASE + $index))
        if [[ $? -ne 0 ]]; then
            echo "Fail to invoke tcpip on device ${deviceArray[index]}, skipped"
            continue
        fi
        timeout 5 adb -s ${deviceArray[index]} connect "$IP_ADDRESS:$(($PORT_BASE + $index))"
        if [[ $? -ne 0 ]]; then
            echo "Fail to invoke connect on device ${deviceArray[index]}, skipped"
            continue
        fi
        echo
        echo
    done

    adb devices -l
    #exit
}

if [[ $1 == "clear" ]]; then
    echo "resume to debug via USB"
    adb kill-server
else
    debug_via_wifi
fi
