import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Icon, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

const borderRadius = 16;

export const CollapsedMenuView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const openMenu = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);

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

        <Button text="Menu" variant="bigFlatNeutralGrey" onPress={openMenu} />
      </Box>
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'space-between',
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
  scanBox: {
    flexDirection: 'row',
    width: '58%',
    borderRadius: 8,
  },
  menuBox: {
    flexDirection: 'row',
    width: '30%',
    borderRadius: 8,
  },
});
