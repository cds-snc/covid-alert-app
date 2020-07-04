import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Box, Text} from 'components';

export const StepText = ({index}: {index: number}) => {
  const [i18n] = useI18n();
  const total = 6;
  const stepText = i18n.translate('Onboarding.Step');
  const ofText = i18n.translate('Onboarding.Of');
  const text = `${stepText} ${index} ${ofText} ${total}`;
  return (
    <Box paddingVertical="m" alignItems="center">
      <Text color="gray2">{text}</Text>
    </Box>
  );
};
