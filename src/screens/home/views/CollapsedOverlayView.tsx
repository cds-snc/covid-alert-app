import React, {useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import Animated, {pow} from 'react-native-reanimated';
import {Box, Text, BottomSheetBehavior, Icon} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {SystemStatus} from 'services/ExposureNotificationService';

import {StatusHeaderView} from './StatusHeaderView';

interface Props {
  status: SystemStatus;
  notificationWarning: boolean;
  turnNotificationsOn(): void;
  bottomSheetBehavior: BottomSheetBehavior;
}

export const CollapsedOverlayView = ({status, notificationWarning, bottomSheetBehavior}: Props) => {
  const [i18n] = useI18n();

  useEffect(() => {
    bottomSheetBehavior.refreshSnapPoints(notificationWarning);
  }, [notificationWarning, bottomSheetBehavior]);

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={bottomSheetBehavior.expand}>
      <Animated.View style={{opacity: pow(bottomSheetBehavior.callbackNode, 2)}}>
        <View style={styles.content}>
          <View style={styles.collapseContentHandleBar}>
            <Icon name="sheet-handle-bar" size={36} />
          </View>
          <Box>
            <Box marginBottom="s">
              <StatusHeaderView enabled={status === SystemStatus.Active} />
            </Box>
            {notificationWarning && (
              <Box
                backgroundColor="infoBlockNeutralBackground"
                borderRadius={10}
                padding="m"
                flex={1}
                marginBottom="xs"
                marginHorizontal="m"
                justifyContent="center"
                flexDirection="row"
              >
                <Text variant="menuItemTitle" color="overlayBodyText" accessibilityRole="header">
                  {i18n.translate('OverlayClosed.NotificationStatus')}
                </Text>
                <Text
                  variant="menuItemTitle"
                  color="overlayBodyText"
                  fontFamily="Noto Sans"
                  fontWeight="bold"
                  accessibilityRole="header"
                >
                  {i18n.translate('OverlayClosed.NotificationStatusOff')}
                </Text>
              </Box>
            )}
            <Text variant="smallText" color="bodyTextSubdued" textAlign="center">
              {i18n.translate('OverlayClosed.TapPrompt')}
            </Text>
          </Box>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  collapseContentHandleBar: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: -24,
  },
});
