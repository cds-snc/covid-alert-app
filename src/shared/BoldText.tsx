import React from 'react';
import {Text} from 'components';

export const BoldText = (input: string) => {
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
