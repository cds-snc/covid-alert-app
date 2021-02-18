import React, {useCallback} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Box, Text, Icon} from 'components';
import {useI18n} from 'locale';
import {SystemStatus} from 'services/ExposureNotificationService';
import {useNavigation} from '@react-navigation/native';

import {StatusHeaderView} from './StatusHeaderView';

interface Props {
  status: SystemStatus;
  notificationWarning: boolean;
  turnNotificationsOn(): void;
}

export const CollapsedOverlayView = ({status, notificationWarning}: Props) => {
  const i18n = useI18n();
  const navigation = useNavigation();

  const menuPress = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={menuPress}>
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
              <Text variant="menuItemTitle" color="overlayBodyText" fontWeight="bold" accessibilityRole="header">
                {i18n.translate('OverlayClosed.NotificationStatusOff')}
              </Text>
            </Box>
          )}
          <Text variant="smallText" color="bodyTextSubdued" textAlign="center" testID="tapPromptCollapsed">
            {i18n.translate('OverlayClosed.TapPrompt')}
          </Text>
        </Box>
      </View>
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
