import React from 'react';
import {Box, Text, Icon} from 'components';
import {StyleSheet, TouchableOpacity} from 'react-native';
import AbFlag from 'assets/flags/ab-flag.png';
import BcFlag from 'assets/flags/bc-flag.png';
import MbFlag from 'assets/flags/mb-flag.png';
import NbFlag from 'assets/flags/nb-flag.png';
import NlFlag from 'assets/flags/nl-flag.png';
import NtFlag from 'assets/flags/nt-flag.png';
import NsFlag from 'assets/flags/ns-flag.png';
import NuFlag from 'assets/flags/nu-flag.png';
import OnFlag from 'assets/flags/on-flag.png';
import PeFlag from 'assets/flags/pe-flag.png';
import QcFlag from 'assets/flags/qc-flag.png';
import SkFlag from 'assets/flags/sk-flag.png';
import YtFlag from 'assets/flags/yt-flag.png';
import {Region} from 'shared/Region';

interface RegionItemProps {
  code: Region;
  flagIcon: any;
  name: string;
  selected: boolean;
  onPress: (code: Region) => void;
}

export const regionData: Omit<RegionItemProps, 'onPress' | 'selected' | 'name'>[] = [
  {code: 'AB', flagIcon: AbFlag},
  {code: 'BC', flagIcon: BcFlag},
  {code: 'MB', flagIcon: MbFlag},
  {code: 'NB', flagIcon: NbFlag},
  {code: 'NL', flagIcon: NlFlag},
  {code: 'NT', flagIcon: NtFlag},
  {code: 'NS', flagIcon: NsFlag},
  {code: 'NU', flagIcon: NuFlag},
  {code: 'ON', flagIcon: OnFlag},
  {code: 'PE', flagIcon: PeFlag},
  {code: 'QC', flagIcon: QcFlag},
  {code: 'SK', flagIcon: SkFlag},
  {code: 'YT', flagIcon: YtFlag},
];

const RegionItem_ = ({code, onPress, name, selected}: RegionItemProps) => (
  <>
    <TouchableOpacity onPress={() => onPress(code)} accessibilityRole="radio" accessibilityState={{selected}}>
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
export const RegionItem = React.memo(RegionItem_);

export const regionStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flag: {
    width: 40,
    height: 22,
    resizeMode: 'stretch',
  },
});
