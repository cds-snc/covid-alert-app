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
  const lastItem = sortedCheckIn.length - 1;
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
      {sortedCheckIn.map((checkIn, index) => {
        return (
          <>
            <Box
              style={[styles.boxStyle, sortedCheckIn[lastItem] !== checkIn && styles.bottomBorder]}
              key={checkIn.id.concat(index.toString())}
            >
              <TouchableOpacity
                onPress={() => {
                  deleteConfirmationAlert(checkIn.id);
                }}
              >
                {isEditing && <Icon size={20} name="places-delete" />}
              </TouchableOpacity>

              <Box padding="m" key={checkIn.id.concat(index.toString())}>
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
    <BaseDataSharingView showBackButton={true}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          {i18n.translate('ScannedPlaces.Title')}
        </Text>
        <Text>
          {checkInHistory.length === 0
            ? i18n.translate('ScannedPlaces.BodyNoScan')
            : i18n.translate('ScannedPlaces.Body')}
        </Text>
        {checkInHistory.length !== 0 && (
          <>
            <Text variant="bodyTitle" accessibilityRole="header" marginTop="l">
              {i18n.translate('ScannedPlaces.Title2')}
            </Text>
            <Text marginTop="s">{i18n.translate('ScannedPlaces.Body2')}</Text>
          </>
        )}
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

        <Box paddingHorizontal="xxs" marginLeft="m" marginRight="m" style={styles.placesBox} backgroundColor="gray5">
          <CheckInList checkIns={checkInHistory} isEditing={isEditing} />
        </Box>
      </Box>
    </BaseDataSharingView>
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
  placesBox: {
    borderRadius: 10,
  },
});
