import React, {useState} from 'react';
import {StatusBar, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from 'screens/home';
import {TutorialScreen} from 'screens/tutorial';
import {QRCodeOnboardScreen} from 'screens/qr-onboarding/Tutorial';
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
import {useCachedStorage} from 'services/StorageService';
import {RegionPickerSettingsScreen, RegionPickerExposedNoPTScreen} from 'screens/regionPicker';
import {NoCodeScreen} from 'screens/nocode/NoCode';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OnboardingScreen} from 'screens/onboarding';
import {LandingScreen} from 'screens/landing';
import {TestScreen} from 'screens/testScreen';
import {ErrorScreen} from 'screens/errorScreen/ErrorScreen';
import {QRCodeReaderScreen} from 'screens/qr/QRCodeReaderScreen';
import {DismissAlertScreen} from 'screens/home/views/ClearExposureView';
import {FrameworkUnavailableView} from 'screens/home/views/FrameworkUnavailableView';
import {CheckInSuccessfulScreen} from 'screens/qr/CheckInSuccessfulScreen';
import {InvalidQRCodeScreen} from 'screens/qr/InvalidQRCodeScreen';
import {CheckInHistoryScreen} from 'screens/qr/CheckInHistoryScreen';
import {ExposureHistoryScreen} from 'screens/exposureHistory/ExposureHistoryScreen';
import {QRCodeIntroScreen} from 'screens/qr/QRCodeIntroScreen';
import {MenuScreen} from 'screens/menu/MenuScreen';
import {ClearOutbreakExposureScreen} from 'screens/home/views/ClearOutbreakExposureView';
import {RecentExposureScreen} from 'screens/exposureHistory/RecentExposureView';
import {FormContext, FormContextDefaults} from 'shared/FormContext';
import {CombinedExposureHistoryData} from 'shared/qr';
import {useRegionalI18n} from 'locale';
import {ImportantMessageView} from 'screens/home/views/ImportantMessageView';

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

export interface MainStackParamList extends Record<string, object | undefined> {
  Home: {timestamp?: number};
  Onboarding: undefined;
  Tutorial: undefined;
  QRcodeOnboard: undefined;
  RegionSelectExposedNoPT: {drawerMenu: boolean} | undefined;
  ExposureHistoryScreen: undefined;
  RecentExposureScreen: {exposureHistoryItem: CombinedExposureHistoryData};
  CheckInHistoryScreen: {closeRoute: string};
}
const LandingScreenWithNavBar = withDarkNav(LandingScreen);
const HomeScreenWithNavBar = withDarkNav(HomeScreen);
const TutorialScreenWithNavBar = withDarkNav(TutorialScreen);
const QRCodeOnboardScreenWithNavBar = withDarkNav(QRCodeOnboardScreen);
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
const QRCodeReaderScreenWithNavBar = withDarkNav(QRCodeReaderScreen);
const CheckInSuccessfulScreenWithNavBar = withDarkNav(CheckInSuccessfulScreen);
const InvalidQRCodeScreenWithNavBar = withDarkNav(InvalidQRCodeScreen);
const OnboardingWithNavBar = withDarkNavNonModal(OnboardingScreen);
const CheckInHistoryScreenWithNavBar = withDarkNav(CheckInHistoryScreen);
const ExposureHistoryScreenWithNavBar = withDarkNav(ExposureHistoryScreen);
const QRCodeIntroScreenWithNavBar = withDarkNav(QRCodeIntroScreen);
const MenuScreenWithNavBar = withDarkNav(MenuScreen);
const ClearOutbreakExposureScreenWithNavBar = withDarkNav(ClearOutbreakExposureScreen);
const RecentExposureScreenWithNavBar = withDarkNav(RecentExposureScreen);
const DecommissionedViewWithNavBar = withDarkNav(ImportantMessageView);

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

const QRCodeStack = createStackNavigator();

export interface QRCodeStackParamList extends Record<string, object | undefined> {
  QRCodeReaderScreen: {fromScreen?: string};
}

const QRCodeNavigator = () => {
  const {hasViewedQrInstructions} = useCachedStorage();
  return (
    <QRCodeStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={hasViewedQrInstructions ? 'QRCodeReaderScreen' : 'QRCodeIntroScreen'}
    >
      <QRCodeStack.Screen name="QRCodeReaderScreen" component={QRCodeReaderScreenWithNavBar} />
      <QRCodeStack.Screen name="InvalidQRCodeScreen" component={InvalidQRCodeScreenWithNavBar} />
      <QRCodeStack.Screen name="CheckInSuccessfulScreen" component={CheckInSuccessfulScreenWithNavBar} />
      <QRCodeStack.Screen name="QRCodeIntroScreen" component={QRCodeIntroScreenWithNavBar} />
    </QRCodeStack.Navigator>
  );
};

const ExposureHistoryStack = createStackNavigator();
const ExposureHistoryNavigator = () => {
  const {hasViewedQrInstructions} = useCachedStorage();
  return (
    <ExposureHistoryStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={hasViewedQrInstructions ? 'QRCodeReaderScreen' : 'QRCodeIntroScreen'}
    >
      <ExposureHistoryStack.Screen name="ExposureHistoryScreen" component={ExposureHistoryScreenWithNavBar} />
      <ExposureHistoryStack.Screen name="RecentExposureScreen" component={RecentExposureScreenWithNavBar} />
    </ExposureHistoryStack.Navigator>
  );
};

const forFade = ({current}: {current: any}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const MainNavigator = () => {
  const {isOnboarding, importantMessage, setImportantMessage} = useCachedStorage();
  const regionalI18n = useRegionalI18n();
  const decommissioned = importantMessage || regionalI18n.translate('RegionContent.Decommissioned.Active') === 'true';
  if (decommissioned) {
    setImportantMessage(decommissioned);
  }
  const initialRouteName = () => {
    if (isOnboarding && decommissioned === false) {
      return 'Landing';
    } else if (decommissioned === true) {
      return 'Decommissioned';
    } else {
      return 'Home';
    }
  };
  console.log(`Initial Route Name: ${initialRouteName()}`);
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}} initialRouteName={initialRouteName()} mode="modal">
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
      <MainStack.Screen name="QRCodeFlow" component={QRCodeNavigator} />
      <MainStack.Screen name="CheckInHistoryScreen" component={CheckInHistoryScreenWithNavBar} />
      <MainStack.Screen name="ExposureHistory" component={ExposureHistoryNavigator} />
      <MainStack.Screen name="Menu" component={MenuScreenWithNavBar} />
      <MainStack.Screen name="ClearOutbreakExposure" component={ClearOutbreakExposureScreenWithNavBar} />
      <MainStack.Screen name="QRCodeOnboard" component={QRCodeOnboardScreenWithNavBar} />
      <MainStack.Screen name="Decommissioned" component={DecommissionedViewWithNavBar} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
