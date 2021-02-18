import React from 'react';
import {StyleSheet} from 'react-native';
import {Box, Icon, Button} from 'components';
import {useI18n} from 'locale';

export const CollapsedMenuView = () => {
  const i18n = useI18n();
  return (
    <Box style={styles.content}>
      <Box marginBottom="s" marginLeft="m" paddingLeft="s" style={styles.scanBox} backgroundColor="buttonGrey">
        <Box marginTop="m" paddingLeft="s">
          <Icon size={25} name="qr-code-icon" />
        </Box>
        <Button text={i18n.translate('QRCode.CTA')} variant="bigFlatNeutralGrey" onPress={() => {}} />
      </Box>
      <Box marginBottom="s" marginRight="m" paddingLeft="s" style={styles.menuBox} backgroundColor="buttonGrey">
        <Box paddingTop="m" paddingLeft="s">
          <Icon size={25} name="hamburger-menu" />
        </Box>

        <Button text="Menu" variant="bigFlatNeutralGrey" onPress={() => {}} />
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  scanBox: {
    flexDirection: 'row',
    width: '58%',
    borderRadius: 5,
  },
  menuBox: {
    flexDirection: 'row',
    width: '30%',
    borderRadius: 5,
  },
});
