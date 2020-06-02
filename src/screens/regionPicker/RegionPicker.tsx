import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon} from 'components';
import {StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
import AbFlag from 'assets/flags/ab-flag.svg';
import BcFlag from 'assets/flags/bc-flag.svg';
import MbFlag from 'assets/flags/mb-flag.svg';
import NbFlag from 'assets/flags/nb-flag.svg';
import NlFlag from 'assets/flags/nl-flag.svg';
import NtFlag from 'assets/flags/nt-flag.svg';
import NsFlag from 'assets/flags/ns-flag.svg';
import NuFlag from 'assets/flags/nu-flag.svg';
import OnFlag from 'assets/flags/on-flag.svg';
import PeFlag from 'assets/flags/pe-flag.svg';
import QcFlag from 'assets/flags/qc-flag.svg';
import SkFlag from 'assets/flags/sk-flag.svg';
import YtFlag from 'assets/flags/yt-flag.svg';
import {Region} from 'shared/Region';

interface RegionItemProps {
  code: Region;
  flagIcon: any;
  name: string;
  selected: boolean;
  onPress: (code: Region) => void;
}

const items: Omit<RegionItemProps, 'onPress' | 'selected'>[] = [
  {code: 'AB', flagIcon: AbFlag, name: 'Alberta'},
  {code: 'BC', flagIcon: BcFlag, name: 'British Columbia'},
  {code: 'MB', flagIcon: MbFlag, name: 'Manitoba'},
  {code: 'NB', flagIcon: NbFlag, name: 'New Brunswick'},
  {code: 'NL', flagIcon: NlFlag, name: 'Newfoundland and Labrador'},
  {code: 'NT', flagIcon: NtFlag, name: 'Northwest Territories'},
  {code: 'NS', flagIcon: NsFlag, name: 'Nova Scotia'},
  {code: 'NU', flagIcon: NuFlag, name: 'Nunavut'},
  {code: 'ON', flagIcon: OnFlag, name: 'Ontario'},
  {code: 'PE', flagIcon: PeFlag, name: 'Prince Edward Island'},
  {code: 'QC', flagIcon: QcFlag, name: 'Quebec'},
  {code: 'SK', flagIcon: SkFlag, name: 'Saskatchewan'},
  {code: 'YT', flagIcon: YtFlag, name: 'Yukon'},
];

const RegionItem_ = ({code, onPress, name, flagIcon: FlagIcon, selected}: RegionItemProps) => (
  <>
    <TouchableOpacity onPress={() => onPress(code)}>
      <Box paddingVertical="s" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" paddingVertical="s">
          <FlagIcon width={50} height={20} />
          <Text variant="bodyText" color="overlayBodyText" marginHorizontal="s">
            {name}
          </Text>
        </Box>
        <Box alignSelf="center">{selected && <Icon size={32} name="icon-check" />}</Box>
      </Box>
    </TouchableOpacity>
    <Box height={1} marginHorizontal="-m" backgroundColor="overlayBackground" />
  </>
);
const RegionItem = React.memo(RegionItem_);

export const RegionPickerScreen = () => {
  const [i18n] = useI18n();
  const {setRegion: persistRegion} = useStorage();
  const [selectedRegion, setSelectedRegion] = useState<Region>('None');
  const navigation = useNavigation();

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <ScrollView style={styles.flex}>
          <Box flex={1} paddingHorizontal="m">
            <Text variant="bodySubTitle" color="overlayBodyText" textAlign="center">
              Select your province or territory
            </Text>
            <Text marginVertical="m" variant="bodyText" color="overlayBodyText" textAlign="center">
              This helps give you more relevant guidance.{'\n'}This information is only stored on your device and will
              never be shared with anyone else.
            </Text>
            <Box paddingHorizontal="m" borderRadius={10} backgroundColor="infoBlockNeutralBackground">
              {items.map(item => {
                return (
                  <RegionItem
                    key={item.code}
                    selected={selectedRegion === item.code}
                    onPress={setSelectedRegion}
                    {...item}
                  />
                );
              })}
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
