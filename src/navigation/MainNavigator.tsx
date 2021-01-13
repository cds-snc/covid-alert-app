import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from 'screens/home';
import {TutorialScreen} from 'screens/tutorial';
import {
  FormScreen,
  Step0Screen,
  IntermediateInstructionScreen,
  Step2Screen,
  SymptomOnsetDateScreen,
  TekUploadNoDate,
  TekUploadSubsequentDays,
  TestDateScreen,
} from 'screens/datasharing';
import {LanguageScreen} from 'screens/language';
import {useStorage} from 'services/StorageService';
import {RegionPickerSettingsScreen, RegionPickerExposedNoPTScreen} from 'screens/regionPicker';
import {NoCodeScreen} from 'screens/nocode/NoCode';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OnboardingScreen} from 'screens/onboarding';
import {LandingScreen} from 'screens/landing';
import {TestScreen} from 'screens/testScreen';
import {ErrorScreen} from 'screens/errorScreen/ErrorScreen';
import {DismissAlertScreen} from 'screens/home/views/ClearExposureView';
import {FrameworkUnavailableView} from 'screens/home/views/FrameworkUnavailableView';

import {FormContext, FormContextDefaults} from '../shared/FormContext';

const MainStack = createStackNavigator<MainStackParamList>();

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
  RegionSelectExposedNoPT: {drawerMenu: boolean} | undefined;
}
const LandingScreenWithNavBar = withDarkNav(LandingScreen);
const HomeScreenWithNavBar = withDarkNav(HomeScreen);
const TutorialScreenWithNavBar = withDarkNav(TutorialScreen);
const Step0ScreenWithNavBar = withDarkNav(Step0Screen);
const IntermediateInstructionScreenWithNavBar = withDarkNav(IntermediateInstructionScreen);
const Step2ScreenWithNavBar = withDarkNav(Step2Screen);
const FormScreenWithNavBar = withDarkNav(FormScreen);
const TestDateScreenWithNavBar = withDarkNav(TestDateScreen);
const TekUploadNoDateWithNavBar = withDarkNav(TekUploadNoDate);
const TekUploadSubsequentDaysWithNavBar = withDarkNav(TekUploadSubsequentDays);
const SymptomOnsetDateScreenWithNavBar = withDarkNav(SymptomOnsetDateScreen);
const LanguageScreenWithNavBar = withDarkNav(LanguageScreen);
const RegionPickerSettingsScreenWithNavBar = withDarkNav(RegionPickerSettingsScreen);
const RegionPickerSettingsExposedScreenWithNavBar = withDarkNav(RegionPickerExposedNoPTScreen);
const NoCodeWithNavBar = withDarkNav(NoCodeScreen);
const TestScreenWithNavBar = withDarkNav(TestScreen);
const ErrorScreenWithNavBar = withDarkNav(ErrorScreen);
const DismissAlertScreenWithNavBar = withDarkNav(DismissAlertScreen);

const OnboardingWithNavBar = withDarkNavNonModal(OnboardingScreen);

const OnboardingStack = createStackNavigator();
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Onboarding">
      <OnboardingStack.Screen name="Onboarding" component={OnboardingWithNavBar} />
    </OnboardingStack.Navigator>
  );
};
const DataSharingStack = createStackNavigator();
const DataSharingNavigator = () => {
  const [state, setState] = useState(FormContextDefaults);
  const toggleModal = (val: boolean) => {
    setState({...state, modalVisible: val});
  };
  const setSymptomOnsetDate = (val: string) => {
    setState({...state, symptomOnsetDate: val});
  };
  const setTestDate = (val: string) => {
    setState({...state, testDate: val});
  };

  return (
    <FormContext.Provider value={{data: state, toggleModal, setSymptomOnsetDate, setTestDate}}>
      <DataSharingStack.Navigator screenOptions={{headerShown: false}} initialRouteName="Step0">
        <DataSharingStack.Screen name="Step0" component={Step0ScreenWithNavBar} />
        <DataSharingStack.Screen name="IntermediateScreen" component={IntermediateInstructionScreenWithNavBar} />
        <DataSharingStack.Screen name="FormView" component={FormScreenWithNavBar} />
        <DataSharingStack.Screen name="Step2" component={Step2ScreenWithNavBar} />
        <DataSharingStack.Screen name="SymptomOnsetDate" component={SymptomOnsetDateScreenWithNavBar} />
        <DataSharingStack.Screen name="TestDate" component={TestDateScreenWithNavBar} />
        <DataSharingStack.Screen name="TekUploadNoDate" component={TekUploadNoDateWithNavBar} />
        <DataSharingStack.Screen name="TekUploadSubsequentDays" component={TekUploadSubsequentDaysWithNavBar} />
      </DataSharingStack.Navigator>
    </FormContext.Provider>
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
      <MainStack.Screen name="DataSharing" component={DataSharingNavigator} />
      <MainStack.Screen name="LanguageSelect" component={LanguageScreenWithNavBar} />
      <MainStack.Screen name="RegionSelect" component={RegionPickerSettingsScreenWithNavBar} />
      <MainStack.Screen
        name="RegionSelectExposedNoPT"
        initialParams={{drawerMenu: false}}
        component={RegionPickerSettingsExposedScreenWithNavBar}
      />
      <MainStack.Screen name="DismissAlert" component={DismissAlertScreenWithNavBar} />
      <MainStack.Screen name="NoCode" component={NoCodeWithNavBar} />
      <MainStack.Screen name="TestScreen" component={TestScreenWithNavBar} />
      <MainStack.Screen name="ErrorScreen" component={ErrorScreenWithNavBar} />
      <MainStack.Screen name="FrameworkUnavailableScreen" component={FrameworkUnavailableView} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
