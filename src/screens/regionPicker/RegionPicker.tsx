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

const items: Omit<RegionItemProps, 'onPress' | 'selected' | 'name'>[] = [
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

const RegionItem_ = ({code, onPress, name, flagIcon, selected}: RegionItemProps) => (
  <>
    <TouchableOpacity onPress={() => onPress(code)} accessibilityRole="radio" accessibilityState={{selected}}>
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
          <Box flex={1} paddingHorizontal="m" paddingTop="m">
            <Text variant="bodySubTitle" color="overlayBodyText" textAlign="center" accessibilityRole="header">
              {i18n.translate('RegionPicker.Title')}
            </Text>
            <Text marginVertical="m" variant="bodyText" color="overlayBodyText" textAlign="center">
              {i18n.translate('RegionPicker.Body')}
            </Text>
            <Box
              paddingHorizontal="m"
              borderRadius={10}
              backgroundColor="infoBlockNeutralBackground"
              accessibilityRole="radiogroup"
            >
              {items.map(item => {
                return (
                  <RegionItem
                    key={item.code}
                    selected={selectedRegion === item.code}
                    onPress={setSelectedRegion}
                    name={i18n.translate(`RegionPicker.${item.code}`)}
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
          shadowColor="infoBlockNeutralBackground"
          shadowOffset={{width: 0, height: 2}}
          shadowOpacity={0.5}
          shadowRadius={2}
          elevation={10}
        >
          <Button
            text={i18n.translate(`RegionPicker.${selectedRegion === 'None' ? 'Skip' : 'GetStarted'}`)}
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
