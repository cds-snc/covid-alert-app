import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Button, Box} from 'components';

export const NextButton = ({onNext}: {onNext: any}) => {
  const [i18n] = useI18n();
  return (
    <Box paddingHorizontal="l" alignItems="center" justifyContent="center" flexDirection="row" marginBottom="l">
      <Box flex={1}>
        <Button text={i18n.translate('Onboarding.ActionNext')} variant="thinFlat" onPress={onNext} />
      </Box>
    </Box>
  );
};
