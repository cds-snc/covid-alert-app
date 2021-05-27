import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useI18n} from 'locale';
import {CombinedExposureHistoryData} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon} from 'components';
import {formatExposedDate} from 'shared/date-fns';

const getRadiusStyle = (index: number, listLength: number) => {
  if (listLength === 1) {
    return styles.fullRadius;
  }
  if (index === 0) {
    return styles.radiusTop;
  }
  if (index === listLength - 1) {
    return styles.radiusBottom;
  }
};

export const ExposureList = ({exposureHistoryData}: {exposureHistoryData: CombinedExposureHistoryData[]}) => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const navigation = useNavigation();
  const onDetails = useCallback(
    ({exposureHistoryItem}) => navigation.navigate('RecentExposureScreen', {exposureHistoryItem}),
    [navigation],
  );
  exposureHistoryData.sort(function (first, second) {
    return second.notificationTimestamp - first.notificationTimestamp;
  });

  return (
    <>
      <Text paddingBottom="m">{i18n.translate('ExposureHistory.Body')}</Text>
      {exposureHistoryData.map((item, index) => {
        return (
          <Box key={item.historyItem.id}>
            <Box backgroundColor="gray5" style={getRadiusStyle(index, exposureHistoryData.length)}>
              <Box paddingHorizontal="m" style={[exposureHistoryData.length !== index + 1 && styles.bottomBorder]}>
                <TouchableOpacity
                  style={styles.chevronIcon}
                  onPress={() => {
                    onDetails({
                      exposureHistoryItem: item,
                    });
                  }}
                >
                  <Box paddingVertical="m" style={styles.exposureList}>
                    <Box style={styles.boxFlex}>
                      <Text fontWeight="bold">
                        {formatExposedDate(new Date(item.notificationTimestamp), dateLocale)}
                      </Text>
                      <Text>{item.subtitle}</Text>
                    </Box>
                    <Box style={styles.chevronIconBox} paddingRight="s">
                      <Icon size={30} name="icon-chevron" />
                    </Box>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  bottomBorder: {
    borderBottomColor: '#8a8a8a',
    borderBottomWidth: 1,
  },
  fullRadius: {
    borderRadius: 10,
  },
  radiusTop: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  radiusBottom: {
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  exposureList: {
    flexDirection: 'row',
  },
  boxFlex: {
    flex: 4,
  },
  chevronIcon: {
    alignItems: 'flex-end',
  },
  chevronIconBox: {
    flex: 0,
    justifyContent: 'center',
  },
  typeIconBox: {
    flex: 1,
    justifyContent: 'center',
  },
});
