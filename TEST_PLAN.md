# COVID Shield Test Plan

This test plan shows how to test Exposure Notfications (EN) in different scenarios and environments.

- [Accessing EN framework on device](#accessing-en-framework-on-device)
- [Test exposed state on the same day without notification (as developer)](#test-exposed-state-on-the-same-day-without-notification-as-developer)
- [Test exposed state with notification (as end user)](#test-exposed-state-with-notification-as-end-user)

## Accessing EN framework on device

### Android

Device Settings > Google > COVID-19 Exposure Notifications

| ![image](https://user-images.githubusercontent.com/5274722/86290989-5c007100-bbbc-11ea-9088-a8f038513c37.png) | ![image](https://user-images.githubusercontent.com/5274722/86290997-5e62cb00-bbbc-11ea-89d3-85aff4b4c620.png) | ![image](https://user-images.githubusercontent.com/5274722/86291000-602c8e80-bbbc-11ea-9444-ef8a6c90b04e.png) |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |


## iOS

Device Settings > Privacy > Bluetooth > COVID-19 Exposure Logging

| ![image](https://user-images.githubusercontent.com/5274722/86291179-9e29b280-bbbc-11ea-9f10-3e05da5961cd.png) | ![image](https://user-images.githubusercontent.com/5274722/86291186-9ff37600-bbbc-11ea-9ba4-1602fcacbbd9.png) | ![image](https://user-images.githubusercontent.com/5274722/86291190-a1bd3980-bbbc-11ea-93cf-ff012155edb3.png) | ![image](https://user-images.githubusercontent.com/5274722/86291196-a41f9380-bbbc-11ea-9dc1-f9cccf444e73.png) |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |


## Test exposed state on the same day without notification (as developer)

This test could be applied for all environments: Android + Android, iOS + iOS, Android + iOS.

Note: Because the server doesn't return Temporary Exposure Keys (TEKs) for current date (https://github.com/CovidShield/server/blob/master/pkg/server/retrieve.go#L83), for this test to work, the server needs to remove that restriction. This is possible if you run server locally or modify production server.

1. Run server locally, set `SUBMIT_URL` and `RETRIEVE_URL` in `.env` accordingly.
1. Build and run the app on two devices.
1. Go through onboarding flow on both devices. Make sure EN and bluetooth are turned on properly.
1. Access EN framework on device (step above). In debug mode On Android, make sure `Bypass app signature check` and `Return all TEKs immediately` toggle are ENABLED.
1. Disable and re-enable `COVID-19 Exposure Notifications` (Android) or `COVID-19 Exposure Notifications` (iOS). This forces the EN framework to re-scan Bluetooth Random IDs.
1. On 1st device:
   1. Get OneTimeCode from server.
   1. Enter the code to set the device to positive.
   1. Verify that the positive state shows as expected.
1. On 2nd device:
   1. If you have `Test Mode`:
      1. Press on app logo or swipe right to left to show `Test Mode`.
      1. Press on `Clear exposure history and run check`. This will force the app to re-fetch all TEKs from the last 14 days.
      1. Expect to see the app changes to exposed state `You have possibly been exposed to COVID-19`.
   1. If you don't have `Test Mode`:
      1. Clear data or re-install the app.
      1. Go through onboarding flow.
      1. Expect to see the app changes to exposed state `You have possibly been exposed to COVID-19`.
   1. If you uninstall the app and re-install, expect to see exposed status show immediately after onboarding flow.

## Test exposed state with notification (as end user)

This test runs everything on production. That means you only receive notification on the next date. Same date testing doesn't work for this scenario. `Test mode` cannot be used in this scenario.

1. Build and run the app on two devices.
1. Go through onboarding flow on both devices. Make sure EN and bluetooth are turned on properly.
1. Access EN framework on device (step above). In debug mode On Android, make sure `Bypass app signature check` and `Return all TEKs immediately` toggle are ENABLED.
1. (Optional) Disable and re-enable `COVID-19 Exposure Notifications` (Android) or `COVID-19 Exposure Notifications` (iOS). This forces the EN framework to re-scan Bluetooth Random IDs.
1. On 1st device:
   1. Get OneTimeCode from server.
   1. Enter the code to set the device to positive.
   1. Verify that the positive state shows as expected.
1. On 2nd device:
   1. Leave it approximately close to 1st device overnight.
      1. On Android, you can close the app completely or just minimize it. The app can run in the background even after being closed.
      1. On iOS, it's recommended to just minimize the app.
   1. Expect to see notification saying `You have possibly been exposed to COVID-19`.
   1. Tap on notification will open the app.
   1. Expect to see exposed status showing in the app.
   1. If you uninstall the app and re-install, expect to see exposed status show immediately after onboarding flow.
