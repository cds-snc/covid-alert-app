import React from 'react';
import {Text, Box} from 'components';
import {useI18n} from 'locale';
import {StyleSheet} from 'react-native';

import {ItemView, ItemViewProps} from './ItemView';

const Banner = () => {
  const i18n = useI18n();
  return (
    <Box style={{...styles.banner}} marginBottom="l">
      <Text>{i18n.translate('QRCodeOnboarding.step-4-banner')}</Text>
    </Box>
  );
};

export const Step4 = (props: Pick<ItemViewProps, 'isActive'>) => {
  return (
    <>
      <ItemView {...props} item="step-4" image={require('assets/qr-code-onboard-3.png')} />
      <Banner />
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderLeftColor: '#003678',
    borderLeftWidth: 5,
    width: '100%',
    padding: 15,
    backgroundColor: '#DAEEFE',
  },
});
