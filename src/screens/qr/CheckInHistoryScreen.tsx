import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n} from 'locale';
import {Box, Text, Icon, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {CheckInData} from 'shared/qr';
import {formatExposedDate, formateScannedDate} from 'shared/date-fns';
import {formatCheckInDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

import {sortedCheckInArray} from './utils';

const CheckInList = ({scannedCheckInData, isEditing}: {scannedCheckInData: CheckInData[]; isEditing: boolean}) => {
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
  if (checkIns.length === 0) {
    return <Text>No Check-ins yet</Text>;
  }
  return (
    <>
      {Object.keys(checkIns).map(item => {
        return (
          <>
            <Box marginTop="m" paddingBottom="m" key={item}>
              <Text variant="bodyTitle">{formatExposedDate(formateScannedDate(item), dateLocale)}</Text>
            </Box>

            <Box style={styles.radius} backgroundColor="gray5">
              {checkIns[item].map((data: any, index: number) => {
                return (
                  <>
                    <Box
                      paddingLeft="m"
                      style={[styles.boxStyle, checkIns[item].length !== index + 1 && styles.bottomBorder]}
                      key={data.checkIns.id.concat(index.toString())}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          deleteConfirmationAlert(data.checkIns.id);
                        }}
                      >
                        {isEditing && <Icon size={10} name="canada-logo" />}
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

export const CheckInHistoryScreen = () => {
  const i18n = useI18n();
  const {checkInHistory, deleteAllScannedPlaces} = useOutbreakService();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingText, setIsEditingText] = useState('Edit');
  const onPressEdit = () => {
    setIsEditing(!isEditing);
    setIsEditingText(isEditing ? 'Edit' : 'Done');
  };

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
          <Text>
            {i18n.translate('PlacesLog.Body1')}
            {/* {checkInHistory.length === 0
              ? i18n.translate('ScannedPlaces.BodyNoScan')
              : i18n.translate('ScannedPlaces.Body')} */}
          </Text>
          <Text variant="bodyTitle" accessibilityRole="header" marginTop="l">
            {i18n.translate('PlacesLog.Body2a')}
          </Text>
          <Text marginTop="s">{i18n.translate('PlacesLog.Body2a')}</Text>
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
