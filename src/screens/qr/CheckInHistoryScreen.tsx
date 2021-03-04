import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n} from 'locale';
import {Box, Text, Icon, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {CheckInData} from 'shared/qr';
import {formatExposedDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

import {sortedCheckInArray} from './utils';

const CheckInList = ({scannedCheckInData, isEditing}: {scannedCheckInData: CheckInData[]; isEditing: boolean}) => {
  const i18n = useI18n();
  const {deleteScannedPlaces} = useOutbreakService();
  const checkIns = sortedCheckInArray(scannedCheckInData);
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';

  const deleteConfirmationAlert = (id: string) => {
    Alert.alert(i18n.translate('ScannedPlaces.Alert.Title'), i18n.translate('ScannedPlaces.Alert.Subtitle'), [
      {
        text: i18n.translate('ScannedPlaces.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('ScannedPlaces.Alert.Confirm'),
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
        const dateSplit = item.split('/');
        const formattedDate = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);

        return (
          <>
            <Box marginTop="m" paddingBottom="m" key={item}>
              <Text variant="bodyTitle">{formatExposedDate(new Date(item), dateLocale)}</Text>
            </Box>

            <Box style={styles.radius} backgroundColor="gray5">
              {checkIns[item].map((data: any, index: number) => {
                return (
                  <>
                    <Box
                      paddingLeft="s"
                      style={[styles.boxStyle, checkIns[item].length !== index + 1 && styles.bottomBorder]}
                      key={data.checkIns.id.concat(index.toString())}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          deleteConfirmationAlert(data.checkIns.id);
                        }}
                      >
                        {isEditing && <Icon size={20} name="places-delete" />}
                      </TouchableOpacity>
                      <Box padding="m">
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
                    </Box>
                  </>
                );
              })}
            </Box>
          </>
        );
      })}
    </>
  );
};
const NoScannedBox = () => {
  const i18n = useI18n();

  return (
    <Box paddingHorizontal="xxs" marginTop="m" backgroundColor="gray5">
      <Text padding="s">{i18n.translate('ScannedPlaces.NoScanBoxBody')}</Text>
    </Box>
  );
};
export const CheckInHistoryScreen = () => {
  const i18n = useI18n();
  const {checkInHistory, deleteAllScannedPlaces} = useOutbreakService();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingText, setIsEditingText] = useState(i18n.translate('ScannedPlaces.Edit'));
  const onPressEdit = () => {
    setIsEditing(!isEditing);
    setIsEditingText(isEditing ? i18n.translate('ScannedPlaces.Edit') : i18n.translate('ScannedPlaces.Done'));
  };

  const deleteAllPlaces = () => {
    Alert.alert(i18n.translate('ScannedPlaces.Alert.TitleDeleteAll'), i18n.translate('ScannedPlaces.Alert.Subtitle'), [
      {
        text: i18n.translate('ScannedPlaces.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('ScannedPlaces.Alert.Confirm'),
        onPress: () => {
          deleteAllScannedPlaces();
        },
        style: 'cancel',
      },
    ]);
  };

  return (
    <>
      <BaseDataSharingView showCloseButton={false}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
            {i18n.translate('ScannedPlaces.Title')}
          </Text>
          <Text>
            {checkInHistory.length === 0
              ? i18n.translate('ScannedPlaces.BodyNoScan')
              : i18n.translate('ScannedPlaces.Body')}
          </Text>
          <Text variant="bodyTitle" accessibilityRole="header" marginTop="l">
            {i18n.translate('ScannedPlaces.Title2')}
          </Text>
          <Text marginTop="s">{i18n.translate('ScannedPlaces.Body2')}</Text>
        </Box>
        <Box>
          {checkInHistory.length !== 0 && (
            <Box style={styles.textBox}>
              <Box>{isEditing && <Button text="Delete All" variant="text" onPress={deleteAllPlaces} />}</Box>

              <Box>
                <Button text={isEditingText} variant="text" onPress={onPressEdit} />
              </Box>
            </Box>
          )}

          <Box paddingHorizontal="xxs" marginLeft="m" marginRight="m" paddingBottom="m">
            <CheckInList scannedCheckInData={checkInHistory} isEditing={isEditing} />
          </Box>
        </Box>
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
});
