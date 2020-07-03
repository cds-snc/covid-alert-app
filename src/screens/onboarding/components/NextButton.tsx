import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Button, Box} from 'components';

export const NextButton = ({onNext, isEnd, isRegionSet}: {onNext: any; isEnd?: boolean; isRegionSet?: boolean}) => {
  const [i18n] = useI18n();

  let endText = 'EndSkip';
  let endBtnStyle = '';

  if (isEnd && isRegionSet) {
    endText = 'End';
    endBtnStyle = 'ready';
  }

  return (
    <Box paddingHorizontal="l" alignItems="center" justifyContent="center" flexDirection="row" marginBottom="l">
      <Box flex={1}>
        {isEnd ? (
          <Button
            text={i18n.translate(`Onboarding.Action${endText}`)}
            variant={endBtnStyle === 'ready' ? 'thinFlat' : 'thinFlatNeutralGrey'}
            onPress={onNext}
          />
        ) : (
          <Button text={i18n.translate('Onboarding.ActionNext')} variant="thinFlat" onPress={onNext} />
        )}
      </Box>
    </Box>
  );
};
