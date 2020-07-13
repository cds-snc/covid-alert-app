import React from 'react';
import {Box, Text, Icon} from 'components';
import {useI18n} from '@shopify/react-i18n';

export const BulletPointCheck = ({listAccessibile, text}: {listAccessibile: string; text: string}) => {
  const [i18n] = useI18n();

  let bulletLabel;
  let textLabel;

  switch (listAccessibile) {
    case 'listStart':
      bulletLabel = `${i18n.translate(`A11yList.Bullet`)} \n ${i18n.translate(`A11yList.Start`)}`;
      break;

    case 'listEnd':
      bulletLabel = i18n.translate(`A11yList.Bullet`);
      textLabel = `${text} ${i18n.translate(`A11yList.End`)}`;
      break;

    case 'item':
      bulletLabel = i18n.translate(`A11yList.Bullet`);
      break;
  }

  return (
    <Box flexDirection="row" marginBottom="s">
      <Box accessible accessibilityLabel={bulletLabel} marginTop="xxs" flex={0}>
        <Icon size={20} name="icon-green-check" />
      </Box>
      <Box flex={1}>
        <Text accessibilityLabel={textLabel} variant="bodyText" color="overlayBodyText" marginLeft="m">
          {text}
        </Text>
      </Box>
    </Box>
  );
};
