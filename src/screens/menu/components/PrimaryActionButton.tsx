import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, StyleSheet} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';
import {Theme} from 'shared/theme';

interface PrimaryActionButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  iconBackgroundColor: keyof Theme['colors'];
  icon: IconProps['name'];
  showChevron?: boolean;
}

export const PrimaryActionButton = ({
  onPress,
  text,
  icon,
  iconBackgroundColor,
  showChevron = true,
  ...touchableProps
}: PrimaryActionButtonProps) => (
  <>
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} accessibilityRole="button" {...touchableProps}>
      <Box
        flexDirection="row"
        style={styles.boxPad}
        alignContent="flex-start"
        justifyContent="flex-start"
        backgroundColor="infoBlockNeutralBackground"
        borderRadius={10}
      >
        <Box backgroundColor={iconBackgroundColor} borderRadius={8} marginRight="s" justifyContent="center" padding="s">
          <Icon name={icon} size={35} />
        </Box>
        <Box flex={1} justifyContent="center">
          <Text variant="bodyText" color="overlayBodyText" marginVertical="s">
            {text}
          </Text>
        </Box>
        {showChevron ? (
          <Box alignSelf="center">
            <Icon size={25} name="icon-chevron" />
          </Box>
        ) : null}
      </Box>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  boxPad: {
    padding: 3,
    paddingRight: 15,
  },
});
