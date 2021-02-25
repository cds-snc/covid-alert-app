import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useI18n} from 'locale';
import {Box, Text, Icon, Button} from 'components';
import {BaseDataSharingView} from 'screens/datasharing/components/BaseDataSharingView';
import {CheckInData} from 'shared/qr';
import {formatCheckInDate} from 'shared/date-fns';
import {useOutbreakService} from 'shared/OutbreakProvider';

const CheckInList = ({checkIns, isEditing}: {checkIns: CheckInData[]; isEditing: boolean}) => {
  if (checkIns.length === 0) {
    return <Text>No Check-ins yet</Text>;
  }
  return (
    <>
      {checkIns.map((checkIn, index) => {
        return (
          <>
            <Box style={styles.boxStyle}>
              <TouchableOpacity>{isEditing && <Icon size={20} name="places-delete" />}</TouchableOpacity>

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
  const {checkInHistory} = useOutbreakService();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingText, setIsEditingText] = useState('Edit');
  const onPressEdit = () => {
    setIsEditing(!isEditing);
    setIsEditingText(isEditing ? 'Edit' : 'Done');
  };
  const i18n = useI18n();
  return (
    <BaseDataSharingView showBackButton={false}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
          {i18n.translate('ScannedPlaces.Title')}
        </Text>
        <Text>{i18n.translate('ScannedPlaces.Body1')}</Text>
        <Text marginTop="s" marginBottom="xl">
          {i18n.translate('ScannedPlaces.Body2')}
        </Text>
      </Box>
      <Box>
        <Box style={isEditing ? styles.textBoxEditing : styles.textBoxNoEdit}>
          {isEditing && <Button text="Delete All" variant="buttonSelect" onPress={onPressEdit} />}

          <Button text={isEditingText} variant="buttonSelect" onPress={onPressEdit} />
        </Box>

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
  textBoxEditing: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBoxNoEdit: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  placesBox: {
    borderRadius: 10,
  },
});
