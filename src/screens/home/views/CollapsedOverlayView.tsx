import React, {useEffect} from 'react';
import {TouchableHighlight, View, StyleSheet} from 'react-native';
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
    <TouchableHighlight onPress={bottomSheetBehavior.expand}>
      <Animated.View style={{...styles.collapseContent, opacity: pow(bottomSheetBehavior.callbackNode, 2)}}>
        <View style={styles.collapseContentHandleBar}>
          <Icon name="sheet-handle-bar" size={36} />
        </View>
        <View style={styles.content}>
          <Box>
            <Box marginBottom="m">
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
                <Text variant="overlayTitle" color="overlayBodyText" accessibilityRole="header">
                  {i18n.translate('OverlayClosed.NotificationStatus')}
                </Text>
                <Text
                  variant="overlayTitle"
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
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
  },
  collapseContent: {
    position: 'absolute',
    width: '100%',
  },
  collapseContentHandleBar: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: -24,
  },
});
