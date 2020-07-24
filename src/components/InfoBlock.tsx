import React from 'react';
import {Theme} from 'shared/theme';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

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
  showButton?: boolean;
  focusOnTitle?: boolean;
}

export const InfoBlock = ({
  icon,
  text,
  button: {text: buttonText, action},
  color,
  backgroundColor,
  title,
  titleBolded,
  showButton,
  focusOnTitle,
}: InfoBlockProps) => {
  const autoFocusRef = useAccessibilityAutoFocus(focusOnTitle);
  return (
    <Box
      borderRadius={10}
      backgroundColor={backgroundColor}
      borderWidth={1}
      borderColor="gray2"
      padding="m"
      alignItems="flex-start"
    >
      {icon && (
        <Box marginBottom="s">
          <Icon name={icon} size={24} />
        </Box>
      )}
      {(title || titleBolded) && (
        <Box marginBottom="s" justifyContent="center" flexDirection="row" flexWrap="wrap">
          <Text
            focusRef={focusOnTitle ? autoFocusRef : null}
            variant="menuItemTitle"
            accessibilityRole="header"
            textAlign="center"
          >
            {title && <Text color={color}>{title}</Text>}
            {titleBolded && (
              <Text color={color} variant="menuItemTitle" fontWeight="bold">
                {titleBolded}
              </Text>
            )}
          </Text>
        </Box>
      )}
      <Text variant="bodyText" color={color}>
        {text}
      </Text>
      {showButton ? (
        <Box marginTop="m" marginHorizontal="none" alignSelf="stretch">
          <Button text={buttonText} onPress={action} variant="thinFlat" color={color} />
        </Box>
      ) : null}
    </Box>
  );
};

InfoBlock.defaultProps = {
  showButton: true,
};
