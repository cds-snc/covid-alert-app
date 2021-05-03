import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useI18n} from 'locale';
import {CombinedExposureHistoryData, ExposureType} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon} from 'components';
import {formatExposedDate} from 'shared/date-fns';

export const ExposureList = ({exposureHistoryData}: {exposureHistoryData: CombinedExposureHistoryData[]}) => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const navigation = useNavigation();
  const onDetails = useCallback(
    ({id, exposureType}) => navigation.navigate('RecentExposureScreen', {id, exposureType}),
    [navigation],
  );
  exposureHistoryData.sort(function (first, second) {
    return second.timestamp - first.timestamp;
  });

  return (
    <>
      {exposureHistoryData.map((item, index) => {
        return (
          <Box key={item.timestamp}>
            <Box backgroundColor="gray5" style={styles.radius}>
              <Box paddingHorizontal="m" style={[exposureHistoryData.length !== index + 1 && styles.bottomBorder]}>
                <TouchableOpacity
                  style={styles.chevronIcon}
                  onPress={() => {
                    onDetails({id: `${item.id}-${item.timestamp}`, exposureType: item.type});
                  }}
                >
                  <Box paddingVertical="m" style={styles.exposureList}>
                    <Box style={styles.typeIconBox}>
                      <Icon
                        size={20}
                        name={item.type === ExposureType.Proximity ? 'exposure-proximity' : 'exposure-outbreak'}
                      />
                    </Box>
                    <Box style={styles.boxFlex}>
                      <Text fontWeight="bold">{formatExposedDate(new Date(item.timestamp), dateLocale)}</Text>
                      <Text>{item.subtitle}</Text>
                    </Box>
                    <Box style={styles.chevronIconBox}>
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
  radius: {
    borderRadius: 10,
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
    flex: 1,
    justifyContent: 'center',
  },
  typeIconBox: {
    flex: 1,
    justifyContent: 'center',
  },
});
