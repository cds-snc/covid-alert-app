import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Box, ButtonWrapper, Icon, Text} from 'components';
import {StyleSheet} from 'react-native';

export const QrButton = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const openScan = useCallback(() => {
    navigation.navigate('QRCodeFlow');
  }, [navigation]);

  return (
    <ButtonWrapper color="qrButton" borderRadius={8} onPress={openScan}>
      <Box style={styles.box}>
        <Box marginRight="s">
          <Icon name="qr-code-icon" size={25} />
        </Box>
        <Box flex={1}>
          <Text>{i18n.translate('QRCode.CTA')}</Text>
        </Box>
      </Box>
    </ButtonWrapper>
  );
};

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
