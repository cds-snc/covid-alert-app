import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {useNavigationState} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {HomeScreen} from 'screens/home';
import {TutorialScreen} from 'screens/tutorial';
import {DataSharingScreen} from 'screens/datasharing';
import {PrivacyScreen} from 'screens/privacy';
import {LanguageScreen} from 'screens/language';
import {useStorage} from 'services/StorageService';
import {RegionPickerSettingsScreen, RegionPickerScreen} from 'screens/regionPicker';
import {NoCodeScreen} from 'screens/nocode/NoCode';
import {HowToIsolate} from 'screens/howToIsolate/HowToIsolate';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Start, Permissions, Anonymous, HowItWorks, WhatItsNot} from 'screens/onboarding';

enableScreens();

const MainStack = createNativeStackNavigator();

const withDarkNav = (Component: React.ElementType) => {
  const ComponentWithDarkNav = (props: any) => {
    const stackIndex = useNavigationState(state => state.index);
    return (
      <SafeAreaProvider>
        <StatusBar
          barStyle={
            // On iOS 13+ keep light statusbar since the screen will be displayed in a modal with a
            // dark background.
            stackIndex > 0 && Platform.OS === 'ios' && parseInt(Platform.Version as string, 10) >= 13 && !Platform.isPad
              ? 'light-content'
              : 'dark-content'
          }
        />
        <Component {...props} />
      </SafeAreaProvider>
    );
  };
  return ComponentWithDarkNav;
};

const withDarkNavNonModal = (Component: React.ElementType) => {
  const ComponentWithDarkNav = (props: any) => {
    // for onboarding, we don't use modal navigation
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Component {...props} />
      </SafeAreaProvider>
    );
  };
  return ComponentWithDarkNav;
};

// const withLightNav = (Component: React.ElementType) => {
//   const ComponentWithLightNav = (props: any) => (
//     <SafeAreaProvider>
//       <StatusBar barStyle="light-content" />
//       <Component {...props} />
//     </SafeAreaProvider>
//   );
//   return ComponentWithLightNav;
// };

export interface MainStackParamList extends Record<string, object | undefined> {
  Home: undefined;
  Onboarding: undefined;
  Tutorial: undefined;
}

const HomeScreenWithNavBar = withDarkNav(HomeScreen);
const TutorialScreenWithNavBar = withDarkNav(TutorialScreen);
const DataSharingScreenWithNavBar = withDarkNav(DataSharingScreen);
const PrivacyScreenWithNavBar = withDarkNav(PrivacyScreen);
const LanguageScreenWithNavBar = withDarkNav(LanguageScreen);
const RegionPickerSettingsScreenWithNavBar = withDarkNav(RegionPickerSettingsScreen);
const NoCodeWithNavBar = withDarkNav(NoCodeScreen);
const HowToIsolateWithNavBar = withDarkNav(HowToIsolate);

const OnboardingStartWithNavBar = withDarkNavNonModal(Start);
const OnboardingWhatItsNotWithNavBar = withDarkNavNonModal(WhatItsNot);
const OnboardingAnonymousWithNavBar = withDarkNavNonModal(Anonymous);
const OnboardingHowItWorksWithNavBar = withDarkNavNonModal(HowItWorks);
const OnboardingPermissionsWithNavBar = withDarkNavNonModal(Permissions);
const OnboardingRegionWithNavBar = withDarkNavNonModal(RegionPickerScreen);

const OnboardingStack = createNativeStackNavigator();
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{headerShown: false}} initialRouteName="OnboardingStart">
      <OnboardingStack.Screen name="OnboardingStart" component={OnboardingStartWithNavBar} />
      <OnboardingStack.Screen name="OnboardingWhatItsNot" component={OnboardingWhatItsNotWithNavBar} />
      <OnboardingStack.Screen name="OnboardingAnonymous" component={OnboardingAnonymousWithNavBar} />
      <OnboardingStack.Screen name="OnboardingHowItWorks" component={OnboardingHowItWorksWithNavBar} />
      <OnboardingStack.Screen name="OnboardingPermissions" component={OnboardingPermissionsWithNavBar} />
      <OnboardingStack.Screen name="OnboardingRegion" component={OnboardingRegionWithNavBar} />
    </OnboardingStack.Navigator>
  );
};

const MainNavigator = () => {
  const {isOnboarding} = useStorage();
  return (
    <MainStack.Navigator
      screenOptions={{stackPresentation: 'modal', headerShown: false}}
      initialRouteName={isOnboarding ? 'OnboardingNavigator' : 'Home'}
    >
      <MainStack.Screen name="Home" component={HomeScreenWithNavBar} />
      <MainStack.Screen name="OnboardingNavigator" component={OnboardingNavigator} />
      <MainStack.Screen name="Tutorial" component={TutorialScreenWithNavBar} />
      <MainStack.Screen name="DataSharing" component={DataSharingScreenWithNavBar} />
      <MainStack.Screen name="Privacy" component={PrivacyScreenWithNavBar} />
      <MainStack.Screen name="LanguageSelect" component={LanguageScreenWithNavBar} />
      <MainStack.Screen name="RegionSelect" component={RegionPickerSettingsScreenWithNavBar} />
      <MainStack.Screen name="NoCode" component={NoCodeWithNavBar} />
      <MainStack.Screen name="HowToIsolate" component={HowToIsolateWithNavBar} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
