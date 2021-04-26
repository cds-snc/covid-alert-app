import React from 'react';
import {Text} from 'components';
import {TextProps} from '@shopify/restyle';
import {Theme} from 'shared/theme/default';

interface TextMultilineProps extends TextProps<Theme> {
  text: string;
  detectBold?: boolean;
}

export const boldText = (input: string) => {
  const boldPattern = /\*\*(.*?)\*\*/gm;
  const textSplit = input.split(boldPattern);

  /* no match just return */
  if (textSplit.length < 3) return input;

  /* wrap Text element if it's "the middle" item i.e. index 1*/
  return (
    <>
      {textSplit.map((t, index) =>
        index === 1 ? (
          <Text key={t} fontWeight="bold">
            {t}
          </Text>
        ) : (
          t
        ),
      )}
    </>
  );
};

export const TextMultiline = ({text, detectBold, ...props}: TextMultilineProps) => {
  const textSplit = text.split(/\n\n/g);
  return (
    <>
      {textSplit.map(t => (
        <Text key={t} {...props}>
          {detectBold ? boldText(t) : t}
        </Text>
      ))}
    </>
  );
};
