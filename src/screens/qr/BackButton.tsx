import React from 'react';

import {StyleSheet, Text, TextStyle, TouchableOpacity} from 'react-native';

import {Box, Icon, IconName} from 'components';

export interface ButtonSelectProps {
  text?: string;
  textStyles: TextStyle;
  onPress: () => void;
  disabled?: boolean;
  iconName?: IconName;
  testID?: string;
}

export const BackButton = ({text, textStyles, onPress, disabled, iconName}: ButtonSelectProps) => {
  const onPressHandler = onPress;

  const content = (
    <Box
      alignItems="center"
      justifyContent="flex-start"
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
      marginBottom="m"
    >
      <Box style={{...styles.iconOffset}}>{iconName && <Icon size={16} name={iconName} />}</Box>
      <Text style={{...textStyles}}>{text}</Text>
    </Box>
  );

  const accessibilityProps = {
    accessibilityRole: 'button' as 'button',
    accessibilityState: {disabled},
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPressHandler}
      style={styles.stretch}
      disabled={disabled}
      {...accessibilityProps}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
  },
  content: {
    textAlign: 'left',
  },
  iconOffset: {
    position: 'absolute',
    left: 0,
  },
});
