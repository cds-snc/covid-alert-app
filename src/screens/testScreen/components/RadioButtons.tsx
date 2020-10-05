import React from 'react';
import {Box, Text, Icon} from 'components';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface Props {
  value: string;
  name: string;
  selected: boolean;
  testID?: string;
  onPress: (value: string) => void;
}

const RadioButton_ = ({value, onPress, name, selected, testID}: Props) => (
  <>
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(value)}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      testID={testID}
    >
      <Box paddingVertical="s" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" paddingVertical="s">
          <Text variant="bodyText" color="overlayBodyText" marginHorizontal="m">
            {name}
          </Text>
        </Box>
        <Box alignSelf="center">{selected && <Icon size={32} name="icon-check" />}</Box>
      </Box>
    </TouchableOpacity>
    <Box height={1} marginHorizontal="-m" backgroundColor="overlayBackground" />
  </>
);
export const RadioButton = React.memo(RadioButton_);

export const radioStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
