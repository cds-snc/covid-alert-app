import React from 'react';
import {Box, Text, Icon} from 'components';
import {useI18n} from '@shopify/react-i18n';

export const BulletPointX = ({listAccessibile, text}: {listAccessibile: string; text: string}) => {
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
    <Box flexDirection="row" marginBottom="m">
      <Box accessible accessibilityLabel={bulletLabel} marginTop="xxs">
        <Icon size={20} name="icon-x" />
      </Box>
      <Text accessibilityLabel={textLabel} variant="bodyText" color="overlayBodyText" marginLeft="m">
        {text}
      </Text>
    </Box>
  );
};
