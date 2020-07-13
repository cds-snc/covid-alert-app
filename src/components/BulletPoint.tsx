import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

interface BulletPointProps {
  text: string;
  key: string;
  listAccessibile: string;
  sectionContent: string;
}

export const BulletPoint = ({text, listAccessibile, sectionContent}: BulletPointProps) => {
  const bullet = '\u25CF';
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
    <Box flexDirection="row">
      <Box marginRight="xs">
        <Text
          accessible
          accessibilityLabel={bulletLabel}
          variant={sectionContent === 'priv' ? 'xtraSmallText' : 'bodyText'}
          color="bodyText"
        >
          {bullet}
        </Text>
      </Box>
      <Text
        accessibilityLabel={textLabel}
        variant={sectionContent === 'priv' ? 'xtraSmallText' : 'bodyText'}
        color="bodyText"
      >
        {text}
      </Text>
    </Box>
  );
};
