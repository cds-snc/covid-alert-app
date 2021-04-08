import React from 'react';
import {Box} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useCachedStorage} from 'services/StorageService';

import {PrimaryActionButton} from '../components/PrimaryActionButton';
import {OnOffButton} from '../components/OnOffButton';

import {ShareDiagnosisCode} from './ShareDiagnosisCode';

export const PrimaryMenuButtons = () => {
  const i18n = useI18n();
  const {qrEnabled} = useCachedStorage();
  const navigation = useNavigation();
  return (
    <>
      <ShareDiagnosisCode />
      {qrEnabled && (
        <Box marginBottom="s">
          <PrimaryActionButton
            icon="qr-code-icon"
            iconBackgroundColor="qrButton"
            text={i18n.translate('QRCode.CTA')}
            onPress={() => {
              navigation.navigate('QRCodeFlow');
            }}
          />
        </Box>
      )}
      <OnOffButton />
    </>
  );
};
