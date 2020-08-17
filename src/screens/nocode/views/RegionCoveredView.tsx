import React from 'react';
import {Box, Text, TextMultiline, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {BulletPointOrdered} from 'components/BulletPointOrdered';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';

export const RegionCoveredView = () => {
  const i18n = useI18n();
  const {region} = useStorage();
  const autoFocusRef = useAccessibilityAutoFocus(true);
  const onClick = () =>
    Linking.openURL(i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Link`)).catch(error =>
      captureException('An error occurred', error),
    );

  const coveredList = [
    {
      number: '1.',
      listAccessibile: 'listStart',
      text: i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Body2`),
    },
    {
      number: '2.',
      listAccessibile: 'item',
      text: i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Body3`),
    },
    {
      number: '3.',
      listAccessibile: 'item',
      text: i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Body4`),
    },
    {
      number: '4.',
      listAccessibile: 'listEnd',
      text: i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Body5`),
    },
  ];
  return (
    <Box>
      <Text
        testID="noCodeHeader"
        focusRef={autoFocusRef}
        variant="bodyTitle"
        marginBottom="l"
        accessibilityRole="header"
      >
        {i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Title`)}
      </Text>
      <TextMultiline marginBottom="l" text={i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Body`)} />
      {coveredList.map(item => (
        <BulletPointOrdered
          key={item.text}
          orderedListChar={item.number}
          listAccessibile={item.listAccessibile}
          text={item.text}
        />
      ))}
      <ButtonSingleLine
        testID="noCodeCTA"
        variant="bigFlat"
        text={i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.CTA`)}
        onPress={onClick}
        externalLink
      />
    </Box>
  );
};
