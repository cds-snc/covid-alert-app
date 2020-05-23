import React from 'react';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator, NativeStackNavigationOptions} from 'react-native-screens/native-stack';
import {HomeScreen} from 'screens/home';
import {TutorialScreen} from 'screens/tutorial';
import {DataSharingScreen} from 'screens/datasharing';
import {PrivacyScreen} from 'screens/privacy';
import {SharingScreen} from 'screens/sharing';
import {OnboardingScreen} from 'screens/onboarding';
import {LanguageScreen} from 'screens/language';
import {StatusBar, Platform} from 'react-native';
import {useStorage} from 'services/StorageService';
import {useNavigationState} from '@react-navigation/native';

enableScreens();

const MainStack = createNativeStackNavigator();

const withDarkNav = (Component: React.ElementType) => {
  const ComponentWithDarkNav = (props: any) => {
    const stackIndex = useNavigationState(state => state.index);
    return (
      <>
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
      </>
    );
  };
  return ComponentWithDarkNav;
};
const withLightNav = (Component: React.ElementType) => {
  const ComponentWithLightNav = (props: any) => (
    <>
      <StatusBar barStyle="light-content" />
      <Component {...props} />
    </>
  );
  return ComponentWithLightNav;
};

export interface MainStackParamList extends Record<string, object | undefined> {
  Home: undefined;
  Onboarding: undefined;
  Tutorial: undefined;
}

const HomeScreenWithNavBar = withLightNav(HomeScreen);
const OnboardingScreenWithNavBar = withDarkNav(OnboardingScreen);
const TutorialScreenWithNavBar = withDarkNav(TutorialScreen);
const DataSharingScreenWithNavBar = withDarkNav(DataSharingScreen);
const PrivacyScreenWithNavBar = withDarkNav(PrivacyScreen);
const SharingScreenWithNavBar = withDarkNav(SharingScreen);
const LanguageScreenWithNavBar = withDarkNav(LanguageScreen);

const DEFAULT_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  stackPresentation: 'modal',
  headerShown: false,
};

const MainNavigator = () => {
  const {isOnboarding} = useStorage();
  return (
    <MainStack.Navigator screenOptions={DEFAULT_SCREEN_OPTIONS} initialRouteName={isOnboarding ? 'Onboarding' : 'Home'}>
      <MainStack.Screen name="Home" component={HomeScreenWithNavBar} />
      <MainStack.Screen name="Onboarding" component={OnboardingScreenWithNavBar} />
      <MainStack.Screen name="Tutorial" component={TutorialScreenWithNavBar} />
      <MainStack.Screen name="DataSharing" component={DataSharingScreenWithNavBar} />
      <MainStack.Screen name="Privacy" component={PrivacyScreenWithNavBar} />
      <MainStack.Screen name="Sharing" component={SharingScreenWithNavBar} />
      <MainStack.Screen name="LanguageSelect" component={LanguageScreenWithNavBar} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
