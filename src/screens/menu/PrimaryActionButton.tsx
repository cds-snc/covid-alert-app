import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, StyleSheet} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';

interface PrimaryActionButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  icon: IconProps['name'];
  lastItem?: boolean;
}

export const PrimaryActionButton = ({onPress, text, icon, lastItem, ...touchableProps}: PrimaryActionButtonProps) => (
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
        <Box paddingRight="s">
          <Icon name={icon} size={50} />
        </Box>
        <Box flex={1} justifyContent="center">
          <Text variant="bodyText" color="overlayBodyText">
            {text}
          </Text>
        </Box>

        <Box alignSelf="center">
          <Icon size={25} name="icon-chevron" />
        </Box>
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
