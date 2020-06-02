import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon} from 'components';
import {StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
import OnboardingBg from 'assets/onboarding-bg.svg';
import {Region} from 'shared/Region';

interface RegionItemProps {
  code: Region;
  icon: any;
  name: string;
  selected: boolean;
  onPress: (code: Region) => void;
}

const items: Omit<RegionItemProps, 'onPress' | 'selected'>[] = [
  {code: 'AB', icon: '', name: 'Alberta'},
  {code: 'BC', icon: '', name: 'British Columbia'},
  {code: 'MB', icon: '', name: 'Manitoba'},
  {code: 'NB', icon: '', name: 'New Brunswick'},
  {code: 'NL', icon: '', name: 'Newfoundland and Labrador'},
  {code: 'NT', icon: '', name: 'Northwest Territories'},
  {code: 'NS', icon: '', name: 'Nova Scotia'},
  {code: 'NU', icon: '', name: 'Nunavut'},
  {code: 'ON', icon: '', name: 'Ontario'},
  {code: 'PE', icon: '', name: 'Prince Edward Island'},
  {code: 'QC', icon: '', name: 'Quebec'},
  {code: 'SK', icon: '', name: 'Saskatchewan'},
  {code: 'YT', icon: '', name: 'Yukon'},
];

const RegionItem_ = ({code, onPress, name, icon, selected}: RegionItemProps) => (
  <>
    <TouchableOpacity onPress={() => onPress(code)}>
      <Box paddingVertical="s" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Text variant="bodyText" marginVertical="s" color="overlayBodyText">
          {name}
        </Text>
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
