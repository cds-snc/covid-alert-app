import React from 'react';
import {Theme} from 'shared/theme';

import {Box} from './Box';
import {Button} from './Button';
import {Icon, IconProps} from './Icon';
import {Text} from './Text';

export interface InfoBlockProps {
  icon?: IconProps['name'];
  text: string;
  title?: string;
  titleBolded?: string;
  color: keyof Theme['colors'];
  backgroundColor: keyof Theme['colors'];
  button: {
    text: string;
    action: () => void;
  };
}

export const InfoBlock = ({
  icon,
  text,
  button: {text: buttonText, action},
  color,
  backgroundColor,
  title,
  titleBolded,
}: InfoBlockProps) => {
  return (
    <Box borderRadius={10} backgroundColor={backgroundColor} padding="m" alignItems="flex-start">
      {icon && (
        <Box marginBottom="m">
          <Icon name={icon} size={24} />
        </Box>
      )}
      {(title || titleBolded) && (
        <Box marginBottom="m" justifyContent="flex-start" flexDirection="row" flexWrap="wrap">
          {title && (
            <Text variant="overlayTitle" accessibilityRole="header" color={color}>
              {title}
            </Text>
          )}
          {titleBolded && (
            <Text
              variant="overlayTitle"
              accessibilityRole="header"
              color={color}
              fontFamily="Noto Sans"
              fontWeight="bold"
            >
              {titleBolded}
            </Text>
          )}
        </Box>
      )}
      <Text variant="bodyText" fontSize={16} color={color} marginBottom="m">
        {text}
      </Text>
      <Box marginHorizontal="none" alignSelf="stretch">
        <Button text={buttonText} onPress={action} variant="bigFlat" color={color} />
      </Box>
    </Box>
  );
};
