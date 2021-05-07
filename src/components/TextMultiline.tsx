import React from 'react';
import {Text} from 'components';
import {TextProps} from '@shopify/restyle';
import {Theme} from 'shared/theme/default';
import {BoldText} from 'shared/BoldText';

interface TextMultilineProps extends TextProps<Theme> {
  text: string;
  detectBold?: boolean;
}

export const TextMultiline = ({text, detectBold, ...props}: TextMultilineProps) => {
  const textSplit = text.split(/\n\n/g);
  return (
    <>
      {textSplit.map(t => (
        <Text key={t} {...props}>
          {detectBold ? BoldText(t) : t}
        </Text>
      ))}
    </>
  );
};
