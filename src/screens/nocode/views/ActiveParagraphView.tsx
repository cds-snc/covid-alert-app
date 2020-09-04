import React from 'react';
import {Box, Text, TextMultiline, ButtonSingleLine} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';
import {useStorage} from 'services/StorageService';
import {useRegionalI18n} from 'locale/regional';

export const ActiveParagraphView = () => {
  const regionalI18n = useRegionalI18n();
  const {region} = useStorage();
  const autoFocusRef = useAccessibilityAutoFocus(true);
  const buttonCTA = regionalI18n.translate(`RegionContent.NoCode.Active.${region}.CTA`);
  const onClick = () =>
    Linking.openURL(regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Link`)).catch(error =>
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
        {regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Title`)}
      </Text>
      <TextMultiline marginBottom="l" text={regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body`)} />
      {buttonCTA !== '' && (
        <ButtonSingleLine
          testID="noCodeCTA"
          variant="bigFlat"
          text={regionalI18n.translate(`RegionContent.NoCode.Active.${region}.CTA`)}
          onPress={onClick}
          externalLink
        />
      )}
    </Box>
  );
};
