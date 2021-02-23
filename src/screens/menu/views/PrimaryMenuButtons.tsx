import React from 'react';
import {Box} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';

import {PrimaryActionButton} from '../components/PrimaryActionButton';

export const PrimaryMenuButtons = () => {
  const i18n = useI18n();
  const {qrEnabled} = useStorage();
  const navigation = useNavigation();
  return (
    <>
      <Box marginBottom="m">
        <PrimaryActionButton
          icon="qr-code"
          text="Finish sharing exposures"
          onPress={() => {
            navigation.navigate('');
          }}
        />
      </Box>
      {qrEnabled && (
        <Box marginBottom="m">
          <PrimaryActionButton
            icon="qr-code"
            text={i18n.translate('QRCode.CTA')}
            onPress={() => {
              navigation.navigate('QRCodeFlow');
            }}
          />
        </Box>
      )}
      <Box marginBottom="m">
        <PrimaryActionButton
          icon="qr-code"
          text="Turn off COVID Alert"
          onPress={() => {
            navigation.navigate('');
          }}
        />
      </Box>
    </>
  );
};
