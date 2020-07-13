import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

interface NumberListProps {
  text: string;
  key: string;
  number: string;
  listAccessibile: string;
}

export const NumberListItem = ({number, text, listAccessibile}: NumberListProps) => {
  const [i18n] = useI18n();

  let numberLabel;
  let textLabel;

  switch (listAccessibile) {
    case 'listStart':
      numberLabel = `${number} \n ${i18n.translate(`A11yList.Start`)}`;
      break;

    case 'listEnd':
      numberLabel = number;
      textLabel = `${text} ${i18n.translate(`A11yList.End`)}`;
      break;

    case 'item':
      numberLabel = number;
      break;
  }

  return (
    <Box flexDirection="row" marginRight="m">
      <Box marginBottom="l">
        <Text accessible accessibilityLabel={numberLabel} variant="bodyText" color="bodyText">
          {number}
        </Text>
      </Box>
      <Text accessibilityLabel={textLabel} variant="bodyText" color="bodyText" marginLeft="s" marginBottom="l">
        {text}
      </Text>
    </Box>
  );
};
