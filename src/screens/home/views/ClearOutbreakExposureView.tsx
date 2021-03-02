import React, {useCallback} from 'react';
import {ScrollView, Alert, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Box, Button, ButtonSingleLine, Toolbar} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useOutbreakService} from 'services/OutbreakService';

export const ClearOutbreakExposureScreen = () => {
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const {clearOutbreakHistory} = useOutbreakService();
  const onClearOutbreak = useCallback(async () => {
    clearOutbreakHistory();
  }, [clearOutbreakHistory]);
  const onClearOutbreakExposed = useCallback(() => {
    Alert.alert('Are you sure you want to clear outbreak exposure history?', undefined, [
      {
        text: 'Confirm',
        onPress: () => {
          onClearOutbreak();
          close();
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  }, [close, onClearOutbreak]);

  return (
    <Box backgroundColor="overlayBackground" style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <Toolbar title="" navIcon="icon-back-arrow" navText="Close" navLabel="Close" onIconClicked={close} />
        <ScrollView>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
              Clear Outbreak Exposure History
            </Text>
            <Text marginBottom="m">
              If you have recieved a negative test result, you may clear your outbreak exposure history
            </Text>

            <Button text="Clear Exposure" onPress={onClearOutbreakExposed} variant="thinFlat" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export const NegativeOutbreakTestButton = () => {
  const navigation = useNavigation();

  const toClearOutbreakExposure = useCallback(() => navigation.navigate('ClearOutbreakExposure'), [navigation]);

  return (
    <Box>
      <Box alignSelf="stretch">
        <ButtonSingleLine
          iconName="icon-chevron"
          text="Clear Outbreak Exposure"
          onPress={toClearOutbreakExposure}
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
