import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n} from 'locale';
import {Box, Text, Icon, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {CheckInData} from 'shared/qr';
import {formatExposedDate, formateScannedDate, formatCheckInDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

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
              <Text variant="bodyTitle">{formatExposedDate(formateScannedDate(item), dateLocale)}</Text>
            </Box>

            <Box style={styles.radius} backgroundColor="gray5">
              {checkIns[item].map((data: any, index: number) => {
                return (
                  <Box
                    paddingHorizontal="m"
                    style={[styles.boxStyle, checkIns[item].length !== index + 1 && styles.bottomBorder]}
                    key={data.checkIns.id.concat(index.toString())}
                  >
                    <Box paddingVertical="m" paddingRight="s">
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
                    <Box>
                      <TouchableOpacity
                        onPress={() => {
                          deleteConfirmationAlert(data.checkIns.id);
                        }}
                      >
                        <Icon size={40} name="delete-icon" />
                      </TouchableOpacity>
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
    <>
      <BaseDataSharingView>
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
            <Box paddingHorizontal="xxs" marginLeft="m" marginRight="m" paddingBottom="m">
              <CheckInList scannedCheckInData={checkInHistory} />
            </Box>

            <Box margin="m">
              <Button variant="opaqueGrey" text={i18n.translate('PlacesLog.DeleteBtnCTA')} onPress={deleteAllPlaces} />
            </Box>
          </>
        )}
      </BaseDataSharingView>
    </>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
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
});
