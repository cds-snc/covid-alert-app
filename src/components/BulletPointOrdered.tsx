import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

interface OrderedListProps {
  text: string;
  key: string;
  orderedListChar: string;
  listAccessibile: string;
}

export const BulletPointOrdered = ({orderedListChar, text, listAccessibile}: OrderedListProps) => {
  const [i18n] = useI18n();

  let orderedListLabel;
  let textLabel;

  switch (listAccessibile) {
    case 'listStart':
      orderedListLabel = `${orderedListChar} \n ${i18n.translate(`A11yList.Start`)}`;
      break;

    case 'listEnd':
      orderedListLabel = orderedListChar;
      textLabel = `${text} ${i18n.translate(`A11yList.End`)}`;
      break;

    case 'item':
      orderedListLabel = orderedListChar;
      break;
  }

  return (
    <Box flexDirection="row" marginRight="m">
      <Box marginBottom="l">
        <Text accessible accessibilityLabel={orderedListLabel} variant="bodyText" color="bodyText">
          {orderedListChar}
        </Text>
      </Box>
      <Text accessibilityLabel={textLabel} variant="bodyText" color="bodyText" marginLeft="s" marginBottom="l">
        {text}
      </Text>
    </Box>
  );
};
