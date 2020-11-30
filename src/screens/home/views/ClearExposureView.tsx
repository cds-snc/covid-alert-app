import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Box, ButtonSingleLine, Toolbar} from 'components';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useClearExposedStatus} from 'services/ExposureNotificationService';
import {useI18n} from 'locale';

export const DismissAlertScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [clearExposedStatus] = useClearExposedStatus();

  const onClearExposedState = useCallback(() => {
    Alert.alert(i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Body'), undefined, [
      {
        text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: i18n.translate('Home.ExposureDetected.Dismiss.Confirm.Accept'),
        onPress: () => {
          clearExposedStatus();
          close();
        },
        style: 'default',
      },
    ]);
  }, [clearExposedStatus, i18n]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('LanguageSelect.Close')}
          navLabel={i18n.translate('LanguageSelect.Close')}
          onIconClicked={close}
        />
        <ScrollView>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Box>
              <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
                {i18n.translate('Home.ExposureDetected.Dismiss.Title')}
              </Text>

              <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Dismiss.Body')}</Text>
              <Text marginBottom="l">{i18n.translate('Home.ExposureDetected.Dismiss.Body2')}</Text>

              <ButtonSingleLine
                text={i18n.translate('Home.ExposureDetected.Dismiss.CTA')}
                onPress={onClearExposedState}
                variant="bigFlat"
              />
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export const NegativeTestButton = () => {
  const i18n = useI18n();
  const navigation = useNavigation();

  const onDismissAlert = useCallback(() => navigation.navigate('DismissAlert'), [navigation]);

  return (
    <Box>
      <Box alignSelf="stretch" marginBottom="m">
        <ButtonSingleLine
          iconName="icon-chevron"
          text={i18n.translate('Home.ExposureDetected.NegativeTest.CTA')}
          onPress={onDismissAlert}
          variant="exposure25"
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
