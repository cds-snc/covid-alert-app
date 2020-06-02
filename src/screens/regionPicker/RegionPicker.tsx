import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon, Button} from 'components';
import {StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
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

const RegionItem_ = ({code, onPress, name, flagIcon, selected}: RegionItemProps) => (
  <>
    <TouchableOpacity onPress={() => onPress(code)}>
      <Box paddingVertical="s" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" paddingVertical="s">
          <Image source={flagIcon} style={styles.flag} />
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
const RegionItem = React.memo(RegionItem_);

export const RegionPickerScreen = () => {
  const [i18n] = useI18n();
  const {setRegion: persistRegion} = useStorage();
  const [selectedRegion, setSelectedRegion] = useState<Region>('None');
  const {navigate} = useNavigation();

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
        <Box
          backgroundColor="overlayBackground"
          padding="m"
          borderTopColor="infoBlockNeutralBackground"
          borderTopWidth={1}
        >
          <Button
            text={selectedRegion === 'None' ? 'Skip' : 'Get started'}
            variant={selectedRegion === 'None' ? 'bigHollow' : 'bigFlat'}
            onPress={async () => {
              await persistRegion(selectedRegion);
              navigate('OnboardingTutorial');
            }}
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flag: {
    width: 40,
    height: 22,
    resizeMode: 'stretch',
  },
});
