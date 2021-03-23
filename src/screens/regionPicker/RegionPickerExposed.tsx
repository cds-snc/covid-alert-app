import React from 'react';
import {Box, Text, Icon} from 'components';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Region} from 'shared/Region';

interface RegionItemProps {
  code: Region;
  name: string;
  lastItem?: boolean;
  onPress: (code: Region) => void;
  testID?: string;
}

export const regionData: Omit<RegionItemProps, 'onPress' | 'selected' | 'name'>[] = [
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
];

const RegionItem_ = ({code, onPress, name, lastItem, testID}: RegionItemProps) => (
  <>
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(code)} accessibilityRole="button" testID={testID}>
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
        <Box maxWidth="90%">
          <Text variant="bodyText" color="overlayBodyText" marginHorizontal="s">
            {name}
          </Text>
        </Box>
        <Box alignSelf="center" width={15}>
          <Icon size={25} name="icon-external-arrow" />
        </Box>
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
