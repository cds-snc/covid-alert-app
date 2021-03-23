import React from 'react';
import {Box, Text, Icon} from 'components';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Region} from 'shared/Region';

interface RegionItemProps {
  code: Region;
  name: string;
  selected: boolean;
  lastItem?: boolean;
  onPress: (code: Region) => void;
  testID?: string;
}

export const regionData: Array<Omit<RegionItemProps, 'onPress' | 'selected' | 'name'>> = [
  {code: 'AB'},
  {code: 'BC'},
  {code: 'MB'},
  {code: 'NB'},
  {code: 'NL'},
  {code: 'NT'},
  {code: 'NS'},
  {code: 'NU'},
  {code: 'ON'},
  {code: 'PE'},
  {code: 'QC'},
  {code: 'SK'},
  {code: 'YT'},
  {code: 'None'},
];

const RegionItem_ = ({code, onPress, name, lastItem, selected, testID}: RegionItemProps) => (
  <>
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(code)}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      testID={testID}
    >
      <Box
        paddingVertical="m"
        marginHorizontal="-m"
        paddingHorizontal="m"
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
        backgroundColor="infoBlockNeutralBackground"
        borderRadius={5}
      >
        <Text variant="bodyText" color="overlayBodyText" marginHorizontal="s">
          {name}
        </Text>
        <Box alignSelf="center">{selected && <Icon size={25} name="icon-check" />}</Box>
      </Box>
    </TouchableOpacity>
    {!lastItem && <Box height={5} marginHorizontal="-m" backgroundColor="overlayBackground" />}
  </>
);
export const RegionItem = React.memo(RegionItem_);

export const regionStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
