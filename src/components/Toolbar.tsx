import React, {useEffect} from 'react';
import {BackHandler, Platform, StyleSheet} from 'react-native';

import {Box} from './Box';
import {Button} from './Button';
import {IconProps} from './Icon';
import {Text} from './Text';

export interface ToolbarProps {
  title: string;
  onIconClicked(): void;
  navText?: string /* iOS only */;
  navIcon?: IconProps['name'] /* Android only */;
  navLabel?: string;
  accessibilityTitleAutoFocus?: boolean;
}

export const Toolbar = ({title, navText, onIconClicked, accessibilityTitleAutoFocus}: ToolbarProps) => {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onIconClicked();
      return true;
    });
    return () => subscription.remove();
  }, [onIconClicked]);

  return (
    <Box flexDirection="row" alignItems="center" minHeight={56}>
      <Box>
        <Button text={navText} variant="text" onPress={onIconClicked} />
      </Box>
      {title !== '' && (
        <Box flex={1} justifyContent="center" minWidth={100}>
          <Text
            variant="bodySubTitle"
            color="overlayBodyText"
            textAlign="center"
            accessibilityAutoFocus={accessibilityTitleAutoFocus}
          >
            {title}
          </Text>
        </Box>
      )}
      <Box style={styles.invisible}>
        <Button disabled text={navText} variant="text" onPress={() => {}} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  invisible: {
    opacity: 0,
  },
});
