#!/bin/bash

# Parse JAWSDB_URL Env
url=$JAWSDB_URL
no_prot="${url/mysql:\/\//}"

IFS="@"
read -a strarr <<< "$no_prot"
u_and_p="${strarr[0]}"
host_and_db="${strarr[1]}"

IFS="/"
read -a strarr <<< "$host_and_db"
host_and_port="${strarr[0]}"
database="${strarr[1]}"

IFS=":"
read -a strarr <<< "$host_and_port"
host="${strarr[0]}"

db="${u_and_p}@tcp(${host})/${database}"

DATABASE_URL=$db PORT=$PORT /usr/local/bin/server --config_file_path ./