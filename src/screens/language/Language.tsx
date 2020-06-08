import React, {useCallback} from 'react';
import {TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Icon, Toolbar} from 'components';
import {useStorage} from 'services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';

interface LanguageSelectItemProps {
  onPress: () => void;
  text: string;
  isActive?: boolean;
}
const LanguageSelectItem = ({onPress, text, isActive}: LanguageSelectItemProps) => (
  <>
    <TouchableOpacity onPress={onPress} accessibilityRole="radio" accessibilityState={{selected: isActive}}>
      <Box paddingVertical="s" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Text variant="bodyText" marginVertical="s" color="overlayBodyText">
          {text}
        </Text>
        {isActive && (
          <Box alignSelf="center">
            <Icon size={32} name="icon-check" />
          </Box>
        )}
      </Box>
    </TouchableOpacity>
    <Box height={1} marginHorizontal="-m" backgroundColor="overlayBackground" />
  </>
);

export const LanguageScreen = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const {setLocale} = useStorage();
  const toggle = useCallback(
    (newLocale: 'en' | 'fr') => () => {
      setLocale(newLocale);
    },
    [setLocale],
  );

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title={i18n.translate('LanguageSelect.Title')}
          navIcon="icon-back-arrow"
          navText={i18n.translate('LanguageSelect.Close')}
          navLabel={i18n.translate('LanguageSelect.Close')}
          onIconClicked={close}
        />
        <ScrollView>
          <Box
            marginHorizontal="m"
            paddingHorizontal="m"
            borderRadius={10}
            backgroundColor="infoBlockNeutralBackground"
            marginTop="m"
            accessibilityRole="radiogroup"
          >
            <LanguageSelectItem
              onPress={toggle('en')}
              text={i18n.translate('LanguageSelect.En')}
              isActive={i18n.locale === 'en'}
            />
            <LanguageSelectItem
              onPress={toggle('fr')}
              text={i18n.translate('LanguageSelect.Fr')}
              isActive={i18n.locale === 'fr'}
            />
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
