#!/usr/bin/env bash

#
# Setup .env and .env.production
#
dotenv=./.env
touch $dotenv

echo "APP_ID_IOS=$APP_ID_IOS" >> $dotenv
echo "APP_ID_ANDROID=$APP_ID_ANDROID" >> $dotenv
echo "APP_VERSION_NAME=$APP_VERSION_NAME" >> $dotenv
echo "APP_VERSION_CODE=$APP_VERSION_CODE" >> $dotenv

echo "SUBMIT_URL=$SUBMIT_URL" >> $dotenv
echo "RETRIEVE_URL=$RETRIEVE_URL" >> $dotenv

echo "HMAC_KEY=$HMAC_KEY" >> $dotenv

echo "TEST_MODE=$TEST_MODE" >> $dotenv
echo "MOCK_SERVER=$MOCK_SERVER" >> $dotenv

echo "MCC_CODE=$MCC_CODE" >> $dotenv
echo "MINIMUM_FETCH_INTERVAL=$MINIMUM_FETCH_INTERVAL" >> $dotenv

cp $dotenv .env.production

#
# Setup keystore.properties
#
keystorep=./android/keystore.properties
touch $keystorep

echo "STOPCOVID_UPLOAD_STORE_FILE=$STOPCOVID_UPLOAD_STORE_FILE" >> $keystorep
echo "STOPCOVID_UPLOAD_KEY_ALIAS=$STOPCOVID_UPLOAD_KEY_ALIAS" >> $keystorep
echo "STOPCOVID_UPLOAD_STORE_PASSWORD=$STOPCOVID_UPLOAD_STORE_PASSWORD" >> $keystorep
echo "STOPCOVID_UPLOAD_KEY_PASSWORD=$STOPCOVID_UPLOAD_KEY_PASSWORD" >> $keystorep
