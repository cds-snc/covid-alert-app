import React, {useCallback} from 'react';
import Animated, {sub, abs} from 'react-native-reanimated';
import {useNetInfo} from '@react-native-community/netinfo';
import {Box, InfoBlock, BoxProps, InfoButton, BottomSheetBehavior, Icon} from 'components';
import {useI18n, I18n} from 'locale';
import {Linking, Platform, TouchableOpacity, StyleSheet, View} from 'react-native';
import {
  ExposureStatusType,
  SystemStatus,
  useExposureStatus,
  useStartExposureNotificationService,
} from 'services/ExposureNotificationService';
import {useNavigation} from '@react-navigation/native';
import {getUploadDaysLeft} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {ScrollView} from 'react-native-gesture-handler';
import {useAccessibilityService} from 'services/AccessibilityService';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {QR_ENABLED} from 'env';

import {PrimaryActionButton} from '../components/PrimaryActionButton';

import {InfoShareView} from './InfoShareView';
import {StatusHeaderView} from './StatusHeaderView';

const QRCode = ({i18n, bottomSheetBehavior}: {i18n: I18n; bottomSheetBehavior: BottomSheetBehavior}) => {
  const navigation = useNavigation();
  return (
    <PrimaryActionButton
      icon="qr-code"
      text={i18n.translate('QRCode.CTA')}
      onPress={() => {
        bottomSheetBehavior.collapse();
        navigation.navigate('QRCodeFlow');
      }}
    />
  );
};

interface Props extends Pick<BoxProps, 'maxWidth'> {
  bottomSheetBehavior: BottomSheetBehavior;
  status: SystemStatus;
}

export const ExpandedMenuView = ({status, bottomSheetBehavior}: Props) => {
  const i18n = useI18n();
  return (
    <Animated.View style={{opacity: abs(sub(bottomSheetBehavior.callbackNode, 1))}}>
      <Box>
        <Box marginBottom="xl" style={styles.headerBox}>
          <Box paddingLeft="l">
            <StatusHeaderView enabled={status === SystemStatus.Active} />
          </Box>

          <Box>
            <TouchableOpacity activeOpacity={0.8} onPress={bottomSheetBehavior.collapse}>
              <Icon size={40} name="expanded-menu-close" />
            </TouchableOpacity>
          </Box>
        </Box>
        <Box>
          {QR_ENABLED && (
            <Box marginBottom="m" marginHorizontal="m">
              <QRCode bottomSheetBehavior={bottomSheetBehavior} i18n={i18n} />
            </Box>
          )}
        </Box>
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: -26,
  },
  collapseButton: {
    // height: 48,
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // marginBottom: -10,
    // right: 0,
    // backgroundColor: 'blue',
  },
  headerBox: {
    // flex: 1,
    flexDirection: 'row',
    // paddingTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
});
