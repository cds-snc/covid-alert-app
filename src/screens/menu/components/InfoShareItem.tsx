import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';

interface InfoShareItemProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  icon: IconProps['name'];
}

export const InfoShareItem = ({onPress, text, icon, ...touchableProps}: InfoShareItemProps) => (
  <Box marginBottom="s">
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} accessibilityRole="button" {...touchableProps}>
      <Box
        paddingVertical="s"
        paddingHorizontal="m"
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
        backgroundColor="infoBlockNeutralBackground"
        borderRadius={8}
      >
        <Box flex={1}>
          <Text variant="bodyText" marginVertical="s" color="overlayBodyText">
            {text}
          </Text>
        </Box>

        <Box alignSelf="center">
          <Icon size={25} name={icon} />
        </Box>
      </Box>
    </TouchableOpacity>
  </Box>
);
