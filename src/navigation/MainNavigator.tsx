import React from 'react';
import {StatusBar} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from 'screens/home';
import {TutorialScreen} from 'screens/tutorial';
import {DataSharingScreen} from 'screens/datasharing';
import {PrivacyScreen} from 'screens/privacy';
import {LanguageScreen} from 'screens/language';
import {useStorage} from 'services/StorageService';
import {RegionPickerSettingsScreen} from 'screens/regionPicker';
import {NoCodeScreen} from 'screens/nocode/NoCode';
import {HowToIsolate} from 'screens/howToIsolate/HowToIsolate';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OnboardingScreen} from 'screens/onboarding';
import {LandingScreen} from 'screens/landing';

enableScreens();

const MainStack = createStackNavigator();

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
const LandingScreenWithNavBar = withDarkNav(LandingScreen);
const HomeScreenWithNavBar = withDarkNav(HomeScreen);
const TutorialScreenWithNavBar = withDarkNav(TutorialScreen);
const DataSharingScreenWithNavBar = withDarkNav(DataSharingScreen);
const PrivacyScreenWithNavBar = withDarkNav(PrivacyScreen);
const LanguageScreenWithNavBar = withDarkNav(LanguageScreen);
const RegionPickerSettingsScreenWithNavBar = withDarkNav(RegionPickerSettingsScreen);
const NoCodeWithNavBar = withDarkNav(NoCodeScreen);
const HowToIsolateWithNavBar = withDarkNav(HowToIsolate);

const OnboardingWithNavBar = withDarkNavNonModal(OnboardingScreen);

const OnboardingStack = createStackNavigator();
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Onboarding">
      <OnboardingStack.Screen name="Onboarding" component={OnboardingWithNavBar} />
    </OnboardingStack.Navigator>
  );
};

const forFade = ({current}: {current: any}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const MainNavigator = () => {
  const {isOnboarding} = useStorage();
  return (
    <MainStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={isOnboarding ? 'Landing' : 'Home'}
      mode="modal"
    >
      <MainStack.Screen name="Landing" component={LandingScreenWithNavBar} />
      <MainStack.Screen name="Home" component={HomeScreenWithNavBar} />
      <MainStack.Screen
        options={{cardStyleInterpolator: forFade}}
        name="OnboardingNavigator"
        component={OnboardingNavigator}
      />
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
