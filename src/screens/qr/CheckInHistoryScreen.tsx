import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon, Button, Toolbar} from 'components';
import {CheckInData} from 'shared/qr';
import {formatExposedDate, formateScannedDate, accessibilityReadableDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

import {sortedCheckInArray} from './utils';

const CheckInList = ({scannedCheckInData}: {scannedCheckInData: CheckInData[]}) => {
  const i18n = useI18n();
  const {deleteScannedPlaces} = useOutbreakService();
  const checkIns = sortedCheckInArray(scannedCheckInData);
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';

  const deleteConfirmationAlert = (id: string) => {
    Alert.alert(i18n.translate('PlacesLog.Alert.Title'), i18n.translate('PlacesLog.Alert.Subtitle'), [
      {
        text: i18n.translate('PlacesLog.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('PlacesLog.Alert.ConfirmDelete'),
        onPress: () => {
          deleteScannedPlaces(id);
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
            <Box marginTop="m" paddingBottom="m">
              <Text accessibilityLabel={`${accessibilityReadableDate(formateScannedDate(item))}`} variant="bodyTitle">
                {formatExposedDate(formateScannedDate(item), dateLocale)}
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
                      <Box style={{flex: 4}}>
                        <Text variant="bodySubTitle">{data.checkIns.name}</Text>
                        <Text paddingVertical="s">{data.checkIns.address}</Text>
                        <Text>
                          {new Date(data.checkIns.timestamp).toLocaleString('default', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </Text>
                      </Box>
                      <Box style={styles.deleteIconBox}>
                        <TouchableOpacity
                          accessibilityLabel={`${i18n.translate('PlacesLog.DeleteIcon')} ${data.checkIns.name}`}
                          style={styles.deleteIcon}
                          onPress={() => {
                            deleteConfirmationAlert(data.checkIns.id);
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

export const CheckInHistoryScreen = () => {
  const i18n = useI18n();
  const {checkInHistory, deleteAllScannedPlaces} = useOutbreakService();
  const navigation = useNavigation();
  const back = useCallback(() => navigation.goBack(), [navigation]);

  const deleteAllPlaces = () => {
    Alert.alert(i18n.translate('PlacesLog.Alert.TitleDeleteAll'), i18n.translate('PlacesLog.Alert.Subtitle'), [
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
        <Toolbar title="" navIcon="icon-back-arrow" navText={i18n.translate('PlacesLog.Back')} onIconClicked={back} />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m">
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
              {i18n.translate('PlacesLog.Title')}
            </Text>
            <Text>{i18n.translate('PlacesLog.Body1')}</Text>

            <Text marginTop="s">
              <Text fontWeight="bold">{i18n.translate('PlacesLog.Body2a')}</Text>

              {i18n.translate('PlacesLog.Body2b')}
            </Text>
          </Box>

          {checkInHistory.length === 0 ? (
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
  textBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    justifyContent: 'flex-end',
  },
  checkInList: {
    flexDirection: 'row',
  },
});
