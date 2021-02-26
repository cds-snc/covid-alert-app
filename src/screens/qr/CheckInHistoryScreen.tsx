import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n} from 'locale';
import {Box, Text, Icon, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {CheckInData} from 'shared/qr';
import {formatCheckInDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

const CheckInList = ({checkIns, isEditing}: {checkIns: CheckInData[]; isEditing: boolean}) => {
  const {deleteScannedPlaces} = useOutbreakService();
  const i18n = useI18n();
  const sortedCheckIn = checkIns.sort(function(a, b) {
    return b.timestamp - a.timestamp;
  });
  const deleteConfirmationAlert = (id: string) => {
    Alert.alert(i18n.translate('ScannedPlaces.Alert.Title'), i18n.translate('ScannedPlaces.Alert.Subtitle'), [
      {
        text: i18n.translate('ScannedPlaces.Alert.Cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: i18n.translate('ScannedPlaces.Alert.Confirm'),
        onPress: () => {
          deleteScannedPlaces(id);
        },
        style: 'default',
      },
    ]);
  };

  return (
    <>
      {sortedCheckIn.map((checkIn, index) => {
        return (
          <>
            <Box style={styles.boxStyle}>
              <TouchableOpacity
                onPress={() => {
                  deleteConfirmationAlert(checkIn.id);
                }}
              >
                {isEditing && <Icon size={20} name="places-delete" />}
              </TouchableOpacity>

              <Box
                padding="m"
                backgroundColor="gray5"
                style={styles.boxBorder}
                key={checkIn.id.concat(index.toString())}
              >
                <Text variant="bodyTitle2">{checkIn.name}</Text>
                <Text paddingTop="s">{checkIn.address}</Text>
                <Text paddingTop="s">{formatCheckInDate(new Date(checkIn.timestamp))}</Text>
              </Box>
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

  useEffect(() => {
    checkInHistory;
  }, [checkInHistory]);
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
        style: 'cancel',
      },
      {
        text: i18n.translate('ScannedPlaces.Alert.Confirm'),
        onPress: () => {
          deleteAllScannedPlaces();
        },
        style: 'default',
      },
    ]);
  };

  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          {i18n.translate('ScannedPlaces.Title')}
        </Text>
        <Text>
          {checkInHistory.length === 0
            ? i18n.translate('ScannedPlaces.BodyNoScan')
            : i18n.translate('ScannedPlaces.Body')}
        </Text>
      </Box>
      <Box>
        {checkInHistory.length === 0 ? null : (
          <Box style={styles.textBox}>
            <Box>{isEditing && <Button text="Delete All" variant="buttonSelect" onPress={deleteAllPlaces} />}</Box>

            <Box>
              <Button text={isEditingText} variant="buttonSelect" onPress={onPressEdit} />
            </Box>
          </Box>
        )}

        <Box paddingHorizontal="s" marginLeft="m" marginRight="m" style={styles.placesBox} backgroundColor="gray5">
          <CheckInList checkIns={checkInHistory} isEditing={isEditing} />
        </Box>
      </Box>
    </BaseDataSharingView>
  );
};

const styles = StyleSheet.create({
  boxBorder: {
    borderBottomColor: '#8a8a8a',
    borderBottomWidth: 1,
  },
  boxStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placesBox: {
    borderRadius: 10,
  },
});
