import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useSystemStatus} from 'services/ExposureNotificationService';

import {CollapsedOverlayView} from './CollapsedOverlayView';

const borderRadius = 16;

export const CollapsedMenuView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const openMenu = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);
  const openScan = useCallback(() => {
    navigation.navigate('QRCodeFlow');
  }, [navigation]);
  const [systemStatus] = useSystemStatus();

  const content1 = (
    <Box style={styles.box}>
      <Box marginHorizontal="m">
        <Button
          text={i18n.translate('QRCode.CTA')}
          variant="bigFlatNeutralGrey"
          onPress={openScan}
          iconNameLeft="qr-code-icon"
          borderRadius={8}
        />
      </Box>
      <Box marginHorizontal="m">
        <Button
          text="Menu"
          variant="bigFlatNeutralGrey"
          onPress={openMenu}
          iconNameLeft="hamburger-menu"
          borderRadius={8}
        />
      </Box>
    </Box>
  );
  const content2 = <CollapsedOverlayView status={systemStatus} notificationWarning={false} />;
  return (
    <Box style={styles.content} paddingVertical="s">
      {content2}
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {
    width: '100%',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
