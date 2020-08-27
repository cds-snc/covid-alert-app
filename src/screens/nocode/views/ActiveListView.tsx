import React from 'react';
import {Box, Text, TextMultiline, ButtonSingleLine} from 'components';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {BulletPointOrdered} from 'components/BulletPointOrdered';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';
import {useRegionalI18n} from 'locale/regional';

export const ActiveListView = () => {
  const regionalI18n = useRegionalI18n();
  const {region} = useStorage();
  const autoFocusRef = useAccessibilityAutoFocus(true);
  const onClick = () =>
    Linking.openURL(regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Link`)).catch(error =>
      captureException('An error occurred', error),
    );

  const coveredList = [
    {
      number: '1.',
      listAccessibile: 'listStart',
      text: regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body2`),
    },
    {
      number: '2.',
      listAccessibile: 'item',
      text: regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body3`),
    },
    {
      number: '3.',
      listAccessibile: 'item',
      text: regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body4`),
    },
    {
      number: '4.',
      listAccessibile: 'listEnd',
      text: regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body5`),
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
        {regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Title`)}
      </Text>
      <TextMultiline marginBottom="l" text={regionalI18n.translate(`RegionContent.NoCode.Active.${region}.Body`)} />
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
        text={regionalI18n.translate(`RegionContent.NoCode.Active.${region}.CTA`)}
        onPress={onClick}
        externalLink
      />
    </Box>
  );
};
