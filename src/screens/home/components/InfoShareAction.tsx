import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Box, Text, Icon, IconProps} from 'components';

interface InfoShareItemProps extends TouchableOpacityProps {
  onPress: () => void;
  text: string;
  icon: IconProps['name'];
  lastItem?: boolean;
}

export const InfoShareAction = ({onPress, text, icon, lastItem, ...touchableProps}: InfoShareItemProps) => (
  <>
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} accessibilityRole="button" {...touchableProps}>
      <Box
        paddingVertical="s"
        paddingHorizontal="m"
        flexDirection="row"
        alignContent="flex-start"
        justifyContent="flex-start"
        backgroundColor="infoBlockNeutralBackground"
        borderRadius={5}
      >
        <Box paddingRight="s">
          <Icon name="qr-code" size={50} />
        </Box>
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
    {!lastItem && <Box height={5} marginHorizontal="-m" backgroundColor="overlayBackground" />}
  </>
);
