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
    <Box marginBottom="m">
      <Box marginBottom="s">
        <PrimaryActionButton
          icon="otk-entry"
          text="Finish sharing exposures"
          onPress={() => {
            navigation.navigate('');
          }}
        />
      </Box>
      {qrEnabled && (
        <Box marginBottom="s">
          <PrimaryActionButton
            icon="qr-code"
            text={i18n.translate('QRCode.CTA')}
            onPress={() => {
              navigation.navigate('QRCodeFlow');
            }}
          />
        </Box>
      )}
      <Box marginBottom="s">
        <PrimaryActionButton
          icon="turn-off"
          text="Turn off COVID Alert"
          onPress={() => {
            navigation.navigate('');
          }}
          showChevron={false}
        />
      </Box>
    </Box>
  );
};
