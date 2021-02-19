import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

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
  return (
    <Box style={styles.content} paddingVertical="s">
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
};
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
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
});
