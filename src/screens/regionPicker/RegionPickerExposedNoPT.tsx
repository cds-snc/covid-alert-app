import React, {useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Toolbar, Text, TextMultiline} from 'components';
import {ScrollView, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import {getExposedHelpURL, getExposedHelpMenuURL} from 'shared/RegionLogic';
import {useRegionalI18n} from 'locale/regional';
import {captureException} from 'shared/log';

import {regionData, RegionItem, regionStyles} from './RegionPickerExposed';

export const RegionPickerExposedNoPTScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const route: any = useRoute();
  const regionalI18n = useRegionalI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  const onPress = useCallback(
    region => {
      if (route.params?.drawerMenu) {
        // view loaded from drawer menu
        Linking.openURL(getExposedHelpMenuURL(region, regionalI18n)).catch(error =>
          captureException('An error occurred', error),
        );
      } else {
        // view loaded from exposed screen
        Linking.openURL(getExposedHelpURL(region, regionalI18n)).catch(error =>
          captureException('An error occurred', error),
        );
      }
    },
    [regionalI18n, route.params],
  );

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={regionStyles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('RegionPicker.Close')}
          navLabel={i18n.translate('RegionPicker.Close')}
          onIconClicked={close}
        />
        <ScrollView style={regionStyles.flex} testID="RegionPickerSettings-ScrollView">
          <Text
            paddingHorizontal="m"
            marginBottom="m"
            variant="bodyTitle"
            color="bodyText"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('RegionPickerNoPT.Exposed.Title')}
          </Text>
          <TextMultiline
            paddingHorizontal="m"
            marginVertical="s"
            variant="bodyText"
            color="overlayBodyText"
            text={i18n.translate('RegionPickerNoPT.Exposed.Body')}
          />
          <Box flex={1} paddingHorizontal="m" marginBottom="m">
            <Box marginTop="l" paddingHorizontal="m" borderRadius={10} overflow="hidden">
              {regionData.map(item => {
                return (
                  <RegionItem
                    testID={`RegionPickerSettings-${item.code}`}
                    key={item.code}
                    onPress={() => {
                      onPress(item.code);
                    }}
                    name={i18n.translate(`RegionPicker.${item.code}`)}
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
