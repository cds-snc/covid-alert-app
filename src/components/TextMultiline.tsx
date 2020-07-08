import React from 'react';
import {Text} from 'components';
import {TextProps} from '@shopify/restyle';
import {Theme} from 'shared/theme/default';

interface TextMultilineProps extends TextProps<Theme> {
  text: string;
}

export const TextMultiline = ({text, ...props}: TextMultilineProps) => {
  const textSplit = text.split(/\n\n/g);
  return (
    <>
      {textSplit.map(t => (
        <Text key={t} {...props}>
          {t}
        </Text>
      ))}
    </>
  );
};
