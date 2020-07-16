import React, {useCallback} from 'react';
import {Image, ScrollView, StyleSheet} from 'react-native';
import {useStorage} from 'services/StorageService';
import {Box, Button, Icon} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
const landingPNG = require('assets/landing.png');

export const LandingScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const {setLocale} = useStorage();
  const toggle = useCallback(
    (newLocale: 'en' | 'fr') => () => {
      setLocale(newLocale);
      navigation.navigate('Home');
    },
    [setLocale],
  );
  return (
    <ScrollView style={styles.flex}>
      <Box flex={1} backgroundColor="overlayBackground">
        <Box marginBottom="s" style={{backgroundColor: '#EEEEEE'}}>
          <Box paddingHorizontal="m" paddingBottom="xl">
            <Image style={{marginTop: 60, paddingBottom: 20}} accessible source={landingPNG} />
          </Box>
        </Box>

        <Box>
          <Box paddingHorizontal="m" marginTop="l" marginBottom="l">
            <Button onPress={toggle('en')} text={i18n.translate('Landing.En')} variant="thinFlat" />
          </Box>
          <Box paddingHorizontal="m" marginBottom="s">
            <Button onPress={toggle('fr')} text={i18n.translate('Landing.Fr')} variant="thinFlat" />
          </Box>

          <Box alignSelf="center">
            <Icon size={150} name="canada-logo" />
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
