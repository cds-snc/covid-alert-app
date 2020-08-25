import React from 'react';
import {Box, Text, TextMultiline, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';

export const NLView = () => {
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(true);
  const onClick = () =>
    Linking.openURL(i18n.translate('DataUpload.NoCode.RegionCovered.NL.Link')).catch(error =>
      captureException('An error occurred', error),
    );
  return (
    <Box>
      <Text
        testID="noCodeHeader"
        focusRef={autoFocusRef}
        variant="bodyTitle"
        marginBottom="l"
        accessibilityRole="header"
      >
        {i18n.translate('RegionContent.NoCode.Active.NL.Title')}
      </Text>
      <TextMultiline marginBottom="l" text={i18n.translate('RegionContent.NoCode.Active.NL.Body')} />
      <ButtonSingleLine
        testID="noCodeCTA"
        variant="bigFlat"
        text={i18n.translate('RegionContent.NoCode.Active.NL.CTA')}
        onPress={onClick}
        externalLink
      />
    </Box>
  );
};
