# End to end testing with Detox

## iOS setup

1. Follow main repo install instructions, then from a shell open in the repo run:
2. `brew tap wix/brew && brew  install applesimutils`
3. Ensure project builds in Xcode

## Android setup

1. Get yourself one or more emulators, you have options:

- [Detox recommends Android Open-Source Project (AOSP) emulators](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#android-aosp-emulators)
- Install from Android Studio [these instructions](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#installing-from-android-studio)

2.(Optional) [Set up quick boot](https://github.com/wix/Detox/blob/master/docs/Introduction.AndroidDevEnv.md#emulator-quick-boot) on the emulator.

**NOTE**: The AOSP emulators appear to require Java 8 (JDK 1.8). You may have a newer version of Java, like Java 15 installed...

**IMPORTANT JAVA NOTICE**

Read instructions on how to install older versions of Java alongside modern Java versions, and easily switch between them: [-> java.md <-](java.md)

## Tests

### Onboarding
A common tests to get through the onboarding. Often used before other test to get deeper into the app.

### ExploreDemoMenu

e2e testing Detox script that iterates through every page of the app available on the debug menu and takes screenshots as it goes.

See the `artifacts` folder for the output.

## Running Tests

### Preparation

`yarn pre:test:android`

or

`yarn pre:test:ios`

### Metro server

If you haven't recently run a `yarn pre:test:ios` command, or if you've run it but closed the many   prompts it opened, you might not have metro server running. *Metro must be running* for Detox to talk with React and to interact with the app.

From a separate terminal tab, or prompt, navigate to the app repo and run `npx react-native start`

![Setup to run Detox](SetupToRunDetox.png)

**BUILDING THE BUNDLE TAKES A WHILE**
See progress bar on bottom of Metro server window.

### Individual tests

*As outilned in `.detoxrc.json`*

From the main repo, for example, run:

`detox test e2e/exploreDemoMenu.e2e.js --configuration=ios`

or `android.aosp` for android simulator

![Succesful Detox run of exploreDemoMenu.e2e.js](SuccesfulDemoMenuTest.png)
Took 100s on a 2017 13-inch Macbook Pro.

### Run the entire test suite

This takes many minutes, and binds up most of your computer ressources while at it...

`yarn test:android`

or

`yarn test:ios`

## Troubleshooting

Sorted by "deeper into the rabbit hole":

### Simulator Errors/Warnings

You can dismiss warnings, and they should go away for the lifetime of the simulator.
If Errors pop up they will overlap the visual items the simulator is trying to show, and thus block the items below them. This is a pain, you need to bring this up with a Dev so those errors can be remedied or handled differently.

### (iOS) Detox builds fail unexpectedly

1. Open the app project in Xcode
2. (optional) NavBar -> Product -> Clean Build Folder (accept to kill any running instances)
3. navigate throught Left Sidebar -> Folder Icon -> click on "CovidShield" project -> opens -> middle top tab "Signing & Capabilities" -> middle lower top tab "Debug" -> collapsible section "Signing" -> dropdown "Provisionning Profile" -> make sure no errors here...
4. Top bar -> ensure Active Scheme set to "Staging"
5. Top bar -> ensure Target Device set to preferred simulator (iPhone 8 reccomended)

Project must succesfully build in Xcode, deploy to and open the simulator in Xcode, otherwise it'll never work on the command-line...

### (Android) Detox builds fail unexpectedly

1. Open the app project in Android Studio
2. You likely have updates pending, apply them all.
3. Top bar -> Build project

Project must succesfully build in Android Studio, otherwise it'll never work on the command-line...

### Tests Fail

#### Randomly

just re-run the test once more...

#### with Specific Messages

***Test Failed: No views in hierarchy found matching: (with tag value: is "someTagName"***

this means one test item is looking for an HTML-like item with a tag/attribute of the name "someTagName", and is not finding it. Most likely a swipe/scroll handle not set (by the devs) in a newly made "SomethingView.tsx".

### (Android) In the case of

```bash
> Task :@react-native-community_async-storage:processDebugAndroidTestResources FAILED
```

you can try: `cd android && ./gradlew clean`
