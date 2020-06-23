import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {useNavigationState} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {HomeScreen} from 'screens/home';
import {TutorialScreen} from 'screens/tutorial';
import {DataSharingScreen} from 'screens/datasharing';
import {PrivacyScreen} from 'screens/privacy';
import {SharingScreen} from 'screens/sharing';
import {OnboardingScreen} from 'screens/onboarding';
import {LanguageScreen} from 'screens/language';
import {useStorage} from 'services/StorageService';
import {RegionPickerScreen, RegionPickerSettingsScreen} from 'screens/regionPicker';
import {SafeAreaProvider} from 'react-native-safe-area-context';

enableScreens();

const MainStack = createNativeStackNavigator();

const withDarkNav = (Component: React.ElementType) => {
  const ComponentWithDarkNav = (props: any) => {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Component {...props} />
      </SafeAreaProvider>
    );
  };
  return ComponentWithDarkNav;
};

const withLightNav = (Component: React.ElementType) => {
  const ComponentWithLightNav = (props: any) => (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Component {...props} />
    </SafeAreaProvider>
  );
  return ComponentWithLightNav;
};

export interface MainStackParamList extends Record<string, object | undefined> {
  Home: undefined;
  Onboarding: undefined;
  Tutorial: undefined;
}

const HomeScreenWithNavBar = withDarkNav(HomeScreen);
const RegionPickerScreenWithNavBar = withDarkNav(RegionPickerScreen);
const OnboardingScreenWithNavBar = withDarkNav(OnboardingScreen);
const TutorialScreenWithNavBar = withLightNav(TutorialScreen);
const DataSharingScreenWithNavBar = withLightNav(DataSharingScreen);
const PrivacyScreenWithNavBar = withLightNav(PrivacyScreen);
const SharingScreenWithNavBar = withLightNav(SharingScreen);
const LanguageScreenWithNavBar = withLightNav(LanguageScreen);
const RegionPickerSettingsScreenWithNavBar = withLightNav(RegionPickerSettingsScreen);

const OnboardingStack = createNativeStackNavigator();
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{stackAnimation: 'fade', headerShown: false}}
      initialRouteName="OnboardingTutorial"
    >
      <OnboardingStack.Screen name="OnboardingTutorial" component={OnboardingScreenWithNavBar} />
      <OnboardingStack.Screen name="RegionPicker" component={RegionPickerScreenWithNavBar} />
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
      <MainStack.Screen name="Sharing" component={SharingScreenWithNavBar} />
      <MainStack.Screen name="LanguageSelect" component={LanguageScreenWithNavBar} />
      <MainStack.Screen name="RegionSelect" component={RegionPickerSettingsScreenWithNavBar} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
