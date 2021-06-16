import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n, DateLocale} from 'locale';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Box, Text, Icon, Button, ToolbarWithClose} from 'components';
import {CheckInData} from 'shared/qr';
import {formatExposedDate, formateScannedDate, accessibilityReadableDate, getScannedTime} from 'shared/date-fns';
import {useOutbreakService} from 'services/OutbreakService/OutbreakProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {MainStackParamList} from 'navigation/MainNavigator';
import {BoldText} from 'shared/BoldText';

import {sortedCheckInArray} from './utils';

const CheckInList = ({scannedCheckInData}: {scannedCheckInData: CheckInData[]}) => {
  const i18n = useI18n();
  const {deleteScannedPlace} = useOutbreakService();
  const checkIns = sortedCheckInArray(scannedCheckInData);

  const deleteConfirmationAlert = (locationId: string, timestamp: number) => {
    Alert.alert(i18n.translate('PlacesLog.Alert.Title'), i18n.translate('PlacesLog.Alert.Subtitle'), [
      {
        text: i18n.translate('PlacesLog.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('PlacesLog.Alert.ConfirmDelete'),
        onPress: () => {
          deleteScannedPlace(locationId, timestamp);
        },
        style: 'cancel',
      },
    ]);
  };
  return (
    <>
      {Object.keys(checkIns).map(item => {
        return (
          <Box key={item}>
            <Box marginTop="m" paddingBottom="m" paddingHorizontal="xs">
              <Text accessibilityLabel={`${accessibilityReadableDate(formateScannedDate(item))}`} variant="bodyTitle">
                {formatExposedDate(formateScannedDate(item), DateLocale())}
              </Text>
            </Box>

            <Box style={styles.radius} backgroundColor="gray5">
              {checkIns[item].map((data: any, index: number) => {
                return (
                  <Box
                    paddingHorizontal="m"
                    style={[checkIns[item].length !== index + 1 && styles.bottomBorder]}
                    key={data.checkIns.id.concat(index.toString())}
                  >
                    <Box paddingVertical="m" style={styles.checkInList}>
                      <Box style={styles.boxFlex}>
                        <Text variant="bodySubTitle">{data.checkIns.name}</Text>
                        <Text paddingTop="s">
                          {data.checkIns.address} {'\n'}
                          {getScannedTime(new Date(data.checkIns.timestamp), DateLocale())}
                        </Text>
                      </Box>
                      <Box style={styles.deleteIconBox}>
                        <TouchableOpacity
                          accessibilityLabel={`${i18n.translate('PlacesLog.DeleteIcon')} ${data.checkIns.name}`}
                          style={styles.deleteIcon}
                          onPress={() => {
                            deleteConfirmationAlert(data.checkIns.id, data.checkIns.timestamp);
                          }}
                        >
                          <Icon size={40} name="delete-icon" />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

const NoVisitsScreen = () => {
  const i18n = useI18n();

  return (
    <Box style={styles.noVisitScreen} marginTop="xl">
      <Icon height={120} width={150} name="no-visit-icon" />
      <Text paddingTop="s" fontWeight="bold">
        {i18n.translate('PlacesLog.NoVisit')}
      </Text>
    </Box>
  );
};

type CheckInHistoryScreenProps = RouteProp<MainStackParamList, 'CheckInHistoryScreen'>;

export const CheckInHistoryScreen = () => {
  const route = useRoute<CheckInHistoryScreenProps>();
  const i18n = useI18n();
  const {checkInHistory, deleteAllScannedPlaces} = useOutbreakService();
  const navigation = useNavigation();
  const closeRoute = route.params?.closeRoute ? route.params.closeRoute : 'Menu';
  const close = useCallback(() => navigation.navigate(closeRoute), [closeRoute, navigation]);

  const deleteAllPlaces = () => {
    Alert.alert(i18n.translate('PlacesLog.Alert.TitleDeleteAll'), i18n.translate('PlacesLog.Alert.SubtitleDeleteAll'), [
      {
        text: i18n.translate('PlacesLog.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('PlacesLog.Alert.ConfirmDeleteAll'),
        onPress: () => {
          deleteAllScannedPlaces();
        },
        style: 'cancel',
      },
    ]);
  };

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <ToolbarWithClose closeText={i18n.translate('PlacesLog.Close')} onClose={close} showBackButton={false} />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m">
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
              {i18n.translate('PlacesLog.Title')}
            </Text>
            <Text paddingRight="s" marginBottom="m">
              {BoldText(i18n.translate('PlacesLog.Body'))}
            </Text>
          </Box>

          {!checkInHistory.length || checkInHistory.length === 0 ? (
            <NoVisitsScreen />
          ) : (
            <>
              <Box paddingHorizontal="xxs" marginLeft="s" marginRight="s" paddingBottom="m">
                <CheckInList scannedCheckInData={checkInHistory} />
              </Box>

              <Box margin="m">
                <Button
                  variant="opaqueGrey"
                  text={i18n.translate('PlacesLog.DeleteBtnCTA')}
                  onPress={deleteAllPlaces}
                />
              </Box>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  bottomBorder: {
    borderBottomColor: '#8a8a8a',
    borderBottomWidth: 1,
  },
  radius: {
    borderRadius: 10,
  },
  noVisitScreen: {
    flex: 1,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  deleteIconBox: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteIcon: {
    alignItems: 'flex-end',
  },
  checkInList: {
    flexDirection: 'row',
  },
  boxFlex: {
    flex: 4,
  },
});
