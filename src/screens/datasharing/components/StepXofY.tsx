import React from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';

export interface StepXofYProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepXofY = ({currentStep, totalSteps = 3}: StepXofYProps) => {
  const i18n = useI18n();
  return (
    <Text marginBottom="s" variant="bodyText" color="gray1Text">
      {i18n.translate('DataUpload.StepXofY', {x: currentStep, y: totalSteps})}
    </Text>
  );
};
