import React from 'react';
import {useTheme} from '@shopify/restyle';
import {Box, Ripple, Text} from 'components';
import {Theme} from 'shared/theme';

export interface ItemProps {
  title: string;
  subtitle?: string;
  onPress?(): void;
  connectedRight?: React.ReactElement | string;
}

export const Item = ({title, subtitle, onPress, connectedRight}: ItemProps) => {
  const theme = useTheme<Theme>();
  const connectedRightElement =
    typeof connectedRight === 'string' ? (
      <Text color="overlayBodyText" {...theme.textVariants.menuItemTitle}>
        {connectedRight}
      </Text>
    ) : (
      connectedRight
    );

  const content = (
    <Box flexDirection="row" height={48} alignItems="center" paddingHorizontal="m">
      <Box flex={1}>
        <Text color="overlayBodyText" {...theme.textVariants.menuItemTitle}>
          {title}
        </Text>
        {subtitle && (
          <Text color="bodyTextSubdued" {...theme.textVariants.menuItemSubtitle}>
            {subtitle}
          </Text>
        )}
      </Box>
      {connectedRightElement}
    </Box>
  );

  if (!onPress) {
    return content;
  }

  return <Ripple onPress={onPress}>{content}</Ripple>;
};
