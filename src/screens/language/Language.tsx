import React, {useCallback} from 'react';
import {TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Icon, Toolbar} from 'components';
import {useStorage} from 'services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';

interface LanguageSelectItemProps {
  onPress: () => void;
  text: string;
  isActive?: boolean;
  firstItem?: boolean;
  lastItem?: boolean;
}
const LanguageSelectItem = ({onPress, text, firstItem, lastItem, isActive}: LanguageSelectItemProps) => (
  <>
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{selected: isActive}}
    >
      <Box
        paddingVertical="s"
        marginHorizontal="-m"
        paddingHorizontal="m"
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
        backgroundColor="infoBlockNeutralBackground"
        borderColor="gray2"
        borderWidth={1}
        borderRadius={5}
        borderTopLeftRadius={firstItem ? 10 : 5}
        borderTopRightRadius={firstItem ? 10 : 5}
        borderBottomLeftRadius={lastItem ? 10 : 5}
        borderBottomRightRadius={lastItem ? 10 : 5}
      >
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
    {!lastItem && <Box height={5} marginHorizontal="-m" backgroundColor="overlayBackground" />}
  </>
);

export const LanguageScreen = () => {
  const i18n = useI18n();
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
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('LanguageSelect.Close')}
          navLabel={i18n.translate('LanguageSelect.Close')}
          onIconClicked={close}
        />
        <ScrollView>
          <Text
            paddingHorizontal="m"
            variant="bodyTitle"
            color="bodyText"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('LanguageSelect.Title')}
          </Text>
          <Box marginHorizontal="m" paddingHorizontal="m" marginTop="m" accessibilityRole="radiogroup">
            <LanguageSelectItem
              onPress={toggle('en')}
              text={i18n.translate('LanguageSelect.En')}
              isActive={i18n.locale === 'en'}
              firstItem
            />
            <LanguageSelectItem
              onPress={toggle('fr')}
              text={i18n.translate('LanguageSelect.Fr')}
              isActive={i18n.locale === 'fr'}
              lastItem
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
